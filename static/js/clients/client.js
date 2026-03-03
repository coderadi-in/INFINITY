// ==================================================
// UPDATE CLIENT OPEN/CLOSE SYSTEM
// ==================================================

// ? GETTING DOC ELEMENTS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");

const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");

// ? IMPORTING FUNCTIONS
import { toggleWizard, closeLastOpenedWizard, closeAllWizards } from "../base/wizard.js";

// & EVENT LISTENER FOR UPDATE-CLIENT-BTN CLICK
if (updateClientBtn) {
    updateClientBtn.addEventListener('click', () => {
        toggleWizard(updateClientWizard);
    });
}

// & EVENT LISTENER FOR DELETE-CLIENT-BTN CLICK
if (deleteClientBtn) {
    deleteClientBtn.addEventListener('click', () => {
        toggleWizard(deleteClientWizard);
    });
}

// & EVENT LISTENER FOR ESC-PRESS
document.addEventListener('keydown', (e) => {
    if (e.key == 'esc') {
        e.preventDefault();
        closeLastOpenedWizard();
    }

    if (e.ctrlKey && e.shiftKey && e.key == "Backspace") {
        e.preventDefault();
        closeAllWizards();
    }
})