import { ReplacerType } from "@/replacers";
import { settingsStorage } from "@/storage";

export default defineContentScript({
    matches: ["*://*/*"],
    async main() {
        const settings = await settingsStorage.getValue();
        watchAndReplace(document.body, settings.replacers);

        settingsStorage.watch((newSettings) => {
            watchAndReplace(document.body, newSettings.replacers);
        });
    },
});

function watchAndReplace(root: Node, replaces: ReplacerType[]) {
    const alreadyVisitedNodes = new WeakSet<Node>();

    const compiledReplaces = replaces
        .filter((r) => !!r.enabled)
        .map((replacer) => {
            const safeReplacerFrom = replacer.from.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );

            const match = new RegExp(`\\b${safeReplacerFrom}\\b`, "gi");

            const ignore =
                replacer.ignorePrefix && replacer.ignorePrefix.length ?
                    new RegExp(
                        `^[${replacer.ignorePrefix
                            .map((prefix) => prefix.replace(/[\\\]-]/g, "\\$&"))
                            .join("")}]`,
                    )
                :   null;

            return { match, ignore, to: replacer.to };
        });

    const quickCheckPattern = new RegExp(
        replaces
            .map((r) => r.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|"),
        "i",
    );

    const SKIP_TAGS = new Set([
        "SCRIPT",
        "STYLE",
        "TEXTAREA",
        "INPUT",
        "NOSCRIPT",
        "CODE",
        "PRE",
    ]);

    const replaceText = (node: Node) => {
        if (alreadyVisitedNodes.has(node)) return;

        if (node.nodeType !== Node.TEXT_NODE) {
            alreadyVisitedNodes.add(node);
            node.childNodes.forEach(replaceText);
            return;
        }

        if (!node.nodeValue) return;

        const parent = node.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName)) {
            return;
        }

        if (!quickCheckPattern.test(node.nodeValue)) return;

        let text = node.nodeValue;
        let changed = false;

        for (const replacer of compiledReplaces) {
            text = text.replace(replacer.match, (match, offset, str) => {
                if (node.nodeValue === replacer.to) return match;

                const prevText = text[offset - 1];
                const afterText = text[offset + match.length];
                const afterDot = text[offset + match.length + 1];
                if (
                    (afterText === "." && afterDot && /[a-z0-9]/i.test(afterDot)) || (prevText === "." && afterText === ".")
                ) {
                    return match;
                }

                if (
                    replacer.ignore &&
                    prevText &&
                    replacer.ignore.test(prevText)
                ) {
                    return match;
                }
                changed = true;
                return replacer.to;
            });
        }

        if (changed) {
            alreadyVisitedNodes.add(node);
            node.nodeValue = text;
        }
    };

    const replaceTitle = () => {
        if (!document.title || !quickCheckPattern.test(document.title)) return;
        let title = document.title;
        let changed = false;

        for (const replacer of compiledReplaces) {
            title = title.replace(replacer.match, replacer.to);
        }

        document.title = title;
    };

    replaceText(root);
    replaceTitle();

    const titleNode = document.querySelector("head title");
    if (titleNode) {
        const observer = new MutationObserver(() => {
            replaceTitle();
        });

        observer.observe(titleNode, { characterData: true, subtree: true });
    }

    let mutationBatch: Node[] = [];
    let batchTimeout: NodeJS.Timeout | null = null;

    const processBatch = () => {
        const nodes = [...new Set(mutationBatch)];
        nodes.forEach(replaceText);
        mutationBatch = [];
        batchTimeout = null;
    };

    new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === "characterData") {
                mutationBatch.push(m.target);
            } else {
                m.addedNodes.forEach((node) => mutationBatch.push(node));
            }
        }

        if (batchTimeout !== null) clearTimeout(batchTimeout);
        batchTimeout = setTimeout(processBatch, 10);
    }).observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
    });
}
