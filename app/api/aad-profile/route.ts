// app/api/azure-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ValidationService, createValidationErrorResponse } from "@/lib/validation-utils";

// Production-ready configuration with intelligent rate limiting
const CONFIG = {
  rateLimit: {
    // Per-IP limits (generous for legitimate shared IPs)
    perIP: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: parseInt(process.env.RATE_LIMIT_PER_IP || '100'), // 100 requests per minute per IP
      burstAllowance: parseInt(process.env.RATE_LIMIT_BURST || '20') // Allow 20 burst requests
    },
    // Per-email limits (prevent email enumeration)
    perEmail: {
      windowMs: 60 * 1000, // 1 minute  
      maxRequests: parseInt(process.env.RATE_LIMIT_PER_EMAIL || '10') // 10 requests per email per minute
    },
    // Suspicious behavior detection
    suspicious: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxDifferentEmails: parseInt(process.env.RATE_LIMIT_EMAIL_DIVERSITY || '50'), // Max 50 different emails in 5 min
      maxTotalRequests: parseInt(process.env.RATE_LIMIT_TOTAL || '200') // Max 200 total requests in 5 min
    },
    enabled: process.env.DISABLE_RATE_LIMITING !== 'true'
  },
  cache: {
    ttl: 300, // 5 minutes cache for user data
    enabled: process.env.DISABLE_CACHING !== 'true',
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000') // Prevent memory exhaustion
  },
  validation: {
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxEmailLength: 254,
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '1024') // 1KB max request
  },
  security: {
    // Prevent timing attacks
    minResponseTime: parseInt(process.env.MIN_RESPONSE_TIME || '100'), // 100ms minimum
    maxCacheEntries: parseInt(process.env.MAX_CACHE_ENTRIES || '1000')
  }
};

// Intelligent rate limiting with multiple strategies
class IntelligentRateLimiter {
  private static ipRequests = new Map<string, number[]>();
  private static emailRequests = new Map<string, Map<string, number[]>>(); // IP -> email -> timestamps
  private static suspiciousActivity = new Map<string, { emails: Set<string>; requests: number[] }>(); 
  private static cleanupInterval: NodeJS.Timeout | null = null;
  
  static {  
    // Clean up old entries every 2 minutes
    if (typeof setInterval !== 'undefined') {
      IntelligentRateLimiter.cleanupInterval = setInterval(() => {
        IntelligentRateLimiter.cleanup();
      }, 2 * 60 * 1000);
    }

    // Clean up on process exit to prevent memory leaks
    if (typeof process !== 'undefined') {
      process.on('exit', () => IntelligentRateLimiter.destroy());
      process.on('SIGINT', () => IntelligentRateLimiter.destroy());
      process.on('SIGTERM', () => IntelligentRateLimiter.destroy());
    }
  }

  static destroy(): void {
    if (IntelligentRateLimiter.cleanupInterval) {
      clearInterval(IntelligentRateLimiter.cleanupInterval);
      IntelligentRateLimiter.cleanupInterval = null;
    }
    IntelligentRateLimiter.ipRequests.clear();
    IntelligentRateLimiter.emailRequests.clear();
    IntelligentRateLimiter.suspiciousActivity.clear();
  }
  
  private static cleanup(): void {
    const now = Date.now();
    const ipCutoff = now - CONFIG.rateLimit.perIP.windowMs;
    const suspiciousCutoff = now - CONFIG.rateLimit.suspicious.windowMs;
    
    // Clean up IP tracking
    for (const [clientIP, timestamps] of IntelligentRateLimiter.ipRequests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > ipCutoff);
      if (validTimestamps.length === 0) {
        IntelligentRateLimiter.ipRequests.delete(clientIP);
      } else {
        IntelligentRateLimiter.ipRequests.set(clientIP, validTimestamps);
      }
    }
    
    // Clean up email tracking
    for (const [clientIP, emailMap] of IntelligentRateLimiter.emailRequests.entries()) {
      const cleanedEmailMap = new Map<string, number[]>();
      for (const [email, timestamps] of emailMap.entries()) {
        const validTimestamps = timestamps.filter(timestamp => timestamp > ipCutoff);
        if (validTimestamps.length > 0) {
          cleanedEmailMap.set(email, validTimestamps);
        }
      }
      
      if (cleanedEmailMap.size === 0) {
        IntelligentRateLimiter.emailRequests.delete(clientIP);
      } else {
        IntelligentRateLimiter.emailRequests.set(clientIP, cleanedEmailMap);
      }
    }
    
