// ==================================================
// IMPORTS
// ==================================================

import { toggleWizard } from '../base/wizard.js';

// ==================================================
// WIZARD OPEN/CLOSE SYSTEM
// ==================================================

// ? GETTING DOC ELEMENTS
const addClientBtn = document.getElementById("addClientBtn");
const newClientWizard = document.getElementById("newClientWizard");

// & EVENT LISTENER TO OPEN ADD-CLIENT WIZARD
addClientBtn.addEventListener('click', () => {
    toggleWizard(newClientWizard);
})