// ==================================================
// PREVENT DEFAULT KEYBOARD SHORTCUTS
// ==================================================
import { blockKeyboardDefaults } from '../base/base.js';
blockKeyboardDefaults();

// ==================================================
// SHORT-CUT KEYS DEFINITION
// ==================================================

const wizardShortcuts = [
    { ctrl: true, alt: true, key: "n", targetId: "newClientWizard" },
    { ctrl: true, alt: true, key: "u", targetId: "updateClientWizard" },
    { ctrl: true, alt: true, key: "d", targetId: "deleteClientWizard" },
];

// ==================================================
// WIZARD OPEN/CLOSE SYSTEM
// ==================================================

const closeBtns = document.querySelectorAll("#closeWizard");

// * FUNCTION TO TOGGLE WIZARD
export function toggleWizard(wizard) {
    if (!wizard) {
        return;
    }

    wizard.classList.toggle("open");
}

// & EVENT LISTENER TO CLOSE WIZARD
closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetWizard = btn.closest(".wizard-container");
        toggleWizard(targetWizard);
    });
});

// * FUNCTION TO CHECK IF ANY SHORTCUT KEY COMBINATION IS PRESSED
function isMatchingShortcut(event, shortcut) {
    return (
        event.ctrlKey === !!shortcut.ctrl &&
        event.altKey === !!shortcut.alt &&
        event.key.toLowerCase() === shortcut.key.toLowerCase()
    );
}

// * FUNCTION TO TOGGLE WIZARD BY ID
export function toggleWizardById(id) {
    let targetWizard = document.getElementById(id);
    if (targetWizard) {targetWizard.classList.toggle("open");}
}

// * FUNCTION TO CLOSE WIZARD BY ID
export function closeAllWizards() {
    let allOpenedWizards = document.querySelectorAll(".wizard-container.open");
    if (allOpenedWizards.length <= 0) {return;}

    allOpenedWizards.forEach((wizard) => {
        wizard.classList.remove('open');
    })
}

// * FUNCTION TO CLOSE ONLY THE LAST OPENED WIZARD
// Finds all currently open wizard containers and closes the most recent one.
export function closeLastOpenedWizard() {
    const openWizards = document.querySelectorAll(".wizard-container.open");
    const lastOpenedWizard = openWizards[openWizards.length - 1];

    if (!lastOpenedWizard) {
        return;
    }

    lastOpenedWizard.classList.remove("open");
}

// & HANDLE ALL WIZARD SHORTCUTS
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLastOpenedWizard();
        return;
    }

    const matchedShortcut = wizardShortcuts.find((shortcut) => isMatchingShortcut(event, shortcut));

    if (matchedShortcut) {
        toggleWizardById(matchedShortcut.targetId);
    }
});
