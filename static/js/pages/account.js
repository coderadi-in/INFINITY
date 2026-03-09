// ==================================================
// ACCESS ELEMENTS
// ==================================================

// ? FETCH BASIC BUTTONS
const updateProfileBtn = document.getElementById('updateProfileBtn');

// ? FETCH ALL WIZARDS
const updateProfileWizard = document.getElementById('updateProfileWizard');

// ==================================================
// IMPORTS
// ==================================================

import { toggleWizard } from '../base/wizard.js';

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR UPDATE-PROFILE-BTN CLICK
updateProfileBtn.addEventListener('click', () => {
    toggleWizard(updateProfileWizard);
})