// ==================================================
// PREVENT DEFAULT KEYBOARD SHORTCUTS
// ==================================================
import { blockKeyboardDefaults } from '../base/base.js';
const resetBrowserBehavior = blockKeyboardDefaults();

// ==================================================
// SHORT-CUT KEYS DEFINITION
// ==================================================

const wizardShortcuts = [
    { ctrl: true, shift: false, alt: true, key: "n", targetId: "newClientWizard" },
    { ctrl: true, shift: false, alt: true, key: "u", targetId: "updateClientWizard" },
    { ctrl: true, shift: false, alt: true, key: "d", targetId: "deleteClientWizard" },
    { ctrl: false, shift: true, alt: true, key: "n", targetId: "newServiceWizard" },
    { ctrl: false, shift: true, alt: true, key: "p", targetId: "newPaymentWizard" },
];

// ==================================================
// WIZARD CLOSE SYSTEM
// ==================================================

const closeBtns = document.querySelectorAll("#closeWizard");

// * FUNCTION TO CLOSE ANY WIZARD BY WIZARD-ELEMENT
export function closeWizard(wizard) {
    if (!wizard || !wizard.classList.contains("open")) {return;}
    wizard.classList.remove('open');
}

// * FUNCTION TO CLOSE WIZARD BY WIZARD-ID
export function closeAllWizards() {
    let allOpenedWizards = document.querySelectorAll(".wizard-container.open");
    if (allOpenedWizards.length <= 0) {return;}

    allOpenedWizards.forEach((wizard) => {
        wizard.classList.remove('open');
    })
}

// * FUNCTION TO CLOSE ONLY THE LAST OPENED WIZARD
export function closeLastOpenedWizard() {
    const openWizards = document.querySelectorAll(".wizard-container.open");
    const lastOpenedWizard = openWizards[openWizards.length - 1];

    if (!lastOpenedWizard) {
        return;
    }

    lastOpenedWizard.classList.remove("open");
}

// ==================================================
// WIZARD OPEN SYSTEM
// ==================================================

// * FUNCTION TO OPEN ANY WIZARD
export function openWizard(btn, wizard, fillFunction) {
    if (!btn || !wizard) {return;}
    if (fillFunction) {fillFunction(btn.dataset);}
    toggleWizard(wizard);
}

// ==================================================
// WIZARD TOGGLE SYSTEM
// ==================================================

// * FUNCTION TO TOGGLE WIZARD
export function toggleWizard(wizard) {
    if (!wizard) {return;}
    wizard.classList.toggle("open");
}

// * FUNCTION TO TOGGLE WIZARD BY ID
export function toggleWizardById(id) {
    let targetWizard = document.getElementById(id);
    if (targetWizard) {targetWizard.classList.toggle("open");}
}

// ==================================================
// WIZARD RELATED FUNCTIONS FOR CLIENT.JS
// ==================================================

// * FUNCTION TO ATTACH EVENT-LISTENERS TO BUTTONS
export function initButtons(buttons, relatedWizard, fillFunction, additionalFunc) {
    if (!buttons.length) {return;}
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            openWizard(btn, relatedWizard, fillFunction);

            if (additionalFunc) {additionalFunc(btn);}
        })
    });
}

// * FUNCTION TO ADD EVENT-LISTENER TO TOGGLE SPECIFIC WIZARD
export function addToggleWizardListener(btn, wizard) {
    if (!btn || !wizard) {return;}
    btn.addEventListener('click', () => {toggleWizard(wizard)})
}

// * FUNCTION TO OPEN/CLOSE PAYMENTS ACTION TRAY
export function togglePaymentsActionTray(buttons) {
    if (!buttons.length) {return;}
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            let tableRow = btn.closest(".table-row");
            let target = tableRow ? tableRow.querySelector(".management-row") : null;
            if (target) {target.classList.toggle('open');}
        })
    });
}

// ==================================================
// EVENT-LISTENERS FOR WIZARD [INTEGRATES DIRECTLY TO WIZARD'S HTML]
// ==================================================

// * FUNCTION TO CHECK IF ANY SHORTCUT KEY COMBINATION IS PRESSED
export function isMatchingShortcut(event, shortcut) {
    return (
        event.ctrlKey === !!shortcut.ctrl &&
        event.altKey === !!shortcut.alt &&
        event.shiftKey === !!shortcut.shift &&
        event.key.toLowerCase() === shortcut.key.toLowerCase()
    );
}

// & EVENT LISTENER TO CLOSE WIZARD BY [#closeWizard] CLICK
closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetWizard = btn.closest(".wizard-container");
        toggleWizard(targetWizard);
    });
});

// & HANDLE ALL WIZARD RELATED KEYBOARD SHORTCUTS
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLastOpenedWizard();
        return;
    }

    const matchedShortcut = wizardShortcuts.find((shortcut) => isMatchingShortcut(event, shortcut));

    if (matchedShortcut) {
        event.preventDefault();
        toggleWizardById(matchedShortcut.targetId);
    }
});
