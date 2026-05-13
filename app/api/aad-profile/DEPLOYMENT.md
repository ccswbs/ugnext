# Production Deployment Checklist for AAD Profile API

## ✅ Pre-Deployment Checklist

### Environment Variables
- [ ] `AZURE_AD_TENANT_ID` - Set in hosting platform environment variables
- [ ] `AZURE_AD_CLIENT_ID` - Set in hosting platform environment variables  
- [ ] `AZURE_AD_CLIENT_SECRET` - Set in hosting platform environment variables (marked as secret)
- [ ] `INTERNAL_API_KEY` - Generate secure 32+ character key (optional - for internal API bypass)
- [ ] `RATE_LIMIT_PER_IP` - Set to appropriate value (default: 100)
- [ ] `RATE_LIMIT_BURST` - Burst allowance for legitimate traffic (default: 20)
- [ ] `RATE_LIMIT_PER_EMAIL` - Per-email rate limit (default: 10)
- [ ] `RATE_LIMIT_EMAIL_DIVERSITY` - Max unique emails per IP (default: 50)
- [ ] `RATE_LIMIT_TOTAL` - Max total requests per IP in 5min (default: 200)
- [ ] `ALLOWED_ORIGINS` - Set to your frontend domain(s), comma-separated
- [ ] `NODE_ENV` - Set to "production"
- [ ] `DISABLE_AUTH` - Set to "false" in production (can be "true" in development)

### Security Configuration  
- [ ] Generate strong `INTERNAL_API_KEY` (use: `openssl rand -hex 32`)
- [ ] Configure CORS with specific origins (not wildcard)
- [ ] Set up Azure AD app with minimal required permissions
- [ ] Review Microsoft Graph API permissions
- [ ] Enable audit logging in Azure AD

### Rate Limiting Setup
- [ ] Configure rate limits via `RATE_LIMIT_PER_IP` and related environment variables
- [ ] Test intelligent rate limiting with multiple requests (see testing section)
- [ ] Test browser detection and burst allowance features
- [ ] Monitor memory usage in production
- [ ] Consider external rate limiting for high-traffic scenarios

### Testing
- [ ] Test with valid email addresses
- [ ] Test with invalid/malicious email formats
- [ ] Test rate limiting behavior
- [ ] Test authorization failures
- [ ] Test with expired/invalid Azure AD tokens
- [ ] Load test with concurrent requests

### Monitoring Setup
- [ ] Configure Netlify function analytics
- [ ] Set up error alerting for 500 errors
- [ ] Monitor rate limit violations
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation (optional)

## 🚀 Deployment Steps

1. **Deploy to your hosting platform**
   ```bash
   # For Netlify
   npm run build && netlify deploy --prod
   
   # For Vercel  
   npm run build && vercel deploy --prod
   
   # For other platforms - follow their deployment guide
   ```

2. **Verify Environment Variables**
   - Check your hosting platform's environment variable settings
   - Ensure all secrets are properly set
   - Test configuration with a curl request

3. **Test API Endpoints**
   ```bash
   # Test with valid API key
   curl -H "x-api-key: YOUR_API_KEY" \
        "https://your-site.netlify.app/api/aad-profile?email=test@example.com"
   
   # Test rate limiting (run multiple times)
   for i in {1..25}; do
     curl -H "x-api-key: YOUR_API_KEY" \
          "https://your-site.netlify.app/api/aad-profile?email=test@example.com"
   done
   ```

## 📊 Production Monitoring

### Key Metrics to Monitor
- **Response Time**: Should be < 2 seconds
- **Error Rate**: Should be < 1%
- **Rate Limit Violations**: Monitor for unusual patterns
- **Cache Hit Rate**: Should be > 70% for frequently requested users
- **Azure AD Token Refresh**: Monitor for authentication failures

### Alert Conditions
- Error rate > 5% over 5 minutes
- Response time > 5 seconds for 90th percentile
- Rate limit violations > 100/hour
- Azure AD authentication failures > 10/hour

### Log Monitoring
Look for these log patterns:
- `Unauthorized access attempt` - Security concern
- `Rate limit exceeded` - Potential abuse
- `Azure AD token request failed` - Configuration issue
- `Microsoft Graph [search|lookup] failed` - Service issue

## 🔧 Performance Optimization

### Implemented Optimizations
- ✅ Response caching (5 minutes for successful lookups)
- ✅ Minimal field selection from Microsoft Graph
- ✅ Connection pooling for HTTP requests
- ✅ Proper cache headers for CDN
- ✅ Gzip compression via Netlify

### Additional Optimizations for Scale
- [ ] Implement connection keep-alive for Microsoft Graph
- [ ] Add request deduplication for concurrent same-email requests  
- [ ] Implement batch processing for multiple email lookups
- [ ] Add circuit breaker for Microsoft Graph failures
- [ ] Set up multi-region deployment if needed

## 🛡️ Security Hardening

### Network Security
- [ ] Use Netlify Edge Functions for additional security layers
- [ ] Implement IP allowlisting if needed
- [ ] Configure WAF rules for common attack patterns
- [ ] Set up DDoS protection

### Application Security  
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Secrets rotation schedule
- [ ] Access logging and analysis

## 📈 Scaling Considerations

### Current Limits
- **Netlify Functions**: 125,000 function invocations/month (Pro plan)
- **Function Duration**: 30 seconds max
- **Memory**: 1024 MB allocated
- **Rate Limiting**: 100 requests/minute per IP (120 for legitimate browsers)
- **Email Rate Limiting**: 10 requests/minute per email
- **Suspicious Behavior Detection**: 50 unique emails per IP in 5 minutes

### Scaling Options
1. **Upgrade Netlify Plan** for higher limits
2. **Implement Caching Layer** (Redis/CDN)
3. **Batch Processing** for multiple requests  
4. **Geographic Distribution** for global users
5. **Microservice Architecture** for high traffic