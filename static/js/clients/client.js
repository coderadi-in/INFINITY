// ==================================================
// CONSTANT DEFINITION
// ==================================================

// ? GETTING DOC ELEMENTS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");
const newServiceBtn = document.getElementById("newServiceBtn");
const newPaymentBtn = document.getElementById("newPaymentBtn");

const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");
const newServiceWizard = document.getElementById("newServiceWizard");
const updateServiceWizard = document.getElementById("updateServiceWizard");
const deleteServiceWizard = document.getElementById("deleteServiceWizard");
const newPaymentWizard = document.getElementById("newPaymentWizard");

const updateServiceForm = document.getElementById("updateServiceForm");
const updateServiceTitleInput = document.getElementById("update_service_title");
const updateServiceCategoryInput = document.getElementById("update_service_category");
const updateServiceBillingCycleWrapper = document.getElementById("update_service_billing_cycle_input");
const updateServiceBillingCycleInput = document.getElementById("update_service_billing_cycle");
const updateServiceAmountInput = document.getElementById("update_service_amount");
const updateServiceBtns = document.querySelectorAll(".update-service-btn");
const deleteServiceBtns = document.querySelectorAll(".delete-service-btn");

const deleteServiceTitleText = document.getElementById("deleteServiceTitleText");
const cancelDeleteServiceBtn = document.getElementById("cancelDeleteServiceBtn");
const confirmDeleteServiceBtn = document.getElementById("confirmDeleteServiceBtn");

// ==================================================
// IMPORTS
// ==================================================

// ? IMPORTING FUNCTIONS
import { toggleWizard, closeLastOpenedWizard, closeAllWizards } from "../base/wizard.js";

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO CHECK IF BILLING CYCLE IS NEEDED
function shouldShowBillingCycle(categoryValue) {
    return categoryValue === "recurring";
}

// * FUNCTION TO TOGGLE BILLING CYCLE FIELD FOR UPDATE-SERVICE WIZARD
function setUpdateBillingCycleVisibility() {
    if (!updateServiceCategoryInput || !updateServiceBillingCycleWrapper || !updateServiceBillingCycleInput) {
        return;
    }

    const showBillingCycle = shouldShowBillingCycle(updateServiceCategoryInput.value);
    updateServiceBillingCycleWrapper.style.display = showBillingCycle ? "flex" : "none";
    updateServiceBillingCycleInput.required = showBillingCycle;

    if (!showBillingCycle) {
        updateServiceBillingCycleInput.value = "";
    }
}

// * FUNCTION TO PREFILL UPDATE-SERVICE FORM USING BUTTON DATA
function fillUpdateServiceForm(serviceData) {
    if (!updateServiceForm) {
        return;
    }

    updateServiceForm.action = `/clients/${serviceData.clientId}/services/${serviceData.serviceId}/update`;

    if (updateServiceTitleInput) {
        updateServiceTitleInput.value = serviceData.title;
    }

    if (updateServiceCategoryInput) {
        updateServiceCategoryInput.value = serviceData.category;
    }

    if (updateServiceBillingCycleInput) {
        updateServiceBillingCycleInput.value = serviceData.billingCycle;
    }

    if (updateServiceAmountInput) {
        updateServiceAmountInput.value = serviceData.amount;
    }

    setUpdateBillingCycleVisibility();
}

// * FUNCTION TO OPEN UPDATE-SERVICE WIZARD
function openUpdateServiceWizard(btn) {
    if (!btn || !updateServiceWizard) {
        return;
    }

    const serviceData = {
        clientId: window.location.pathname.split("/")[2],
        serviceId: btn.dataset.serviceId || "",
        title: btn.dataset.serviceTitle || "",
        category: btn.dataset.serviceCategory || "",
        billingCycle: btn.dataset.serviceBillingCycle || "",
        amount: btn.dataset.serviceAmount || "",
    };

    fillUpdateServiceForm(serviceData);

    if (!updateServiceWizard.classList.contains("open")) {
        toggleWizard(updateServiceWizard);
    }
}

