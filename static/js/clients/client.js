// ==================================================
// CONSTANT DEFINITION
// ==================================================

// ? GETTING DOC ELEMENTS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");
const newServiceBtn = document.getElementById("newServiceBtn");

const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");
const newServiceWizard = document.getElementById("newService");

// ==================================================
// IMPORTS
// ==================================================

// ? IMPORTING FUNCTIONS
import { toggleWizard, closeLastOpenedWizard, closeAllWizards } from "../base/wizard.js";

// ==================================================
// MOUSE EVENT LISTENERS
// ==================================================

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

// & EVENT LISTENER FOR NEW-SERVICE-BTN CLICK
if (newServiceBtn) {
    newServiceBtn.addEventListener('click', () => {
        toggleWizard(newServiceWizard);
    })
}

// ==================================================
// KEYBOARD EVENT LISTENERS
// ==================================================

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