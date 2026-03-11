// ==================================================
// ELEMENT REFERENCE
// ==================================================

// ? BUTTONS
const clientsBtn = document.getElementById('clientsBtn');
const servicesBtn = document.getElementById('servicesBtn');
const paymentsBtn = document.getElementById('paymentsBtn');
const expensesBtn = document.getElementById('expensesBtn');

// ? SECTIONS
const clientSection = document.querySelector('.clients-info');
const serviceSection = document.querySelector('.services-info');
const paymentsSection = document.querySelector('.payments-info');
const expensesSection = document.querySelector('.expenses-info');

// ==================================================
// FUNCTIONS
// ==================================================

// * FUNCTION TO HIDE SECTIONS
function hideSections(sections) {
    sections.forEach((section) => {
        section.classList.add('hidden');
    });
}

// * FUNCTION TO DESELECT BUTTONS
function hideButtons(buttons) {
    buttons.forEach((button) => {
        button.classList.remove('selected');
    });
}

// * FUNCTION TO SHOW A SECTION
function showSection(section) {
    section.classList.remove('hidden');
}

// * FUNCTION TO INITIALIZE BUTTON
function initButton(btn, relatedSection) {
    let sectionsArray = [
        clientSection, serviceSection, 
        paymentsSection, expensesSection
    ];

    let buttons = [
        clientsBtn, servicesBtn,
        paymentsBtn, expensesBtn
    ]

    btn.addEventListener('click', () => {
        hideSections(sectionsArray);
        showSection(relatedSection);
        hideButtons(buttons)
        btn.classList.add('selected');
    })
}

// ==================================================
// EVENT LISTENERS
// ==================================================

// & INITIALIZING BUTTONS
initButton(clientsBtn, clientSection);
initButton(servicesBtn, serviceSection);
initButton(paymentsBtn, paymentsSection);
initButton(expensesBtn, expensesSection);