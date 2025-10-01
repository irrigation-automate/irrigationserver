
/**
 * Password validation regex.
 *
 * Rules:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - Minimum length of 8 characters
 *
 * @example
 * passwordValidationRegex.test("StrongPass1"); // true
 * passwordValidationRegex.test("weakpass");    // false
 */
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

/**
 * Email validation regex.
 *
 * Matches most valid email addresses according to RFC 5322 (simplified).
 * Ensures proper structure: local-part@domain
 *
 * @example
 * emailValidationRegex.test("user@example.com"); // true
 * emailValidationRegex.test("invalid-email");    // false
 */
const emailValidationRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Collection of commonly used regex patterns for validation.
 */
export const regex = {
  passwordValidationRegex,
  emailValidationRegex,
};
