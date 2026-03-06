// ==================================================
// CONSTANT DEFINITION
// ==================================================

// ? GETTING DOC ELEMENTS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");
const newServiceBtn = document.getElementById("newServiceBtn");
const newPaymentBtn = document.getElementById("newPaymentBtn");
const paymentManagementBtns = document.querySelectorAll(".open-payments-management-wizard");
const closePaymentsActions = document.querySelectorAll(".close-payment-actions");
const updatePaymentBtns = document.querySelectorAll(".update-payment-btn");
const deletePaymentBtns = document.querySelectorAll(".delete-payment-btn, #deletePaymentBtn");

const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");
const newServiceWizard = document.getElementById("newServiceWizard");
const updateServiceWizard = document.getElementById("updateServiceWizard");
const deleteServiceWizard = document.getElementById("deleteServiceWizard");
const newPaymentWizard = document.getElementById("newPaymentWizard");
const managePaymentsWizard = document.getElementById("managePaymentsWizard");
const deletePaymentWizard = document.getElementById("deletePaymentWizard");

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
const deletePaymentTitleText = document.getElementById("deletePaymentTitleText");
const cancelDeletePaymentBtn = document.getElementById("cancelDeletePaymentBtn");
const confirmDeletePaymentBtn = document.getElementById("confirmDeletePaymentBtn");

const updatePaymentForm = document.getElementById("updatePaymentForm");
const updatePaymentServiceInput = document.getElementById("update_payment_service_id");
const updatePaymentAmountInput = document.getElementById("update_payment_amount");
const updatePaymentPaidOnInput = document.getElementById("update_payment_paid_on");
const updatePaymentMethodInput = document.getElementById("update_payment_method");
const updatePaymentStatusInput = document.getElementById("update_payment_status");

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

// * FUNCTION TO BUILD PAYMENT-DELETE URL
function buildPaymentDeleteUrl(clientId, paymentId) {
    return `/payments/${paymentId}/delete?client=${clientId}`;
}

// * FUNCTION TO PREFILL DELETE-PAYMENT POPUP
function fillDeletePaymentPopup(paymentData) {
    if (deletePaymentTitleText) {
        deletePaymentTitleText.textContent = paymentData.title || "this payment";
    }

    if (confirmDeletePaymentBtn) {
        confirmDeletePaymentBtn.dataset.redirectUrl = buildPaymentDeleteUrl(paymentData.clientId, paymentData.paymentId);
    }
}

// * FUNCTION TO OPEN DELETE-PAYMENT POPUP
function openDeletePaymentWizard(btn) {
    if (!btn || !deletePaymentWizard) {
        return;
    }

    const paymentData = {
        clientId: getClientIdFromPath(),
        paymentId: btn.dataset.paymentId || "",
        title: btn.dataset.paymentTitle || "",
    };

    fillDeletePaymentPopup(paymentData);

    if (!deletePaymentWizard.classList.contains("open")) {
        toggleWizard(deletePaymentWizard);
    }
}

// * FUNCTION TO CLOSE DELETE-PAYMENT POPUP
function closeDeletePaymentWizard() {
    if (!deletePaymentWizard || !deletePaymentWizard.classList.contains("open")) {
        return;
    }

    toggleWizard(deletePaymentWizard);
}

// * FUNCTION TO REDIRECT TO PAYMENT-DELETE ROUTE
function confirmPaymentDelete() {
    if (!confirmDeletePaymentBtn) {
        return;
    }

    const redirectUrl = confirmDeletePaymentBtn.dataset.redirectUrl;
    if (!redirectUrl) {
        return;
    }

    window.location.href = redirectUrl;
}

// * FUNCTION TO ATTACH DELETE-PAYMENT BUTTON LISTENERS
function initDeletePaymentButtons() {
    if (!deletePaymentBtns.length) {
        return;
    }

    deletePaymentBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            openDeletePaymentWizard(btn);

            const tableRow = btn.closest(".table-row");
            const managementRow = tableRow ? tableRow.querySelector(".management-row") : null;
            if (managementRow) {
                managementRow.classList.remove("open");
            }
        });
    });
}

