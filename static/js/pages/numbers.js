// ==================================================
// BLOCK DEFAULT BROWSER BEHAVIOR
// ==================================================

import { blockKeyboardDefaults } from '../base/base.js';
const unblock = blockKeyboardDefaults();

// ==================================================
// ACCESS ELEMENTS
// ==================================================

const dateFilter = document.getElementById("dateRange");
const typeFilter = document.getElementById("paymentType");
const paymentsTable = document.querySelector(".numbers-table tbody");

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO SHOW ALL ELEMENTS
function showAllPaymentTypes(paymentList = paymentsTable) {
    const listValues = paymentList.querySelectorAll("tr");

    listValues.forEach((elem) => {
        elem.style.display = "grid";
    });
}

// * FUNCTION TO HIDE SPECIFIC TYPE OF PAYMENT
function hideSpecificPaymentType(type, paymentList = paymentsTable) {
    showAllPaymentTypes();
    const acceptedPaymentTypes = ["expense", "revenue"];
    const listValues = paymentList.querySelectorAll("tr");

    if (!type || !acceptedPaymentTypes.includes(type)) {return;}

    listValues.forEach((elem) => {
        let paymentSymbol = elem.querySelector(".symbol")?.textContent?.trim();

        if (type === "expense" && paymentSymbol === "call_received") {
            elem.style.display = "none";

        } else if (type === "revenue" && paymentSymbol === "call_made") {
            elem.style.display = "none";
        }
    });

    return () => showAllPaymentTypes(paymentList);
}

// * FUNCTION TO HIDE PAYMENTS OUTSIDE SELECTED DATE RANGE
function hidePaymentsOutsideDateRange(range, paymentList = paymentsTable) {
    showAllPaymentTypes(paymentList);
    const acceptedDateRanges = ["monthly", "quarterly", "yearly"];
    const listValues = paymentList.querySelectorAll("tr");

    if (!range || !acceptedDateRanges.includes(range)) {return;}

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowQuarter = Math.floor(nowMonth / 3);

    listValues.forEach((elem) => {
        const dateText = elem.querySelector("td .text")?.textContent?.trim();
        const paymentDate = dateText ? new Date(dateText) : null;

        if (!paymentDate || Number.isNaN(paymentDate.getTime())) {
            elem.style.display = "none";
            return;
        }

        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        const paymentQuarter = Math.floor(paymentMonth / 3);

        const isMonthlyMatch = paymentYear === nowYear && paymentMonth === nowMonth;
        const isQuarterlyMatch = paymentYear === nowYear && paymentQuarter === nowQuarter;
        const isYearlyMatch = paymentYear === nowYear;

        if (range === "monthly" && !isMonthlyMatch) {
            elem.style.display = "none";
        } else if (range === "quarterly" && !isQuarterlyMatch) {
            elem.style.display = "none";
        } else if (range === "yearly" && !isYearlyMatch) {
            elem.style.display = "none";
        }
    });

    return () => showAllPaymentTypes(paymentList);
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR PAYMENT-TYPE CHANGE
typeFilter.addEventListener('change', () => {
    hideSpecificPaymentType(typeFilter.value);
});

// & EVENT LISTENER FOR PAYMENT-DATE CHANGE
dateFilter.addEventListener('change', () => {
    hidePaymentsOutsideDateRange(dateFilter.value);
});