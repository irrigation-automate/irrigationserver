import { regex } from '../../src/validations/regex';

/**
 * Test suite for regex validations including:
 * - Password validation
 * - Email validation
 */
describe('Regex Validation', () => {
  /**
   * Test cases for password validation regex.
   * Rules:
   * - Minimum 8 characters
   * - At least one lowercase letter
   * - At least one uppercase letter
   * - At least one digit
   * - Special characters are allowed
   */
  describe('passwordValidationRegex', () => {
    it('should validate passwords correctly', () => {
      /** Valid passwords */
      const validPasswords = ['Password1', 'Secure123', 'TestPass123', 'P@ssword1'];
      validPasswords.forEach((password) => {
        expect(regex.passwordValidationRegex.test(password)).toBe(true);
      });

      /** Invalid passwords */
      const invalidPasswords = [
        /** No uppercase */
        'password',
        /** No lowercase */
        'PASSWORD1',
        /** No digit */
        'Password',
        /** Too short */
        'Pass1',
        /** No uppercase */
        'password1',
      ];
      invalidPasswords.forEach((password) => {
        expect(regex.passwordValidationRegex.test(password)).toBe(false);
      });
    });
  });

  /**
   * Test cases for email validation regex.
   * Rules:
   * - Standard email format: local-part@domain
   * - Local part can include letters, digits, and certain special characters
   * - Local part cannot start or end with dot
   * - Domain cannot start or end with hyphen or dot
   * - Domain must have valid TLD
   */
  describe('emailValidationRegex', () => {
    it('should validate email addresses correctly', () => {
      /** Valid emails */
      const validEmails = [
        'user@example.com',
        'firstname.lastname@example.com',
        'email@subdomain.example.com',
        'firstname+lastname@example.com',
        '1234567890@example.com',
        'email@example-one.com',
        '_______@example.com',
        'email@example.co.jp',
        'firstname-lastname@example.com',
      ];
      validEmails.forEach((email) => {
        expect(regex.emailValidationRegex.test(email)).toBe(true);
      });

      /** Invalid emails */
      const invalidEmails = [
        /** Missing @ */
        'plainaddress',
        /** Missing username */
        '@missingusername.com',
        /** Missing domain */
        'username@.com',
        /** Leading dot in local part */
        '.username@example.com',
        /** Double dot in domain */
        'username@example.com.',
        /** Trailing dot in domain */
        'username@.example.com',
        /** Leading hyphen in domain */
        'username@-example.com',
        /** Trailing hyphen in domain */
        'username@example-.com',
      ];
      invalidEmails.forEach((email) => {
        expect(regex.emailValidationRegex.test(email)).toBe(false);
      });
    });
  });
});