    // Clean up suspicious activity tracking
    for (const [clientIP, activity] of IntelligentRateLimiter.suspiciousActivity.entries()) {
      const validRequests = activity.requests.filter(timestamp => timestamp > suspiciousCutoff);
      if (validRequests.length === 0) {
        IntelligentRateLimiter.suspiciousActivity.delete(clientIP);
      } else {
        activity.requests = validRequests;
        IntelligentRateLimiter.suspiciousActivity.set(clientIP, activity);
      }
    }
  }
  
  static check(clientIP: string, email: string, userAgent: string): { 
    allowed: boolean; 
    remaining: number; 
    reason?: string;
    isLegitimate?: boolean;
  } {
    if (!CONFIG.rateLimit.enabled) {
      return { allowed: true, remaining: CONFIG.rateLimit.perIP.maxRequests, isLegitimate: true };
    }
    
    const now = Date.now();
    const ipCutoff = now - CONFIG.rateLimit.perIP.windowMs;
    const suspiciousCutoff = now - CONFIG.rateLimit.suspicious.windowMs;
    
    // Check if this looks like a legitimate browser/app
    const isLegitimateUA = IntelligentRateLimiter.isLegitimateUserAgent(userAgent);
    
    // Get current IP request history
    const ipTimestamps = IntelligentRateLimiter.ipRequests.get(clientIP) || [];
    const validIPTimestamps = ipTimestamps.filter(timestamp => timestamp > ipCutoff);
    
    // Get email-specific request history for this IP
    const emailMap = IntelligentRateLimiter.emailRequests.get(clientIP) || new Map();
    const emailTimestamps = emailMap.get(email) || [];
    const validEmailTimestamps = emailTimestamps.filter((timestamp: number) => timestamp > ipCutoff);
    
    // Get suspicious activity tracking
    const suspicious = IntelligentRateLimiter.suspiciousActivity.get(clientIP) || { 
      emails: new Set(), 
      requests: [] 
    };
    const validSuspiciousRequests = suspicious.requests.filter(timestamp => timestamp > suspiciousCutoff);
    
    // Check per-email limit (prevent email enumeration)
    if (validEmailTimestamps.length >= CONFIG.rateLimit.perEmail.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'Per-email rate limit exceeded',
        isLegitimate: isLegitimateUA
      };
    }
    
    // For legitimate user agents, be more generous with limits
    const effectiveIPLimit = isLegitimateUA 
      ? CONFIG.rateLimit.perIP.maxRequests + CONFIG.rateLimit.perIP.burstAllowance
      : CONFIG.rateLimit.perIP.maxRequests;
    
    // Check per-IP limit with burst allowance for legitimate traffic
    if (validIPTimestamps.length >= effectiveIPLimit) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'Per-IP rate limit exceeded',
        isLegitimate: isLegitimateUA
      };
    }
    
    // Check for suspicious behavior patterns (only for non-legitimate UAs)
    if (!isLegitimateUA) {
      // Track unique emails queried
      suspicious.emails.add(email);
      
      // Check email diversity (too many different emails suggests enumeration)
      if (suspicious.emails.size > CONFIG.rateLimit.suspicious.maxDifferentEmails) {
        return {
          allowed: false,
          remaining: 0,
          reason: 'Suspicious activity: too many different emails queried',
          isLegitimate: false
        };
      }
      
      // Check total request volume
      if (validSuspiciousRequests.length >= CONFIG.rateLimit.suspicious.maxTotalRequests) {
        return {
          allowed: false,
          remaining: 0,
          reason: 'Suspicious activity: too many total requests',
          isLegitimate: false
        };
      }
    }
    
    // Update tracking
    validIPTimestamps.push(now);
    IntelligentRateLimiter.ipRequests.set(clientIP, validIPTimestamps);
    
    validEmailTimestamps.push(now);
    emailMap.set(email, validEmailTimestamps);
    IntelligentRateLimiter.emailRequests.set(clientIP, emailMap);
    
    if (!isLegitimateUA) {
      suspicious.requests.push(now);
      IntelligentRateLimiter.suspiciousActivity.set(clientIP, suspicious);
    }
    
    return {
      allowed: true,
      remaining: effectiveIPLimit - validIPTimestamps.length,
      isLegitimate: isLegitimateUA
    };
  }
  
  private static isLegitimateUserAgent(userAgent: string): boolean {
    if (!userAgent) return false;
    
    const ua = userAgent.toLowerCase();
    
    // Common legitimate browsers and mobile apps
    const legitimatePatterns = [
      /mozilla\/.+chrome\//,
      /mozilla\/.+firefox\//,
      /mozilla\/.+safari\//,
      /mozilla\/.+edge\//,
      /okhttp\//,              // Android apps
      /cfnetwork\//,           // iOS apps  
      /alamofire\//,           // iOS networking library
      /axios\//,               // Popular HTTP client
      /fetch\//,               // Modern browsers
      /node-fetch\//,          // Node.js applications
    ];
    
    // Suspicious patterns that suggest automated tools
    const suspiciousPatterns = [
      /curl\//,
      /wget/,
      /python/,
      /bot/,
      /crawler/,
      /spider/,
      /scraper/,
      /postman/,
      /insomnia/
    ];
    
    // Check for suspicious patterns first
    if (suspiciousPatterns.some(pattern => pattern.test(ua))) {
      return false;
    }
    
    // Check for legitimate patterns
    return legitimatePatterns.some(pattern => pattern.test(ua));
  }
}

