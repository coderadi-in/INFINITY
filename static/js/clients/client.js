// ==================================================
// CONSTANT DEFINITION
// ==================================================

// ? FETCH BASIC BUTTONS
const updateClientBtn = document.getElementById("updateClientBtn");
const deleteClientBtn = document.getElementById("deleteClientBtn");
const newServiceBtn = document.getElementById("newServiceBtn");
const newPaymentBtn = document.getElementById("newPaymentBtn");

// ? FETCH SERVICE MANAGEMENT BUTTONS
const updateServiceBtns = document.querySelectorAll(".update-service-btn");
const deleteServiceBtns = document.querySelectorAll(".delete-service-btn");

// ? FETCH PAYMENTS MANAGEMENT BUTTONS
const paymentManagementBtns = document.querySelectorAll(".open-payments-management-wizard");
const closePaymentsActions = document.querySelectorAll(".close-payment-actions");
const updatePaymentBtns = document.querySelectorAll(".update-payment-btn");
const deletePaymentBtns = document.querySelectorAll(".delete-payment-btn");

// ? FETCH ALL WIZARDS
const updateClientWizard = document.getElementById("updateClientWizard");
const deleteClientWizard = document.getElementById("deleteClientWizard");
const newServiceWizard = document.getElementById("newServiceWizard");
const updateServiceWizard = document.getElementById("updateServiceWizard");
const deleteServiceWizard = document.getElementById("deleteServiceWizard");
const newPaymentWizard = document.getElementById("newPaymentWizard");
const managePaymentsWizard = document.getElementById("managePaymentsWizard");
const deletePaymentWizard = document.getElementById("deletePaymentWizard");

// ? FETCH UPDATE-SERVICE FORM ELEMENTS
const updateServiceForm = document.getElementById("updateServiceForm");
const updateServiceTitleInput = document.getElementById("update_service_title");
const updateServiceCategoryInput = document.getElementById("update_service_category");
const updateServiceBillingCycleWrapper = document.getElementById("update_service_billing_cycle_input");
const updateServiceBillingCycleInput = document.getElementById("update_service_billing_cycle");
const updateServiceAmountInput = document.getElementById("update_service_amount");

// ? FETCH DELETE-SERVICE FORM ELEMENTS
const deleteServiceTitleText = document.getElementById("deleteServiceTitleText");
const cancelDeleteServiceBtn = document.getElementById("cancelDeleteServiceBtn");
const confirmDeleteServiceBtn = document.getElementById("confirmDeleteServiceBtn");

// ? FETCH UPDATE-PAYMENT FORM ELEMENTS
const updatePaymentForm = document.getElementById("updatePaymentForm");
const updatePaymentServiceInput = document.getElementById("update_payment_service_id");
const updatePaymentAmountInput = document.getElementById("update_payment_amount");
const updatePaymentPaidOnInput = document.getElementById("update_payment_paid_on");
const updatePaymentMethodInput = document.getElementById("update_payment_method");
const updatePaymentStatusInput = document.getElementById("update_payment_status");

// ? FETCH DELETE-PAYMENT FORM ELEMENTS
const deletePaymentTitleText = document.getElementById("deletePaymentTitleText");
const cancelDeletePaymentBtn = document.getElementById("cancelDeletePaymentBtn");
const confirmDeletePaymentBtn = document.getElementById("confirmDeletePaymentBtn");

// ==================================================
// IMPORTS
// ==================================================

// ? IMPORTING FUNCTIONS
import { closeLastOpenedWizard, closeAllWizards, closeWizard, initButtons, addToggleWizardListener, togglePaymentsActionTray } from "../base/wizard.js";
import { confirmRedirect, getClientIdFromPath } from "../base/base.js";

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO CLOSE ACTION TRAY ONCE WIZARD OPENS
function closeActionTray(btn) {
    const tableRow = btn.closest(".table-row");
    const managementRow = tableRow ? tableRow.querySelector(".management-row") : null;
    if (managementRow) {managementRow.classList.remove("open");}
}

