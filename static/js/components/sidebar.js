// ==================================================
// SIDEBAR TOGGLE
// ==================================================

const sidebar = document.querySelector(".sidebar");
const closeSidebar = document.querySelector("#closeSidebar");

const hideSidebar = () => {
    if (!sidebar) {
        return;
    }

    sidebar.classList.add("is-hidden");
};

const showSidebar = () => {
    if (!sidebar) {
        return;
    }

    sidebar.classList.remove("is-hidden");
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
