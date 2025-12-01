const AUTH_KEY = "resume_app_auth";

export interface AuthCredentials {
  email: string;
  password: string;
}

const VALID_EMAIL = "intern@demo.com";
const VALID_PASSWORD = "pass123";

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function authenticate(credentials: AuthCredentials): {
  success: boolean;
  error?: string;
} {
  const { email, password } = credentials;

  // Validate email format
  if (!isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  // Validate password length
  if (!isValidPassword(password)) {
    return {
      success: false,
      error: "Password must be at least 6 characters long",
    };
  }

  // Check credentials
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return { success: false, error: "Invalid email or password" };
  }

  // Store session
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, "authenticated");
  }

  return { success: true };
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "authenticated";
}

/**
 * Logs out user by clearing session
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getCredentials(): { email: string; password: string } {
  return { email: VALID_EMAIL, password: VALID_PASSWORD };
}
