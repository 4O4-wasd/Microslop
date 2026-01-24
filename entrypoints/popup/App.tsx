import { AppSettings, settingsStorage } from "@/storage";
import Replacer from "./Replacer";
import logo from "/icon/128.png";

const App = () => {
    const [settings, setSettings] = createSignal<AppSettings | null>(null);

    createEffect(() => {
        settingsStorage.getValue().then(setSettings);

        const unwatch = settingsStorage.watch((newValue) => {
            setSettings(newValue);
        });

        return unwatch;
    });
    return (
        <div class="min-w-md text-gray-800 gap-4  min-h-screen m-0 bg-white p-4 flex flex-col items-center">
            <div class="flex items-center gap-1.5">
                <img src={logo} class="size-10" />
                <h1 class="font-semibold text-3xl tracking-tight text-[#737373]">
                    Microslop
                </h1>
            </div>

            <div class="flex flex-col w-full gap-2">
                <span class="font-medium text-xs">Replacers</span>
                {settings()?.replacers && (
                    <For each={settings()!.replacers} fallback={"Loading..."}>
                        {(replacer) => <Replacer {...replacer} />}
                    </For>
                )}
            </div>
            <p>Kindly refresh the page after you have disabled any replacer</p>
        </div>
    );
};

export default App;
