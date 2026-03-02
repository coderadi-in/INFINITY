// ADDS A SIMPLE WAIT FUNCTION TO AVOID CALLBACK HELL IN ANIMATION SEQUENCES
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));