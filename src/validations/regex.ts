/**
 * Password validation regex.
 *
 * Rules:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - Minimum length of 8 characters
 * - Special characters are allowed
 */
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Email validation regex.
 *
 * Matches most valid email addresses.
 * Local part can include letters, digits, and these special chars: !#$%&'*+/=?^_`{|}~-
 * Local part cannot start or end with dot
 * Domain cannot start or end with hyphen or dot, no consecutive dots
 */
const emailValidationRegex =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

/**
 * 24-hour time format validation regex (HH:mm).
 *
 * Matches times from 00:00 to 23:59.
 * Uses concise \d character class.
 */
const time24HourRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

/**
 * Collection of commonly used regex patterns for validation.
 */
export const regex = {
  passwordValidationRegex,
  emailValidationRegex,
  time24HourRegex,
};
