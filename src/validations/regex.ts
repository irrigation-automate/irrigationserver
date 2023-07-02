// ==============================|| regex validation statement ||============================== //

// ======|| password regex
const passwordValidationRegex    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// ======|| email regex
const emailValidationRegex       = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ==============================|| export regex validation statement ||============================== //

export const regex = { passwordValidationRegex, emailValidationRegex };