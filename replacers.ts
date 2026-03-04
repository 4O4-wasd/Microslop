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
        to: "Slopya Narayana Nuttela",
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
        to: "Slopilot",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Windows",
        to: "Bindoj",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Xbox",
        to: "GreedYbox",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Game Pass",
        to: "Gay Pass",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "OneDrive",
        to: "CloudTumor",
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
    {
        from: "Excel",
        to: "Exslop",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "PowerPoint",
        to: "PowerSlop",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "OneNote",
        to: "NoteSlop",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Outlook",
        to: "Sloplook",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "SharePoint",
        to: "SlopPoint",
        ignorePrefix: ["@", "#"],
    },
    {
        from: "Access",
        to: "Slopccess",
        ignorePrefix: ["@", "#"],
    },
] satisfies ReplacerType[];
