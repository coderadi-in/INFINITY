// * FUNCTION TO CREATE A TIMEOUT
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// * FUNCTION TO GET SYSTEM THEME
export const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'body-dark';
    }
    return 'body-light';
};

// * FUNCTION TO TOGGLE THEME OF SOFTWARE
export function toggleTheme(theme) {
    if (!theme) { return; }

    if (theme == 'dark') { document.body.classList.add('body-dark'); }
    else if (theme == 'light') { document.body.classList.remove('body-dark'); }
    else if (theme == 'system') { document.body.classList.add(getSystemTheme()); }
    else { return; }
}

// * FUNCTION TO SAVE NEW THEME IN LOCALSTORAGE
export function saveTheme(theme) { localStorage.setItem('theme', theme); }

// * FUNCTION TO GET SAVED THEME FROM LOCALSTORAGE
export function getTheme() { return localStorage.getItem('theme'); }

// * FUNCTION TO SAVE SIDEBAR TOGGLE IN LOCALSTORAGE
export function saveSidebarToggle(toggle) { localStorage.setItem('sidebar', toggle); }

// * FUNCTION TO GET SIDEBAR TOGGLE FROM LOCALSTORAGE
export function getSidebarToggle() { return localStorage.getItem('sidebar'); }

// * FUNCTION TO REDIRECT USER TO ANY PAGE
export function confirmRedirect(btn) {
    if (!btn) { return; }
    const redirectUrl = btn.dataset.redirectUrl;
    if (!redirectUrl) { return; }
    window.location.href = redirectUrl;
}

// * FUNCTION TO GET CLIENT-ID FROM URL PATH
export function getClientIdFromPath() {
    return window.location.pathname.split("/")[2] || "";
}

// * FUNCTION TO BLOCK DEFAULT BROWSER BEHAVIOR
export const blockKeyboardDefaults = (target = document) => {
    const blockedPlainKeys = new Set(["f1"]);

    const blockedCtrlKeys = new Set([
        "l", // focus address bar
        "r", // reload
        "t", // new tab
        "w", // close tab
        "n", // new window
        "u", // page source
        "w", // search google
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
            if (key === "n") return true; // incognito tab
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