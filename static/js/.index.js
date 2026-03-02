// ==================================================
// SIGNUP/LOGIN TRANSITION
// ==================================================

const STAGGER_DELAY = 100;
const FADE_DURATION = 350;

// ==================================================
// ELEMENT REFERENCES
// ==================================================

const openLogin = document.querySelector("#openLogin");
const openSignup = document.querySelector("#openSignup");

const signupContent = document.querySelector(".left-panel .signup-content");
const loginContent = document.querySelector(".left-panel .login-content");

const signupElems = document.querySelectorAll(".left-panel .signup-content .elem");
const loginElems = document.querySelectorAll(".left-panel .login-content .elem");

// Prevent overlapping animations caused by rapid clicks.
let isAnimating = false;
let activePanel = "signup";

// ==================================================
// REUSABLE HELPERS
// ==================================================

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const OPACITY_TRANSITION = `opacity ${FADE_DURATION}ms ease-in-out`;

const setContentState = (content, isVisible) => {
    content.style.visibility = isVisible ? "visible" : "hidden";
    content.style.pointerEvents = isVisible ? "auto" : "none";
};

// Keep existing CSS transitions (like button background-color hover)
// and append opacity transition for every element.
const ensureOpacityTransition = (element) => {
    const computed = window.getComputedStyle(element);
    const computedTransition = computed.transition.trim();
    const hasOpacityTransition = /\bopacity\b/.test(computedTransition);
    const hasExistingTransition = computedTransition && computedTransition !== "none 0s ease 0s";

    if (hasOpacityTransition) {
        element.style.transition = computedTransition;
    } else if (hasExistingTransition) {
        element.style.transition = `${computedTransition}, ${OPACITY_TRANSITION}`;
    } else {
        element.style.transition = OPACITY_TRANSITION;
    }
};

const prepareElems = (elements, opacity) => {
    elements.forEach((element) => {
        element.style.opacity = String(opacity);
        ensureOpacityTransition(element);
    });
};

const fadeOutOneByOne = async (elements) => {
    for (const element of elements) {
        element.style.opacity = "0";
        await wait(STAGGER_DELAY);
    }
};

const fadeInOneByOne = async (elements) => {
    // Reset to hidden first so each element can fade in.
    elements.forEach((element) => {
        element.style.opacity = "0";
    });

    await wait(20);

    for (const element of elements) {
        element.style.opacity = "1";
        await wait(STAGGER_DELAY);
    }
};

// ==================================================
// TRANSITION FLOW
// ==================================================

const switchPanel = async (targetPanel) => {
    if (isAnimating || targetPanel === activePanel) {
        return;
    }

    isAnimating = true;

    if (targetPanel === "login") {
        await fadeOutOneByOne(signupElems);
        setContentState(signupContent, false);
        setContentState(loginContent, true);
        await fadeInOneByOne(loginElems);
    } else {
        await fadeOutOneByOne(loginElems);
        setContentState(loginContent, false);
        setContentState(signupContent, true);
        await fadeInOneByOne(signupElems);
    }

    activePanel = targetPanel;
    isAnimating = false;
};

// ==================================================
// INITIALIZATION
// ==================================================

const initAuthTransition = () => {
    if (!openLogin || !openSignup || !signupContent || !loginContent) {
        return;
    }

    // Initial state: Signup is visible, Login is hidden behind it.
    prepareElems(signupElems, 1);
    prepareElems(loginElems, 0);
    setContentState(signupContent, true);
    setContentState(loginContent, false);

    openLogin.addEventListener("click", () => switchPanel("login"));
    openSignup.addEventListener("click", () => switchPanel("signup"));
};

document.addEventListener("DOMContentLoaded", initAuthTransition);
