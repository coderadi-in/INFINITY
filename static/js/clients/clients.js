// ==================================================
// ELEMENTS REFERENCE
// ==================================================

// ? CLIENT FILTER ELEMENTS
const yearSelect = document.getElementById('yearSelect');
const filterClientBtn = document.getElementById('filterClientBtn');
const clientInfoRows = document.querySelectorAll('.client-info-row');

// ? CLIENT WIZARD ELEMENTS
const addClientBtn = document.getElementById("addClientBtn");
const newClientWizard = document.getElementById("newClientWizard");

// ==================================================
// IMPORTS
// ==================================================

import { toggleWizard } from '../base/wizard.js';

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO CHECK IF CLIENT INFO-ROW IS CREATED AT SPECIFIC YEAR
function checkClientDate(row) {
    const dateText = row.querySelector('.date-text').textContent;
    console.log(dateText, yearSelect.value);
    if (dateText.includes(yearSelect.value)) { return true; }
    else { return false; }
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER TO OPEN ADD-CLIENT WIZARD
addClientBtn.addEventListener('click', () => {
    toggleWizard(newClientWizard);
})

// & EVENT LISTENER FOR CLIENT-FILTER-BTN CLICK
filterClientBtn.addEventListener('click', () => {
    clientInfoRows.forEach(row => {
        if (!checkClientDate(row)) {
            row.style.display = "none";
        } else {
            row.style.display = "grid";
        }
    });
})