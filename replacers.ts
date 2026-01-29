export type ReplacerType = {
    from: string;
    to: string;
    ignorePrefix?: string[];
    enabled?: boolean;
};

export const replacers = [
    {
        from: "Microsoft",
        to: "Microslop",
        ignorePrefix: ["@", "#"],
        enabled: true,
    },
    {
        from: "Satya Nadella",
        to: "Slopya Nuttela",
        ignorePrefix: ["@", "#"],
        enabled: true,
    },
    {
        from: "Satya Narayana Nadella",
        to: "Slopya Nayarana Nuttela",
        ignorePrefix: ["@", "#"],
        enabled: true,
    },
    {
        from: "Artificial Intelligence",
        to: "Actually Indians",
        ignorePrefix: ["@", "#"],
        enabled: true,
    },

    // extras

    {
        from: "Copilot",
        to: "Cockpilot",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Windows",
        to: "Weendos",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Xbox",
        to: "Shitbox",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Game Pass",
        to: "Gay Pass",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "OneDrive",
        to: "LameDrive",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "GitHub",
        to: "ShitHub",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Azure",
        to: "Assure",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Generative AI",
        to: "Degenerative AI",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "GenAI",
        to: "DegenAI",
        ignorePrefix: ["@", "#"],
    },
] satisfies ReplacerType[];
