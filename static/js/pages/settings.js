// ==================================================
// ELEMENT REFERENCE
// ==================================================

const themeInputs = document.getElementsByName('themeInput');
const sidebarToggles = document.getElementsByName('sidebarToggle');

// ==================================================
// IMPORTS
// ==================================================

import { toggleTheme, saveTheme, getTheme, saveSidebarToggle, getSidebarToggle } from '../base/base.js';
import { showSidebar, hideSidebar } from '../components/sidebar.js';

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO PRESELECT THEME-INPUT
function selectThemeInput() {
    const currentTheme = getTheme() || 'system';
    const relatedInput = document.getElementById(`${currentTheme}Theme`);
    if (relatedInput) {
        relatedInput.checked = true;
    }
}

// * FUNCTION TO PRESELECT SIDEBAR-INPUT
function selectSidebarToggle() {
    const currentPosition = getSidebarToggle() || 'on';
    const relatedInput = document.getElementById(`sidebar${currentPosition === 'on' ? 'On' : 'Off'}`);
    if (relatedInput) {
        relatedInput.checked = true;
    }
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR THEME-INPUT CLICK
themeInputs.forEach((input) => {
    input.addEventListener('click', () => {
        toggleTheme(input.value);
        saveTheme(input.value);
    });
});

// & EVENT LISTENER FOR SIDEBAR-TOGGLE CLICK
sidebarToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        if (toggle.value == 'on') {
            showSidebar();
            saveSidebarToggle('on');
        } else {
            hideSidebar();
            saveSidebarToggle('off');
        }
    });
});

// ==================================================
// FUNCTION CALLS
// ==================================================

selectThemeInput();
selectSidebarToggle();