// * FUNCTION TO ATTACH UPDATE-SERVICE BUTTON LISTENERS
function initUpdateServiceButtons() {
    if (!updateServiceBtns.length) {
        return;
    }

    updateServiceBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            openUpdateServiceWizard(btn);
        });
    });
}

// * FUNCTION TO GET CLIENT-ID FROM URL PATH
function getClientIdFromPath() {
    return window.location.pathname.split("/")[2] || "";
}

// * FUNCTION TO BUILD SERVICE-DELETE URL
function buildServiceDeleteUrl(clientId, serviceId) {
    return `/clients/${clientId}/services/${serviceId}/delete`;
}

// * FUNCTION TO PREFILL DELETE-SERVICE POPUP
function fillDeleteServicePopup(serviceData) {
    if (deleteServiceTitleText) {
        deleteServiceTitleText.textContent = serviceData.title || "this service";
    }

    if (confirmDeleteServiceBtn) {
        confirmDeleteServiceBtn.dataset.redirectUrl = buildServiceDeleteUrl(serviceData.clientId, serviceData.serviceId);
    }
}

// * FUNCTION TO OPEN DELETE-SERVICE POPUP
function openDeleteServiceWizard(btn) {
    if (!btn || !deleteServiceWizard) {
        return;
    }

    const serviceData = {
        clientId: getClientIdFromPath(),
        serviceId: btn.dataset.serviceId || "",
        title: btn.dataset.serviceTitle || "",
    };

    fillDeleteServicePopup(serviceData);

    if (!deleteServiceWizard.classList.contains("open")) {
        toggleWizard(deleteServiceWizard);
    }
}

// * FUNCTION TO CLOSE DELETE-SERVICE POPUP
function closeDeleteServiceWizard() {
    if (!deleteServiceWizard || !deleteServiceWizard.classList.contains("open")) {
        return;
    }

    toggleWizard(deleteServiceWizard);
}

// * FUNCTION TO REDIRECT TO SERVICE-DELETE ROUTE
function confirmServiceDelete() {
    if (!confirmDeleteServiceBtn) {
        return;
    }

    const redirectUrl = confirmDeleteServiceBtn.dataset.redirectUrl;
    if (!redirectUrl) {
        return;
    }

    window.location.href = redirectUrl;
}

// * FUNCTION TO ATTACH DELETE-SERVICE BUTTON LISTENERS
function initDeleteServiceButtons() {
    if (!deleteServiceBtns.length) {
        return;
    }

    deleteServiceBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            openDeleteServiceWizard(btn);
        });
    });
}

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

// & EVENT LISTENER FOR NEW-PAYMENT-BTN CLICK
if (newPaymentBtn) {
    newPaymentBtn.addEventListener('click', () => {
        toggleWizard(newPaymentWizard);
    })
}

// & EVENT LISTENER FOR CATEGORY CHANGE IN UPDATE-SERVICE WIZARD
if (updateServiceCategoryInput) {
    updateServiceCategoryInput.addEventListener("change", setUpdateBillingCycleVisibility);
}

// & INITIALIZE UPDATE-SERVICE BUTTONS
initUpdateServiceButtons();

// & INITIALIZE DELETE-SERVICE BUTTONS
initDeleteServiceButtons();

// & EVENT LISTENER FOR DELETE-SERVICE CANCEL BUTTON
if (cancelDeleteServiceBtn) {
    cancelDeleteServiceBtn.addEventListener("click", closeDeleteServiceWizard);
}

// & EVENT LISTENER FOR DELETE-SERVICE CONFIRM BUTTON
if (confirmDeleteServiceBtn) {
    confirmDeleteServiceBtn.addEventListener("click", confirmServiceDelete);
}

// ==================================================
// KEYBOARD EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR ESC-PRESS
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        closeLastOpenedWizard();
    }

    if (e.ctrlKey && e.shiftKey && e.key == "Backspace") {
        e.preventDefault();
        closeAllWizards();
    }
})
