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
function toggleWizardById(id) {
    const targetWizard = document.getElementById(id);
    if (targetWizard) {targetWizard.classList.toggle("open");}
}

// & HANDLE ALL WIZARD SHORTCUTS
document.addEventListener("keydown", (event) => {
    const matchedShortcut = wizardShortcuts.find((shortcut) => isMatchingShortcut(event, shortcut));

    if (matchedShortcut) {
        toggleWizardById(matchedShortcut.targetId);
    }
});
