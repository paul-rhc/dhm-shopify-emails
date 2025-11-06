# Quick Start Guide

Get up and running with DHM email templates in 5 minutes.

## 1. Initial Setup

### Get Your Mailtrap Credentials

1. Log in to [Mailtrap.io](https://mailtrap.io/)
2. Go to **Email Sandbox** → **Inboxes**
3. Click your inbox → **Integrations** tab → Select **SMTP**
4. Copy your credentials:
   - Username
   - Password

### Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Mailtrap credentials
# MAILTRAP_USER=your_username_here
# MAILTRAP_PASS=your_password_here
```

### Install Optional Dependency (for automated testing)

```bash
npm install nodemailer
```

> **Note:** You can skip this and manually upload to Mailtrap if preferred.

## 2. Build & Test Workflow

### Build a template

```bash
npm run build
```

This compiles all templates from `src/templates/` → `dist/`

### Test in Mailtrap

```bash
npm run test-email -- dist/test-email.html
```

This will:
1. Replace Shopify Liquid variables with sample data
2. Send the email to your Mailtrap inbox
3. Open Mailtrap to preview

### Manual Testing Alternative

If you prefer not to use the script:

1. Build: `npm run build`
2. Open Mailtrap → Your inbox
3. Click **"Send Email"** button
4. Paste HTML from `dist/test-email.html`
5. Click **"Send"**

## 3. Create Your First Email

### Example: Subscription Order Email

1. **Create template file:**

```bash
# Create new template
touch src/templates/subscription-order.html
```

2. **Add basic structure:**

```html
{{> head }}
{{> header }}

<!-- BEGIN: MAIN CONTENT -->
<table class="sections_container" border="0" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <th class="section_border" style="padding: 45px 30px" bgcolor="#ffffff">
      <h1 style="color: #4a693d;">Thank you for your subscription!</h1>
      <p>Your subscription order has been confirmed.</p>

      <!-- Add your subscription-specific content here -->

    </th>
  </tr>
</table>
<!-- END: MAIN CONTENT -->

{{> footer }}
```

3. **Build it:**

```bash
npm run build
```

4. **Test it:**

```bash
npm run test-email -- dist/subscription-order.html
```

## 4. Common Tasks

### Change Logo Alignment

Edit `src/partials/header.html`:

```html
<!-- For center alignment -->
<img class="logo logo-center logo-mobile-center" ... />

<!-- For left alignment (current) -->
<img class="logo logo-left logo-mobile-left" ... />

<!-- For right alignment -->
<img class="logo logo-right logo-mobile-right" ... />
```

Then rebuild: `npm run build`

### Update Footer Text

Edit `src/partials/footer.html` and rebuild.

### Modify Styles

Edit `src/partials/head.html` (all CSS is in the `<style>` tags) and rebuild.

## 5. Review Checklist

When testing in Mailtrap, check:

- ✅ **HTML Preview Tab**
  - Desktop, mobile, and tablet views
  - Images load correctly
  - Links work
  - Fonts render properly

- ✅ **HTML Check Tab**
  - Email client compatibility report
  - CSS support across clients
  - No critical errors

- ✅ **Spam Analysis Tab**
  - Low spam score
  - No major triggers

- ✅ **Text Tab**
  - Plain-text version readable

## 6. Deploy to Shopify

Once your email looks good in Mailtrap:

1. Open `dist/your-email.html`
2. Copy the entire HTML
3. Go to Shopify Admin → **Settings** → **Notifications**
4. Select the email template type
5. Paste your HTML
6. Save

## Tips

- 💡 Build often, test frequently
- 💡 Always test on mobile (most opens are mobile)
- 💡 Keep HTML/CSS simple for better email client support
- 💡 Use sample data that mimics real orders

## Troubleshooting

### Email not sending to Mailtrap?

Check:
1. `.env` file exists and has correct credentials
2. `nodemailer` is installed: `npm install nodemailer`
3. Mailtrap credentials are correct

### Styles not showing?

- Email clients ignore external CSS
- All styles must be inline or in `<style>` tags
- Our templates handle this correctly ✅

### Logo not showing in Mailtrap?

- The test script replaces `{{shop.email_logo_url}}` with a placeholder
- Real logo will show when deployed to Shopify

## Next Steps

1. ✅ Set up Mailtrap credentials
2. ✅ Test the example email
3. ✅ Create your first subscription email
4. ✅ Review in multiple email clients
5. ✅ Deploy to Shopify

**Need help?** Check [MAILTRAP_SETUP.md](MAILTRAP_SETUP.md) for detailed Mailtrap documentation.
