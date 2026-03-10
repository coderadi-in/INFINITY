// ==================================================
// IMPORTS
// ==================================================

import { getTheme, getSidebarToggle, toggleTheme } from "./base.js";
import { hideSidebar } from '../components/sidebar.js';

// ==================================================
// UPDATE THEME IN BODY
// ==================================================

const savedTheme = getTheme() || "system";
toggleTheme(savedTheme);

if (getSidebarToggle() == 'off') {
    hideSidebar();
}