// * FUNCTION TO PREFILL UPDATE-PAYMENT FORM USING BUTTON DATA
function fillUpdatePaymentForm(paymentData) {
    if (!updatePaymentForm) {
        return;
    }

    updatePaymentForm.action = `/payments/${paymentData.paymentId}/update`;

    if (updatePaymentServiceInput) {
        updatePaymentServiceInput.value = paymentData.serviceId;
    }

    if (updatePaymentAmountInput) {
        updatePaymentAmountInput.value = paymentData.amount;
    }

    if (updatePaymentPaidOnInput) {
        updatePaymentPaidOnInput.value = paymentData.paidOn;
    }

    if (updatePaymentMethodInput) {
        updatePaymentMethodInput.value = paymentData.method;
    }

    if (updatePaymentStatusInput) {
        updatePaymentStatusInput.value = paymentData.status;
    }
}

// * FUNCTION TO OPEN UPDATE-PAYMENT WIZARD
function openUpdatePaymentWizard(btn) {
    if (!btn || !managePaymentsWizard) {
        return;
    }

    const paymentData = {
        paymentId: btn.dataset.paymentId || "",
        serviceId: btn.dataset.serviceId || "",
        amount: btn.dataset.amount || "",
        paidOn: btn.dataset.paidOn || "",
        method: btn.dataset.method || "other",
        status: btn.dataset.status || "pending",
    };

    fillUpdatePaymentForm(paymentData);

    if (!managePaymentsWizard.classList.contains("open")) {
        toggleWizard(managePaymentsWizard);
    }
}

// * FUNCTION TO ATTACH UPDATE-PAYMENT BUTTON LISTENERS
function initUpdatePaymentButtons() {
    if (!updatePaymentBtns.length) {
        return;
    }

    updatePaymentBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            openUpdatePaymentWizard(btn);

            // Close per-row action tray once wizard opens
            const tableRow = btn.closest(".table-row");
            const managementRow = tableRow ? tableRow.querySelector(".management-row") : null;
            if (managementRow) {
                managementRow.classList.remove("open");
            }
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

// & EVENT LISTENER FOR MANAGE-PAYMENTS-BTN CLICK
paymentManagementBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        let tableRow = btn.closest(".table-row");
        let target = tableRow ? tableRow.querySelector(".management-row") : null;

        if (target) {
            target.classList.add("open");
        }
    });
});

// & EVENT LISTENER FOR CLOSE-MANAGER-BTN CLICK
closePaymentsActions.forEach((btn) => {
    btn.addEventListener('click', () => {
        let tableRow = btn.closest(".table-row");
        let target = tableRow ? tableRow.querySelector(".management-row") : null;

        if (target) {
            target.classList.remove("open");
        }
    })
})

// & EVENT LISTENER FOR CATEGORY CHANGE IN UPDATE-SERVICE WIZARD
if (updateServiceCategoryInput) {
    updateServiceCategoryInput.addEventListener("change", setUpdateBillingCycleVisibility);
}

// & INITIALIZE UPDATE-SERVICE BUTTONS
initUpdateServiceButtons();

// & INITIALIZE DELETE-SERVICE BUTTONS
initDeleteServiceButtons();

// & INITIALIZE UPDATE-PAYMENT BUTTONS
initUpdatePaymentButtons();

// & INITIALIZE DELETE-PAYMENT BUTTONS
initDeletePaymentButtons();

// & EVENT LISTENER FOR DELETE-SERVICE CANCEL BUTTON
if (cancelDeleteServiceBtn) {
    cancelDeleteServiceBtn.addEventListener("click", closeDeleteServiceWizard);
}

// & EVENT LISTENER FOR DELETE-SERVICE CONFIRM BUTTON
if (confirmDeleteServiceBtn) {
    confirmDeleteServiceBtn.addEventListener("click", confirmServiceDelete);
}

// & EVENT LISTENER FOR DELETE-PAYMENT CANCEL BUTTON
if (cancelDeletePaymentBtn) {
    cancelDeletePaymentBtn.addEventListener("click", closeDeletePaymentWizard);
}

// & EVENT LISTENER FOR DELETE-PAYMENT CONFIRM BUTTON
if (confirmDeletePaymentBtn) {
    confirmDeletePaymentBtn.addEventListener("click", confirmPaymentDelete);
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
