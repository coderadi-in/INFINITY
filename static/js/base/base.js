// ADDS A SIMPLE WAIT FUNCTION TO AVOID CALLBACK HELL IN ANIMATION SEQUENCES
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// PREVENTS ONLY BROWSER SHORTCUT DEFAULTS, NOT NORMAL TYPING.
// Returns a cleanup function so callers can remove the listener when needed.
export const blockKeyboardDefaults = (target = document) => {
    const blockedPlainKeys = new Set(["f1", "f5", "f11", "f12"]);

    const blockedCtrlKeys = new Set([
        "l", // focus address bar
        "r", // reload
        "t", // new tab
        "w", // close tab
        "n", // new window
        "esc" // opens windows search
    ]);

    const isBlockedBrowserShortcut = (event) => {
        const key = event.key.toLowerCase();
        const hasCtrl = event.ctrlKey || event.metaKey;

        if (blockedPlainKeys.has(key)) return true;

        if (hasCtrl && !event.shiftKey && !event.altKey) {
            return blockedCtrlKeys.has(key);
        }

        if (hasCtrl && event.shiftKey) {
            if (key === "t") return true; // reopen last closed tab
            if (key === "r") return true; // hard reload
            if (key === "i" || key === "j" || key === "c") return true; // dev tools
        }

        return false;
    };

    const preventShortcutDefault = (event) => {
        if (isBlockedBrowserShortcut(event)) event.preventDefault();
    };

    // Keydown is enough to stop shortcut defaults before browser actions run.
    target.addEventListener("keydown", preventShortcutDefault);

    return () => {
        target.removeEventListener("keydown", preventShortcutDefault);
    };
};
