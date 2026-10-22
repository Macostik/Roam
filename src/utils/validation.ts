// Form pre-checks run before calling Clerk, so obvious mistakes never cost a request.
// Clerk still does the real validation and its errors show under the same fields.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return EMAIL.test(value.trim());
}
