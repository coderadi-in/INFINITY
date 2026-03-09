// ==================================================
// CONSTANT DEFINITION
// ==================================================

// ? FETCH BASIC BUTTONS
const newExpenseBtn = document.getElementById('newExpenseBtn');
const expenseManagementBtns = document.querySelectorAll('#openExpenseManagement');
const closeExpenseManagementBtns = document.querySelectorAll(".close-expense-action");
const updateExpenseBtns = document.querySelectorAll(".update-expense-btn");
const deleteExpenseBtns = document.querySelectorAll(".delete-expense-btn");

// ? FETCH ALL WIZARDS
const newExpenseWizard = document.getElementById("newExpenseWizard");
const updateExpenseWizard = document.getElementById("updateExpenseWizard");
const deleteExpenseWizard = document.getElementById("deleteExpenseWizard");

// ? FETCH ALL UPDATE-EXPENSE FORM CONTENT
const updateExpenseForm = document.getElementById("updateExpenseForm");
const updateTitleInput = document.getElementById("update_expense_title");
const updateAmountInput = document.getElementById("update_expense_amount");
const updateCategoryInput = document.getElementById("update_expense_category");
const updatePaidOnInput = document.getElementById("update_expense_paid_on");
const updateDescInput = document.getElementById("update_expense_desc");

// ? FETCH ALL DELETE-EXPENSE WIZARD CONTENT
const deleteExpenseTitleText = document.getElementById("deleteExpenseTitleText");
const cancelDeleteExpenseBtn = document.getElementById("cancelDeleteExpenseBtn");
const confirmDeleteExpenseBtn = document.getElementById("confirmDeleteExpenseBtn");

// ==================================================
// IMPORTS
// ==================================================

import { addActionTrayEvent, closeActionTray, closeWizard, initButtons, toggleWizard } from "../base/wizard.js";
import { confirmRedirect } from "../base/base.js";

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO PREFILL UPDATE-EXPENSE FORM USING BUTTON DATA
function fillUpdateExpenseForm(expenseData) {
    if (!updateExpenseForm) { return; }

    updateExpenseForm.action = `/expenses/${expenseData.expenseId}/update`;

    if (updateTitleInput) { updateTitleInput.value = expenseData.expenseTitle }
    if (updateAmountInput) { updateAmountInput.value = expenseData.expenseAmount }
    if (updateCategoryInput) { updateCategoryInput.value = expenseData.expenseCategory }
    if (updatePaidOnInput) { updatePaidOnInput.value = expenseData.expensePaidOn }
    if (updateDescInput) { updateDescInput.value = expenseData.expenseDesc }
}

// * FUNCTION TO PREFILL DELETE-EXPENSE POPUP USING BUTTON DATA
function fillDeleteExpensePopup(expenseData) {
    if (deleteExpenseTitleText) { deleteExpenseTitleText.textContent = expenseData.expenseTitle || "this expense"; }
    if (confirmDeleteExpenseBtn) { confirmDeleteExpenseBtn.dataset.redirectUrl = `/expenses/${expenseData.expenseId}/delete` }
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR NEW-EXPENSE-BTN CLICK
newExpenseBtn.addEventListener('click', () => {
    toggleWizard(newExpenseWizard);
});

// & EVENT LISTENERS TO TOGGLE EXPENSE ACTION TRAY
addActionTrayEvent(expenseManagementBtns);
addActionTrayEvent(closeExpenseManagementBtns);

// & ATTACH EVENT-LISTENER TO EXPENSE-MANAGEMENT BUTTONS
initButtons(updateExpenseBtns, updateExpenseWizard, fillUpdateExpenseForm, closeActionTray);
initButtons(deleteExpenseBtns, deleteExpenseWizard, fillDeleteExpensePopup, closeActionTray);

// & EVENT LISTENER FOR DELETE-EXPENSE CONFIRM BUTTON
if (confirmDeleteExpenseBtn) {
    confirmDeleteExpenseBtn.addEventListener('click', () => { confirmRedirect(confirmDeleteExpenseBtn); })
}

// & EVENT LISTENER FOR DELETE-EXPENSE CANCEL BUTTON
if (cancelDeleteExpenseBtn) {
    cancelDeleteExpenseBtn.addEventListener('click', () => { closeWizard(deleteExpenseWizard); });
}