import { ReplacerType } from "@/replacers";
import { settingsStorage } from "@/storage";

const Replacer = ({ from, to, enabled }: ReplacerType) => {
    const toggleEnabled = async () => {
        const { replacers } = await settingsStorage.getValue();
        const newReplacers = replacers.map((replacer) =>
            replacer.from === from && replacer.to === to ?
                { ...replacer, enabled: !enabled }
            :   replacer,
        );
        await settingsStorage.setValue({
            replacers: newReplacers,
        });
    };

    return (
        <button
            class="border-2 p-2 gap-1 rounded-lg text-sm font-semibold items-baseline text-left shadow-xs flex flex-col border-gray-200 hover:bg-gray-200 cursor-pointer"
            onClick={toggleEnabled}
            title={
                to === "Actually Indians" ?
                    "I am not a racist. Don't Be A Racist"
                :   undefined
            }
        >
            <label class="flex items-center gap-1">
                <span class="text-xs opacity-80">
                    {enabled ? "Enabled" : "Disabled"}
                </span>
                <input
                    type="checkbox"
                    name="enabled"
                    class="pointer-events-none"
                    tabIndex={-1}
                    checked={enabled}
                />
            </label>
            <span>
                {from} -&gt; {to}
            </span>
            <span class="opacity-70 text-xs max-w-md">
                {to === "Actually Indians" && (
                    <>
                        Actually Indians is a reference to when builder.ai was
                        overworking indians in the name of AI and it was backed
                        by Microslop
                    </>
                )}
            </span>
        </button>
    );
};

export default Replacer;
