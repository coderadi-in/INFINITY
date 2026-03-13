// ==================================================
// ELEMENTS REFERENCE
// ==================================================

// ? TOP ROW
const renewalSection = document.querySelector('.renewal-info');
const dueSection = document.querySelector('.due-info');
const renewalToggleBtn = document.getElementById("toggleRenewalInfo");
const dueToggleBtn = document.getElementById("toggleDueInfo");

// ? USER-INFO ELEMENTS
const revenueElem = document.getElementById('totalRevenue');
const expenseElem = document.getElementById('totalExpense');

// ? CHART AREA
const ctxLine = document.getElementById("lineArea").getContext('2d');
const ctxDoughnut = document.getElementById("doughnutArea").getContext('2d');

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO TOGGLE A TOP-ROW SECTION
function toggleTopRowSection(section) {
    if (window.getComputedStyle(section).flex.trim() == '1 1 0%') {
        section.classList.add('minimized');
        section.style.flex = 0;
    } else {
        section.classList.remove('minimized');
        section.style.flex = 1;
    }
}

// * FUNCTION TO INITIALIZE TOP-ROW SECTION TOGGLE BTN
function initTopRowBtn(btn, relatedSection) {
    btn.addEventListener('click', () => {
        toggleTopRowSection(relatedSection);
    });
}

// * FUNCTION TO RESOLVE A CSS VARIABLE
function resolveCSSVariable(variable) {
    const cssVariable = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

    return cssVariable;
}

// * FUNCTION TO RENDER A LINE CHART
async function renderLineChart(ctx, labels, data) {
    const chart = await new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                "label": "Transactions",
                data: data,
                borderColor: resolveCSSVariable('--primary'),
                hoverBorderColor: resolveCSSVariable('--secondary'),
                tension: 0.1
            }],
        }
    });

    return () => {
        chart.destroy();
    }
}

// * FUNCTION TO RENDER DOUGHNUT CHART
async function renderDoughnutChart(ctx, labels, data, colors) {
    const chart = await new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: "Ratio",
                data: data,
                backgroundColor: colors,
                borderColor: "transparent",
                hoverOffset: 5
            }]
        }
    })
}

// * FUNCTION TO PULL TRANSACTIONS DATA THROUGH INTERNAL API
async function pullTransactionsData() {
    const res = await fetch("/api/internals/transactions");

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
    }

    return res.json();
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & EVENT LISTENER FOR DOM-CONTENT-LOADED
document.addEventListener('DOMContentLoaded', async () => {
    const transactionsData = await pullTransactionsData();
    await renderLineChart(ctxLine, transactionsData.dates, transactionsData.amounts);
    
    await renderDoughnutChart(
        ctxDoughnut, 
        ["Revenue", "Expense"], 
        [revenueElem.textContent, expenseElem.textContent],
        [resolveCSSVariable('--primary'), resolveCSSVariable('--secondary')]
    );

    const doughnutArea = document.getElementById("doughnutArea");
    doughnutArea.parentElement.style.width = "100%";
})

// & INITIALIZE TOP-ROW SECTION TOGGLE BUTTONS
initTopRowBtn(renewalToggleBtn, renewalSection);
initTopRowBtn(dueToggleBtn, dueSection);