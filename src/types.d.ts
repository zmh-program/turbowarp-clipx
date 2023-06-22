/// <reference path="../node_modules/@turbowarp/types/types/scratch-vm-extension.d.ts" />

declare namespace Scratch {
    interface TranslationOption {
        id: string;
        default: string;
    }

    namespace translate {
        // TODO: Is that OK? And is there a translate function in Scratch?
        interface Translation {
            [key: string]: {
                [key: string]: string,
            }
        }

        function setup(translation: Translation): void;
    }

    function translate(option: TranslationOption): string;
}