// * FUNCTION TO TOGGLE BILLING CYCLE FIELD FOR UPDATE-SERVICE WIZARD
function setUpdateBillingCycleVisibility() {
    if (!updateServiceCategoryInput || !updateServiceBillingCycleWrapper || !updateServiceBillingCycleInput) {
        return;
    }

    const showBillingCycle = updateServiceCategoryInput.value === "recurring";
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
        updateServiceTitleInput.value = serviceData.serviceTitle;
    }

    if (updateServiceCategoryInput) {
        updateServiceCategoryInput.value = serviceData.serviceCategory;
    }

    if (updateServiceBillingCycleInput) {
        updateServiceBillingCycleInput.value = serviceData.serviceBillingCycle ;
    }

    if (updateServiceAmountInput) {
        updateServiceAmountInput.value = serviceData.serviceAmount ;
    }

    setUpdateBillingCycleVisibility();
}

// * FUNCTION TO PREFILL DELETE-SERVICE POPUP
function fillDeleteServicePopup(serviceData) {
    if (deleteServiceTitleText) {
        deleteServiceTitleText.textContent = serviceData.serviceTitle  || "this service";
    }

    if (confirmDeleteServiceBtn) {
        confirmDeleteServiceBtn.dataset.redirectUrl = `/clients/${getClientIdFromPath()}/services/${serviceData.serviceId}/delete`;
    }
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

// * FUNCTION TO PREFILL DELETE-PAYMENT POPUP
function fillDeletePaymentPopup(paymentData) {
    if (deletePaymentTitleText) {
        deletePaymentTitleText.textContent = paymentData.title || "this payment";
    }

    if (confirmDeletePaymentBtn) {
        confirmDeletePaymentBtn.dataset.redirectUrl = `/payments/${paymentData.paymentId}/delete?client=${getClientIdFromPath()}`;
    }
}

// ==================================================
// MOUSE EVENT LISTENERS
// ==================================================

// & EVENT LISTENERS TO WIZARDS TOGGLING
addToggleWizardListener(updateClientBtn, updateClientWizard);
addToggleWizardListener(deleteClientBtn, deleteClientWizard);
addToggleWizardListener(newServiceBtn, newServiceWizard);
addToggleWizardListener(newPaymentBtn, newPaymentWizard);

// & EVENT LISTENERS TO TOGGLE PAYMENTS ACTION TRAY
togglePaymentsActionTray(paymentManagementBtns);
togglePaymentsActionTray(closePaymentsActions);

// & INITIALIZE MANAGEMENT BUTTONS
initButtons(updateServiceBtns, updateServiceWizard, fillUpdateServiceForm);
initButtons(deleteServiceBtns, deleteServiceWizard, fillDeleteServicePopup);
initButtons(updatePaymentBtns, managePaymentsWizard, fillUpdatePaymentForm, closeActionTray);
initButtons(deletePaymentBtns, deletePaymentWizard, fillDeletePaymentPopup, closeActionTray);

// & EVENT LISTENER FOR CATEGORY CHANGE IN UPDATE-SERVICE WIZARD
if (updateServiceCategoryInput) {
    updateServiceCategoryInput.addEventListener("change", setUpdateBillingCycleVisibility);
}

// & EVENT LISTENER FOR DELETE-SERVICE CANCEL BUTTON
if (cancelDeleteServiceBtn) {
    cancelDeleteServiceBtn.addEventListener("click", () => {closeWizard(deleteServiceWizard)});
}

// & EVENT LISTENER FOR DELETE-PAYMENT CANCEL BUTTON
if (cancelDeletePaymentBtn) {
    cancelDeletePaymentBtn.addEventListener("click", () => {closeWizard(deletePaymentWizard)});
}

// & EVENT LISTENER FOR DELETE-SERVICE CONFIRM BUTTON
if (confirmDeleteServiceBtn) {
    confirmDeleteServiceBtn.addEventListener("click", () => {confirmRedirect(confirmDeleteServiceBtn)});
}

// & EVENT LISTENER FOR DELETE-PAYMENT CONFIRM BUTTON
if (confirmDeletePaymentBtn) {
    confirmDeletePaymentBtn.addEventListener("click", () => {confirmRedirect(confirmDeletePaymentBtn)});
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
});
