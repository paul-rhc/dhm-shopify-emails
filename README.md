# DHM Shopify Email Templates

Modular email template system for DirectHomeMedical Shopify transactional emails.

## Overview

This project uses a **partial-based template system** to maintain consistent styling across all Shopify email templates. Reusable components (header, footer, styles) are defined once and included in multiple email templates.

## Project Structure

```
DHM-Shopify-Emails/
├── src/
│   ├── partials/          # Reusable email components
│   │   ├── head.html      # HTML head with all CSS styles
│   │   ├── header.html    # Logo and header section
│   │   └── footer.html    # Footer with return policy
│   └── templates/         # Email template compositions
│       └── test-email.html
├── dist/                  # Compiled final templates (ready for Shopify)
├── build.js              # Build script
└── Original Email/       # Original Shopify templates for reference
```

## Quick Start

### Build all templates

```bash
node build.js
```

This will compile all templates from `src/templates/` and output them to `dist/`.

### Creating a new email template

1. Create a new file in `src/templates/`, e.g., `subscription-order.html`
2. Use the include syntax to add partials:

```html
{{> head }}
{{> header }}

<!-- Your custom email content here -->

{{> footer }}
```

3. Run `node build.js` to compile
4. Find your compiled template in `dist/subscription-order.html`

## Partial Include Syntax

Use `{{> partial-name }}` to include a partial:

```html
{{> head }}       <!-- Includes src/partials/head.html -->
{{> header }}     <!-- Includes src/partials/header.html -->
{{> footer }}     <!-- Includes src/partials/footer.html -->
```

## Available Partials

### `head.html`
Complete HTML head section including:
- Meta tags for email client compatibility
- All CSS styles (base styles, mobile responsive, custom styles)
- MSO (Microsoft Office) conditional tags for Outlook
- Preview text configuration
- Opening body tag and container structure

**Variables you can customize:**
- `{{email_title}}` - Email subject/title
- `{{preview_text}}` - Preview text shown in inbox
- `{{email_type}}` - Email type for tracking (e.g., "order-confirmation", "subscription-order")

### `header.html`
Header section with logo, includes:
- Left-aligned logo (240px width)
- Green background (#e7fed0)
- Responsive mobile layout
- Shopify Liquid variable: `{{shop.email_logo_url}}`

### `footer.html`
Footer section with store information:
- Return address
- Return policy information
- Insurance claim information
- Copyright notice
- Tracking pixel (uses `{{email_type}}` variable)

## Shopify Liquid Variables

All Shopify Liquid syntax is preserved during the build process:

```html
{{shop.email_logo_url}}        <!-- Shop logo URL -->
{{shop.domain}}                <!-- Shop domain -->
{{shop.email}}                 <!-- Shop email -->
{{ 'now' | date: '%Y' }}       <!-- Current year -->
{% if condition %}...{% endif %} <!-- Conditional logic -->
```

## Important Notes

### Email Width
All templates use a **600px width** for the main email container, which is the industry standard for email compatibility.

### HTML Validation
Email HTML uses non-standard patterns for email client compatibility:
- Tables with `<th>` tags instead of `<td>`
- Missing `<tbody>` tags
- Inline styles everywhere

These are **intentional** and required for cross-email-client compatibility. The following files disable validation:
- `.prettierignore` - Excludes HTML from Prettier formatting
- `.vscode/settings.json` - Disables VS Code HTML validation

### Logo Alignment
The logo is configured to be left-aligned. If you need to change this:
1. Edit `src/partials/header.html`
2. Change classes from `logo-left logo-mobile-left` to `logo-center logo-mobile-center`
3. Rebuild templates

## Workflow for New Emails

When you need to create a new email template:

1. **Analyze the original** - Look at the Shopify default template in `Original Email/`
2. **Identify unique sections** - Determine what content is unique to this email type
3. **Create template** - Create a new file in `src/templates/` using partials for common sections
4. **Build** - Run `node build.js` to compile
5. **Test** - Upload to Shopify and test in multiple email clients

## Example Template

See [src/templates/test-email.html](src/templates/test-email.html) for a complete working example.

## Future Enhancements

Potential additions to the system:
- Additional partials (order items table, customer info, CTA buttons)
- Variable substitution for colors and widths
- Conditional includes
- Multiple template variants