// Enhanced authorization with multiple strategies
class AuthorizationService {
  static async isAuthorized(request: NextRequest): Promise<{ authorized: boolean; context?: any }> {
    // Check API key for internal services
    const apiKey = request.headers.get('x-api-key');
    if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
      return { authorized: true, context: { type: 'api-key' } };
    }
    
    // Check Bearer token with proper JWT validation
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const jwtResult = AuthorizationService.validateJWT(token);
      if (jwtResult.valid) {
        return { 
          authorized: true, 
          context: { 
            type: 'jwt', 
            claims: jwtResult.claims 
          } 
        };
      }
    }
    
    return { authorized: false };
  }
  
  private static validateJWT(token: string): { valid: boolean; claims?: any } {
    if (!token || !process.env.JWT_SECRET) {
      return { valid: false };
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'], // Specify allowed algorithms
        maxAge: '1h', // Maximum token age
        clockTolerance: 30 // 30 second clock skew tolerance
      });
      
      // Validate required claims
      if (typeof decoded === 'object' && decoded.sub && decoded.exp) {
        return { valid: true, claims: decoded };
      }
      
      return { valid: false };
    } catch (error) {
      console.warn('JWT validation failed:', error instanceof Error ? error.message : 'Unknown error');
      return { valid: false };
    }
  }
}

// Safe GraphQL filter construction
class GraphQLService {
  static buildSafeFilter(email: string): string {
    // Comprehensive OData escaping
    const escapedEmail = email
      .replace(/'/g, "''")  // Escape single quotes
      .replace(/%/g, "%25") // Escape percent (wildcard)
      .replace(/_/g, "\_")   // Escape underscore (wildcard)
      .replace(/\(/g, "%28") // Escape parentheses
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A") // Escape asterisk
      .replace(/;/g, "%3B")  // Escape semicolon
      .replace(/--/g, "%2D%2D"); // Escape SQL comment
    
    // Validate email format before building filter
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format for filter');
    }
    
    return `mail eq '${escapedEmail}' or userPrincipalName eq '${escapedEmail}'`;
  }
}

// Caching service for production
class CacheService {
  private static cache = new Map<string, { data: any; expiry: number; accessTime: number }>();
  
  static get(key: string): any | null {
    if (!CONFIG.cache.enabled) return null;
    
    const item = CacheService.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      CacheService.cache.delete(key);
      return null;
    }
    
    // Update access time for LRU
    item.accessTime = Date.now();
    CacheService.cache.set(key, item);
    
    return item.data;
  }
  
  static set(key: string, data: any): void {
    if (!CONFIG.cache.enabled) return;
    
    // Prevent cache poisoning with input validation
    if (typeof key !== 'string' || key.length > 100) {
      console.warn('Invalid cache key rejected:', key?.substring?.(0, 50));
      return;
    }
    
    // Implement cache size limit with LRU eviction
    if (CacheService.cache.size >= CONFIG.security.maxCacheEntries) {
      CacheService.evictLRU();
    }
    
    const expiry = Date.now() + (CONFIG.cache.ttl * 1000);
    const accessTime = Date.now();
    CacheService.cache.set(key, { data, expiry, accessTime });
  }
  
