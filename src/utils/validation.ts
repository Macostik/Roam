// Mock-auth form checks. Clerk does the real validation once it is set up.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return EMAIL.test(value.trim());
}
