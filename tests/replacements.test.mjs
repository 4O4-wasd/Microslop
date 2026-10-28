import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadSource(path, globals = {}) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
        .replace(/^import .*;\r?\n/gm, '');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const context = { exports: {}, ...globals };
    vm.runInNewContext(compiled, context);
    return context.exports;
}

const { replacers } = loadSource('../replacers.ts');

async function replacePage(text, rules = replacers) {
    const node = { nodeType: 3, nodeValue: text, parentElement: { tagName: 'P' } };
    const document = {
        body: { nodeType: 1, childNodes: [node] },
        title: text,
        querySelector: () => null,
    };
    const script = loadSource('../entrypoints/content.ts', {
        document, Node: { TEXT_NODE: 3 }, setTimeout, clearTimeout,
        defineContentScript: (value) => value,
        settingsStorage: {
            getValue: async () => ({ replacers: rules }), watch() {},
        },
        MutationObserver: class { observe() {} },
    });
    await script.default.main();
    return { body: node.nodeValue, title: document.title };
}

test('AI and full phrase convert alongside the original enabled rules', async () => {
    const result = await replacePage('Microsoft Satya Nadella AI ai Ai AI. @AI #AI Artificial Intelligence artificial intelligence. OpenAI email chair Copilot');
    const expected = 'Microslop Slopya Nuttela SI SI SI SI. @SI #SI Super Intelligence previously (Actually Indians) Super Intelligence previously (Actually Indians). OpenAI email chair Copilot';
    assert.equal(result.body, expected);
    assert.equal(result.title, expected);
});

test('optional rules still work and run before the AI abbreviation rule', async () => {
    const result = await replacePage('Copilot Windows Xbox Game Pass OneDrive GitHub Azure Generative AI GenAI',
        replacers.map((rule) => ({ ...rule, enabled: true })));
    assert.equal(result.body, 'Slopilot Bindoj GreedYbox Gay Pass CloudTumor ShitHub Assure Degenerative SI DegenAI');
});

test('legacy rules retain their punctuation and prefix exceptions', async () => {
    const result = await replacePage('@Microsoft #Microsoft Microsoft. Microsoft');
    assert.equal(result.body, '@Microsoft #Microsoft Microsoft. Microslop');
});

test('migration preserves existing rules and toggles while upgrading the AI rules', async () => {
    let options;
    loadSource('../storage/index.ts', {
        replacers,
        storage: { defineItem: (_key, value) => { options = value; } },
    });
    const oldRules = replacers.filter((rule) => rule.from !== 'AI').map((rule) =>
        rule.from === 'Artificial Intelligence'
            ? { from: rule.from, to: 'Actually Indians', ignorePrefix: ['@', '#'], enabled: false }
            : { ...rule, enabled: rule.from === 'Copilot' });
    const upgraded = options.migrations[2]({ replacers: oldRules });
    assert.equal(options.version, 4);
    assert.equal(upgraded.replacers.length, oldRules.length + 1);
    for (const oldRule of oldRules) {
        const current = upgraded.replacers.find((rule) => rule.from === oldRule.from);
        assert.equal(current.enabled, oldRule.enabled);
        if (oldRule.from !== 'Artificial Intelligence') assert.deepEqual(current, oldRule);
        else {
            assert.equal(current.to, 'Super Intelligence previously (Actually Indians)');
            assert.equal(current.ignorePrefix, undefined);
        }
    }
    assert.equal(upgraded.replacers.at(-1).from, 'AI');
    assert.equal(upgraded.replacers.at(-1).enabled, true);
    const result = await replacePage('Microsoft Copilot AI Artificial Intelligence', upgraded.replacers);
    assert.equal(result.body, 'Microsoft Slopilot SI Artificial Intelligence');
    const again = options.migrations[4](upgraded);
    assert.deepEqual(again, upgraded);
    const previousSISettings = {
        replacers: upgraded.replacers.map((rule) =>
            rule.from === 'Artificial Intelligence'
                ? { ...rule, to: 'Super Intelligence' }
                : rule.from === 'AI' ? { ...rule, enabled: false } : rule),
    };
    const latest = options.migrations[4](previousSISettings);
    assert.equal(latest.replacers.find((rule) => rule.from === 'Artificial Intelligence').to,
        'Super Intelligence previously (Actually Indians)');
    assert.equal(latest.replacers.find((rule) => rule.from === 'AI').enabled, false);
});
