import { replacers, ReplacerType } from "@/replacers";
import { storage } from "wxt/utils/storage";

export type AppSettings = {
    replacers: ReplacerType[];
};

function upgradeAISettings(oldSettings: AppSettings): AppSettings {
    return {
        ...oldSettings,
        replacers: [
            ...oldSettings.replacers
                .filter((rule) => rule.from !== "AI")
                .map((rule) =>
                    rule.from === "Artificial Intelligence" ?
                        {
                            ...rule,
                            ...replacers.find((r) => r.from === rule.from)!,
                            ignorePrefix: undefined,
                            enabled: rule.enabled,
                        }
                    :   rule,
                ),
            {
                ...replacers.find((rule) => rule.from === "AI")!,
                enabled:
                    oldSettings.replacers.find((rule) => rule.from === "AI")?.enabled ?? true,
            },
        ],
    };
}

export const settingsStorage = storage.defineItem<AppSettings>(
    "local:settings",
    {
        version: 4,
        migrations: {
            2: upgradeAISettings,
            3: upgradeAISettings,
            4: upgradeAISettings,
        },
        fallback: {
            replacers,
        },
    },
);
