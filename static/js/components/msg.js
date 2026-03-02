// ==================================================
// IMPORTS
// ==================================================
import { wait } from "../.base.js";


// ==================================================
// FLASH MESSAGE SEQUENCE
// ==================================================

const DISPLAY_TIME = 3000;
const ENTER_EXIT_TIME = 280;
const STEP_DELAY = 100;

// Apply the initial hidden + transition state to each message item.
const prepareItems = (items) => {
    items.forEach((item) => {
        item.classList.add("alert-item-animate", "alert-item-hidden");
    });
};

// Show one message by moving it up and fading it in.
const showItem = async (item) => {
    item.classList.remove("alert-item-hidden", "alert-item-exit");
    item.classList.add("alert-item-visible");
    await wait(ENTER_EXIT_TIME);
};

// Hide one message by moving it down and fading it out.
const hideItem = async (item) => {
    item.classList.remove("alert-item-visible");
    item.classList.add("alert-item-exit");
    await wait(ENTER_EXIT_TIME);
};

// Run every flashed message one-by-one.
const playSequence = async (items) => {
    for (const item of items) {
        await showItem(item);
        await wait(DISPLAY_TIME);
        await hideItem(item);
        await wait(STEP_DELAY);
    }
};

const initFlashMessages = () => {
    const list = document.querySelector(".alerts");

    if (!list) {
        return;
    }

    const items = [...list.querySelectorAll("li")];

    if (!items.length) {
        return;
    }

    prepareItems(items);
    playSequence(items);
};

document.addEventListener("DOMContentLoaded", initFlashMessages);
