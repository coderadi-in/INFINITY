// ==================================================
// SIDEBAR OPEN HANDLER
// ==================================================

const openSidebar = document.querySelector("#openSidebar");

const openSidebarPanel = () => {
    document.dispatchEvent(new CustomEvent("sidebar:open"));
};

const initSidebarOpen = () => {
    if (!openSidebar) {
        return;
    }

    openSidebar.addEventListener("click", openSidebarPanel);
};

document.addEventListener("DOMContentLoaded", initSidebarOpen);
