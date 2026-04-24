# Summary of changes
Brief description of the proposed changes

## Frontend
List all significant changes to Next.js code

## Backend
List all significant changes to the Drupal site (e.g., new fields, content types, modules, etc). If adding new fields, try to include help text to ensure users understand how to use the fields.

## Checklist

<details>
<summary>Accessibility</summary>
### Accessibility
- [ ] Changes comply with WCAG 2.0 Level AA standards minimum
- [ ] All interactive elements are keyboard accessible
- [ ] Form labels and error messages are properly associated
- [ ] Images and media have appropriate alt text
- [ ] Colour is not used as the only means of conveying information
- [ ] Screen reader testing performed for new components
</details>

<details>
<summary>Performance</summary>
### Performance
- [ ] No unnecessary re-renders or performance regressions
- [ ] Images are optimized and using appropriate formats (WebP, etc.)
- [ ] Bundle size impact has been considered
- [ ] Large content is lazy-loaded where appropriate
- [ ] Core Web Vitals are not negatively impacted
</details>

<details>
<summary>Responsive Design</summary>
### Responsive Design
- [ ] Changes are responsive and appear as expected on mobile, tablet, and desktop views
- [ ] Touch targets are appropriately sized (minimum 44x44px)
- [ ] Text readability is maintained across all breakpoints
</details>

<details>
<summary>Analytics</summary>
### Analytics
- [ ] Changes have been reviewed to ensure they do not break existing analytics triggers
- [ ] New tracking has been added if user interactions were introduced
- [ ] Data layer updates are documented if applicable
</details>

<details>
<summary>Security</summary>
### Security
- [ ] No sensitive data is exposed in client-side code
- [ ] User inputs are properly sanitized and validated
- [ ] External dependencies and third-party scripts have been reviewed
- [ ] CORS and authentication requirements are correctly configured
</details>

<details>
<summary>SEO & Metadata</summary>
### SEO & Metadata
- [ ] Sitemap is updated if new pages or routes were added
- [ ] Page titles are descriptive and under 60 characters
- [ ] Meta descriptions are present and under 160 characters
- [ ] Open Graph (og:) and Twitter Card metadata are updated if applicable
- [ ] Canonical tags are correct to avoid duplicate content issues
- [ ] Heading hierarchy (H1, H2, H3, etc.) is semantic and logical
- [ ] Internal links are descriptive with meaningful anchor text
- [ ] Image filenames and alt text are SEO-friendly and descriptive
- [ ] Structured data/schema markup is added for rich snippets if applicable
</details>

<details>
<summary>Documentation & Training</summary>
### Documentation & Training
- [ ] Code changes are documented and comments explain complex logic
- [ ] Component prop documentation is updated
- [ ] I will update the [Content Hub documentation](https://uoguelphca.sharepoint.com/sites/UniversityContentHubInformationGroup) after merging
- [ ] Content Hub trainer has been notified of changes that affect end-users
</details>

# Test Plan

Insert steps. Include URLs of Netlify test site and Drupal multidev.