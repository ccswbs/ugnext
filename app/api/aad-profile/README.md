# AAD Profile API Security Implementation

## Security Features Implemented

### 1. **GraphQL Injection Prevention**
- Input email validation with regex pattern
- Proper escaping of single quotes in GraphQL filters
- URL encoding of filter parameters

### 2. **Information Disclosure Protection**
- Generic error messages without internal details
- Structured logging that separates user-facing and internal error information
- No exposure of Microsoft API error details to clients

### 3. **Intelligent Rate Limiting**
- Multi-tier protection: 100 requests per minute per IP (120 for legitimate browsers)
- Per-email limits: 10 requests per minute per email (prevents enumeration)
- Suspicious behavior detection for email enumeration and automated scraping
- Browser detection with burst allowance for legitimate traffic
- In-memory rate limiting store (upgrade to Redis for production)
- HTTP 429 status for rate limit violations

### 4. **Authentication & Authorization**
- API key or Bearer token requirement
- Configurable authorization check function
- Unauthorized access logging
- Development bypass option (DISABLE_AUTH=true in development)

### 5. **Input Validation**
- Email format validation using regex
- Email length validation (RFC 5321 limit)
- Parameter presence validation

### 6. **Security Best Practices**
- Environment variable validation
- Secure error logging without sensitive data exposure
- Minimal data exposure in API responses
- Proper HTTP status codes

## Required Environment Variables

```env
# Azure AD Configuration (Required)
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret

# API Security (Optional - for internal API bypass)
INTERNAL_API_KEY=your-secure-api-key-minimum-32-characters

# Intelligent Rate Limiting Configuration (All Optional - have defaults)
RATE_LIMIT_PER_IP=100              # Requests per minute per IP (default: 100)
RATE_LIMIT_BURST=20                # Extra requests for legitimate traffic (default: 20) 
RATE_LIMIT_PER_EMAIL=10            # Requests per email per minute (default: 10)
RATE_LIMIT_EMAIL_DIVERSITY=50      # Max unique emails per IP in 5min (default: 50)
RATE_LIMIT_TOTAL=200               # Max total requests per IP in 5min (default: 200)

# Optional Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-domain.com
DISABLE_RATE_LIMITING=false
DISABLE_CACHING=false
DISABLE_AUTH=false                 # Set to true in development to bypass authentication
NODE_ENV=production
```

## Intelligent Rate Limiting

The API uses a multi-tier intelligent rate limiting system designed to accommodate legitimate high-traffic scenarios while preventing abuse:

### **Legitimate Traffic Protection**
- **Browser Detection**: Automatically detects legitimate browsers and mobile apps
- **Burst Allowance**: Legitimate traffic gets 120 requests/minute (100 base + 20 burst)
- **Generous IP Limits**: Supports multiple users behind corporate firewalls/NAT
- **Shorter Penalties**: Legitimate traffic gets 30-second retry instead of 60 seconds

### **Multi-Layer Protection**
1. **Per-IP Limits**: 100 requests/minute (120 for legitimate browsers)
2. **Per-Email Limits**: 10 requests/minute per email (prevents enumeration)
3. **Suspicious Behavior**: Detects email enumeration and automated scraping
4. **User Agent Analysis**: Distinguishes between browsers and bots

### **Automatic Scaling**
- **Corporate Networks**: Multiple employees can browse profiles simultaneously
- **High Traffic**: Burst allowance handles traffic spikes
- **Mobile Users**: Carrier-grade NAT is accommodated with higher limits

### Caching

Built-in memory caching with:
- 5-minute TTL for successful user lookups
- Automatic cache cleanup
- Can be disabled with `DISABLE_CACHING=true`

## Usage

### Authentication Options

1. **API Key Header:**
   ```
   x-api-key: your-secure-api-key
   ```

2. **Bearer Token:**
   ```
   Authorization: Bearer your-jwt-token
   ```

### Request Example

```bash
curl -X GET "https://your-domain/api/aad-profile?email=user@example.com" \
  -H "x-api-key: your-secure-api-key"
```

## Production Recommendations

1. **Rate Limiting:** Replace in-memory store with Redis
2. **Authentication:** Implement proper JWT validation
3. **Monitoring:** Add comprehensive logging and alerting
4. **Caching:** Implement response caching for frequently requested profiles
5. **Network Security:** Use IP allowlisting if possible
6. **Secrets Management:** Use Azure Key Vault or similar for secrets