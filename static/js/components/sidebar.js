// ==================================================
// SIDEBAR TOGGLE
// ==================================================

const sidebar = document.querySelector(".sidebar");
const mainLayout = document.querySelector(".main");
const appContent = document.querySelector(".app-content");
const sidebarElements = document.querySelectorAll(".sidebar .elem");
const closeSidebar = document.querySelector("#closeSidebar");

// ADD INCREASING TRANSITION DELAY TO EACH SIDEBAR ELEMENT
const BASE_DELAY = 0.3; // Base delay in seconds
const INCREMENT = 0.05; // Increment in seconds

sidebarElements.forEach((elem, index) => {
    const delay = BASE_DELAY + index * INCREMENT;
    elem.style.transition = `opacity 0.1s ease-in-out ${delay}s, background-color 0.3s ease-in-out`;
});

// Keep layout classes in one place so hide/show stay easy to maintain.
const setSidebarState = (isHidden) => {
    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("is-hidden", isHidden);

    if (mainLayout) {
        mainLayout.classList.toggle("sidebar-collapsed", isHidden);
    }

    if (appContent) {
        appContent.classList.toggle("is-expanded", isHidden);
    }
};

const hideSidebar = () => {
    setSidebarState(true);
};

const showSidebar = () => {
    setSidebarState(false);
};

const initSidebarToggle = () => {
    if (!sidebar) {
        return;
    }

    if (closeSidebar) {
        closeSidebar.addEventListener("click", hideSidebar);
    }

    document.addEventListener("sidebar:open", showSidebar);
    document.addEventListener("sidebar:close", hideSidebar);
};

document.addEventListener("DOMContentLoaded", initSidebarToggle);
