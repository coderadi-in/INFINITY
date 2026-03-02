// ==================================================
// PREVENT DEFAULT KEYBOARD SHORTCUTS
// ==================================================
import { blockKeyboardDefaults } from '../base/base.js';
blockKeyboardDefaults();

// ==================================================
// WIZARD OPEN/CLOSE SYSTEM
// ==================================================

const closeBtn = document.getElementById("closeWizard");
const wizard = document.querySelector(".wizard-container");

// * FUNCTION TO TOGGLE WIZARD
function toggleWizard() {
    if (!wizard) {
        return;
    }

    wizard.classList.toggle("open");
}

// & EVENT LISTENER TO CLOSE WIZARD
if (closeBtn) {
    closeBtn.addEventListener("click", toggleWizard);
}

// & SHORTCUT: CTRL + ALT + N TO TOGGLE WIZARD
document.addEventListener("keydown", (event) => {
    // Use lowercase compare so Shift state does not matter.
    const isShortcut = event.ctrlKey && event.altKey && event.key.toLowerCase() === "n";

    if (isShortcut) {
        toggleWizard();
    }
});