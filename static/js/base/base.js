// ADDS A SIMPLE WAIT FUNCTION TO AVOID CALLBACK HELL IN ANIMATION SEQUENCES
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// PREVENTS ONLY BROWSER SHORTCUT DEFAULTS, NOT NORMAL TYPING.
// Returns a cleanup function so callers can remove the listener when needed.
export const blockKeyboardDefaults = (target = document) => {
    const shortcutKeys = new Set([
        "f1", "f2", "f3", "f4", "f5", "f6",
        "f7", "f8", "f9", "f10", "f11", "f12",
    ]);

    const isBrowserShortcut = (event) => {
        const key = event.key.toLowerCase();

        // Browser shortcuts are usually modifier combos (Ctrl/Cmd/Alt + key)
        // or function keys used by the browser (F1-F12).
        return event.ctrlKey || event.metaKey || event.altKey || shortcutKeys.has(key);
    };

    const preventShortcutDefault = (event) => {
        if (isBrowserShortcut(event)) {
            event.preventDefault();
        }
    };

    // Keydown is enough to stop shortcut defaults before browser actions run.
    target.addEventListener("keydown", preventShortcutDefault);

    return () => {
        target.removeEventListener("keydown", preventShortcutDefault);
    };
};
