/**
 * Shared validation utilities for API routes
 * Consolidated from various route implementations for consistency 
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const VALIDATION_CONFIG = {
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254, // RFC 5321 standard
    allowedDomains: ['@uoguelph.ca'], // Add more domains as needed
  },
  request: {
    maxSize: 1024, // 1KB max request size
  }
} as const;

export class ValidationService {
  /**
   * Validates email format, length, and domain restrictions
   */
  static validateEmail(email: string, options?: { 
    requireDomain?: string;
    allowedDomains?: string[];
  }): ValidationResult {
    if (!email) {
      return { valid: false, error: 'Email is required' };
    }
    
    if (email.length > VALIDATION_CONFIG.email.maxLength) {
      return { valid: false, error: 'Email too long' };
    }
    
    if (!VALIDATION_CONFIG.email.regex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    // Check domain restrictions if specified  
    if (options?.requireDomain) {
      if (!email.endsWith(options.requireDomain)) {
        return { valid: false, error: `Only ${options.requireDomain} emails are allowed` };
      }
    } else if (options?.allowedDomains) {
      const hasValidDomain = options.allowedDomains.some(domain => email.endsWith(domain));
      if (!hasValidDomain) {
        return { valid: false, error: `Email must be from allowed domains: ${options.allowedDomains.join(', ')}` };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Sanitizes email by trimming whitespace and converting to lowercase
   */
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
  
  /**
   * Validates and sanitizes email in one step
   */
  static processEmail(rawEmail: string | null, validationOptions?: {
    requireDomain?: string;
    allowedDomains?: string[];
  }): { email?: string; validation: ValidationResult } {
    if (!rawEmail || typeof rawEmail !== 'string') {
      return {
        validation: { valid: false, error: 'Email parameter is required' }
      };
    }

    const sanitizedEmail = this.sanitizeEmail(rawEmail);
    const validation = this.validateEmail(sanitizedEmail, validationOptions);
    
    if (validation.valid) {
      return { email: sanitizedEmail, validation };
    }
    
    return { validation };
  }
  
  /**
   * Validates request size to prevent DoS attacks
   */
  static validateRequestSize(contentLength: string | null): ValidationResult {
    if (contentLength && parseInt(contentLength) > VALIDATION_CONFIG.request.maxSize) {
      return { valid: false, error: 'Request too large' };
    }
    return { valid: true };
  }
}

/**
 * Creates standardized error responses for validation failures
 */
export function createValidationErrorResponse(
  error: string, 
  status: number = 400,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...additionalHeaders
    }
  });
}