  private static evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, item] of CacheService.cache.entries()) {
      if (item.accessTime < oldestTime) {
        oldestTime = item.accessTime;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      CacheService.cache.delete(oldestKey);
    }
  }
  
  static generateKey(email: string): string {
    // Prevent cache key injection
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '');
    return `aad_profile:${sanitizedEmail}`;
  }
  
  static clear(): void {
    CacheService.cache.clear();
  }
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let clientIP = 'unknown';
  let validatedEmail: string | undefined;
  
  try {
    // Check request size to prevent DoS attacks
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > CONFIG.validation.maxRequestSize) {
      return new NextResponse(JSON.stringify({ error: 'Request too large' }), {
        status: 413,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }
    // Extract client IP with multiple fallbacks for different hosting providers
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIP = headersList.get('x-real-ip');
    const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare
    const clientIPHeader = headersList.get('x-client-ip'); // Generic
    
    // Try multiple IP detection methods
    clientIP = cfConnectingIP || 
               realIP || 
               clientIPHeader ||
               forwardedFor?.split(',')[0]?.trim() || 
               'unknown';
    
    // Validate and sanitize IP address to prevent injection
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^unknown$/;
    if (!ipRegex.test(clientIP)) {
      console.warn('Invalid IP format detected, using unknown:', clientIP);
      clientIP = 'unknown';
    }
    
    // Validate environment configuration
    const requiredEnvVars = ['AZURE_AD_TENANT_ID', 'AZURE_AD_CLIENT_ID', 'AZURE_AD_CLIENT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return new NextResponse(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }
    
// Get and validate email parameter FIRST
    const rawEmail = req.nextUrl.searchParams.get('email');
    if (!rawEmail) {
      return new NextResponse(JSON.stringify({ error: 'Missing email parameter' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Validate and sanitize email using shared utility
    const { email: validatedEmailResult, validation } = ValidationService.processEmail(rawEmail);
    
    if (!validation.valid || !validatedEmailResult) {
      return createValidationErrorResponse(validation.error!);
    }
    
    validatedEmail = validatedEmailResult;

    // Check authorization with proper async handling
    const authResult = await AuthorizationService.isAuthorized(req);
    if (!authResult.authorized) {
      console.warn(`Unauthorized access attempt from IP: ${clientIP}`, {
        userAgent: req.headers.get('user-agent'),
        referer: req.headers.get('referer'),
        timestamp: new Date().toISOString(),
        email: validatedEmail.replace(/(.{2}).*(@.*)/, '$1***$2')
      });
      
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Check rate limiting with validated email
    const userAgent = req.headers.get('user-agent') || '';
    const rateLimitResult = IntelligentRateLimiter.check(clientIP, validatedEmail, userAgent);
    
    if (!rateLimitResult.allowed) {
      const logData = {
        clientIP,
        userAgent,
        email: validatedEmail.replace(/(.{2}).*(@.*)/, '$1***$2'),
        reason: rateLimitResult.reason,
        isLegitimate: rateLimitResult.isLegitimate,
        timestamp: new Date().toISOString()
      };
      
      // Log with different severity based on legitimacy
      if (rateLimitResult.isLegitimate) {
        console.warn('Rate limit hit for legitimate user:', logData);
      } else {
        console.warn('Rate limit hit for suspicious activity:', logData);
      }
      
      const retryAfter = rateLimitResult.isLegitimate ? '30' : '60';
      
      return new NextResponse(JSON.stringify({ 
        error: 'Too many requests',
        message: rateLimitResult.isLegitimate 
          ? 'Rate limit exceeded. This appears to be legitimate traffic - please try again in 30 seconds.'
          : 'Rate limit exceeded. Please try again later.',
        retryAfter: parseInt(retryAfter),
        reason: rateLimitResult.reason
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter,
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'Cache-Control': 'no-store'
        }
      });
    }
    
    // Check cache first
    const cacheKey = CacheService.generateKey(validatedEmail);
    const cachedResult = CacheService.get(cacheKey);
    
    if (cachedResult) {
      console.log(`Cache hit for email lookup (IP: ${clientIP})`);
      return new NextResponse(JSON.stringify(cachedResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes
          'X-Cache': 'HIT',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Legitimate': rateLimitResult.isLegitimate ? 'true' : 'false'
        }
      });
    }
    
    // Get Azure AD access token
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'UGNext-AAD-Profile/1.0'
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      })
    });
    
    if (!tokenResponse.ok) {
      // Log detailed error internally but return generic message
      console.error('Azure AD token request failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        timestamp: new Date().toISOString(),
        clientIP
      });
      
      // Prevent timing attacks - ensure minimum response time
      const elapsed = Date.now() - startTime;
      if (elapsed < CONFIG.security.minResponseTime) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.security.minResponseTime - elapsed));
      }
      
      return new NextResponse(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      });
    }
    
    const { access_token } = await tokenResponse.json();
    
    // Define select fields for security and performance
    const selectFields = 'id,displayName,mail,userPrincipalName,givenName,surname,jobTitle,department,officeLocation';
    
    // First try direct lookup by userPrincipalName
    let userResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(validatedEmail)}?$select=${selectFields}`, {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'UGNext-AAD-Profile/1.0'
      }
    });
    
    // If direct lookup fails, try search by mail attribute
    if (!userResponse.ok && userResponse.status === 404) {
      console.log(`Direct lookup failed for email, trying search (IP: ${clientIP})`);
      
      const safeFilter = GraphQLService.buildSafeFilter(validatedEmail);
      const searchUrl = `https://graph.microsoft.com/v1.0/users?$filter=${encodeURIComponent(safeFilter)}&$select=${selectFields}&$top=1`;
      
      const searchResponse = await fetch(searchUrl, {
        headers: { 
          Authorization: `Bearer ${access_token}`,
          'User-Agent': 'UGNext-AAD-Profile/1.0'
        }
      });
      
      if (!searchResponse.ok) {
        console.error('Microsoft Graph search failed:', {
          status: searchResponse.status,
          statusText: searchResponse.statusText,
          timestamp: new Date().toISOString(),
          clientIP,
          email: validatedEmail.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially mask email in logs
        });
        
        // Prevent timing attacks
        const elapsed = Date.now() - startTime;
        if (elapsed < CONFIG.security.minResponseTime) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.security.minResponseTime - elapsed));
        }
        
        return new NextResponse(JSON.stringify({ error: 'User lookup failed' }), {
          status: 503, // Always return 503 to avoid information leakage
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
          }
        });
      }
      
      const searchResult = await searchResponse.json();
      
      if (!searchResult.value || searchResult.value.length === 0) {
        return new NextResponse(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60' // Cache not found for 1 minute
          }
        });
      }
      
      const user = searchResult.value[0];
      
      // Cache the result
      CacheService.set(cacheKey, user);
      
      // Log successful lookup
      console.log(`User found via search (IP: ${clientIP}, duration: ${Date.now() - startTime}ms)`);
      
      return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'X-Cache': 'MISS',
          'X-Response-Time': `${Date.now() - startTime}ms`,
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Legitimate': rateLimitResult.isLegitimate ? 'true' : 'false'
        }
      });
    }
    
    if (!userResponse.ok) {
      console.error('Microsoft Graph direct lookup failed:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        timestamp: new Date().toISOString(),
        clientIP,
        email: validatedEmail.replace(/(.{2}).*(@.*)/, '$1***$2')
      });
      
      const status = userResponse.status >= 500 ? 503 : 400;
      return new NextResponse(JSON.stringify({ error: 'User lookup failed' }), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }
    
    const user = await userResponse.json();
    
    // Cache the result
    CacheService.set(cacheKey, user);
    
    // Log successful lookup
    console.log(`User found via direct lookup (IP: ${clientIP}, duration: ${Date.now() - startTime}ms)`);
    
    return new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Legitimate': rateLimitResult.isLegitimate ? 'true' : 'false',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('Unexpected error in AAD profile route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      clientIP,
      email: validatedEmail ? validatedEmail.replace(/(.{2}).*(@.*)/, '$1***$2') : 'unknown',
      duration
    });
    
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  // Default to localhost for development, require explicit configuration for production
  const defaultOrigins = process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:3001']
    : [];
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || defaultOrigins;
  
  // Never allow wildcard in production
  if (process.env.NODE_ENV === 'production' && allowedOrigins.includes('*')) {
    console.error('CORS wildcard (*) not allowed in production. Set ALLOWED_ORIGINS environment variable.');
    return new NextResponse(JSON.stringify({ error: 'CORS misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : 'null';
  
  // Log blocked CORS attempts
  if (origin && allowOrigin === 'null') {
    console.warn('Blocked CORS request from unauthorized origin:', {
      origin,
      allowedOrigins: allowedOrigins.length > 0 ? '[CONFIGURED]' : '[NONE]',
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  }
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-api-key',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    }
  });
}