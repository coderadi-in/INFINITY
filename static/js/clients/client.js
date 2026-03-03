// ==================================================
// UPDATE CLIENT OPEN/CLOSE SYSTEM
// ==================================================

// ? GETTING DOC ELEMENTS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");

const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");

// ? IMPORTING FUNCTIONS
import { toggleWizard } from "../base/wizard.js";

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
