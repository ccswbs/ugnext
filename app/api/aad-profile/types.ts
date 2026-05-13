// Type definitions for AAD Profile API

export interface RateLimitData {
  count: number;
  lastReset: number;
}

export interface AADUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  givenName: string;
  surname: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface AADProfileAPIConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  validation: {
    emailRegex: RegExp;
    maxEmailLength: number;
  };
}