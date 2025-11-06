# Mailtrap Setup Guide

Guide for testing DHM Shopify email templates with Mailtrap.

## What is Mailtrap?

Mailtrap is an email testing tool that captures test emails in a safe sandbox environment. You can:
- Preview emails in different email clients (Gmail, Outlook, Apple Mail, etc.)
- Check HTML/CSS compatibility across clients
- Test responsive design (mobile, tablet, desktop)
- Validate spam score
- Debug email rendering issues

**Perfect for testing Shopify email templates before deploying them!**

## Setup Steps

### 1. Access Your Mailtrap Inbox

1. Log in to [Mailtrap](https://mailtrap.io/)
2. Go to **Email Sandbox** → **Inboxes**
3. Open your default inbox (or create a new one for DHM emails)

### 2. Get SMTP Credentials

In your inbox, click the **Integration** tab and note:
- **Host**: `sandbox.smtp.mailtrap.io`
- **Port**: `2525` (or 465/587)
- **Username**: Your unique username
- **Password**: Your unique password

### 3. Testing Options

You have several ways to test your email templates:

#### Option A: Send via Script (Recommended)

Use the included test script (see below) to send compiled templates directly to Mailtrap.

#### Option B: Manual Upload

1. Build your template: `npm run build`
2. In Mailtrap inbox, click **"Send Email"** button
3. Paste your HTML from `dist/` folder
4. Click **"Send"**

#### Option C: Forward from Shopify

1. Set up a test order in Shopify
2. Configure Shopify to forward test emails to your Mailtrap email address
3. Found in inbox settings: **"Email Address"** (e.g., `abc123@inbox.mailtrap.io`)

## Testing Workflow

### 1. Build Your Template
```bash
npm run build
```

### 2. Send to Mailtrap
```bash
npm run test-email -- dist/test-email.html
```

### 3. Review in Mailtrap

Once the email appears in your Mailtrap inbox:

#### a) **HTML Preview**
- Check desktop, mobile, and tablet views
- Verify images load correctly
- Test all links and buttons
- Ensure fonts render properly

#### b) **HTML Check Tab**
- See compatibility report for 50+ email clients
- Identifies CSS rules that won't work in certain clients
- Shows "Market Support" percentage
- Highlights specific issues per client

#### c) **Spam Analysis Tab**
- Check spam score
- Review spam triggers
- Ensure proper authentication headers

#### d) **Text Tab**
- Verify plain-text version exists
- Check readability without HTML

## Email Client Preview

Mailtrap shows how your email renders in:
- **Gmail** (Desktop, Mobile, Android App)
- **Outlook** (2007, 2010, 2013, 2016, 2019, 365, Mac)
- **Apple Mail** (iOS, macOS)
- **Yahoo! Mail**
- **AOL Mail**
- And 40+ more clients

## Common Issues to Check

### 1. Logo Not Displaying
- Ensure `{{shop.email_logo_url}}` has a valid URL
- Check image URL is accessible publicly

### 2. Styles Not Applied
- Email clients ignore external stylesheets
- All styles must be inline or in `<style>` tags
- Our templates already handle this ✅

### 3. Layout Breaks on Mobile
- Check responsive media queries
- Test width constraints (our 600px width is optimal)

### 4. Outlook Rendering Issues
- MSO conditional comments may be needed
- Our templates include these ✅

## Tips

1. **Test Early, Test Often** - Send to Mailtrap after every major change
2. **Check Multiple Clients** - Gmail and Outlook render differently
3. **Use Real Data** - Replace Liquid variables with sample data for testing
4. **Mobile First** - Most emails are opened on mobile devices
5. **Keep It Simple** - Complex CSS often breaks in email clients

## Integrating with CI/CD

You can automate email testing with Mailtrap's API:

```bash
# Send email via API
curl -X POST "https://sandbox.api.mailtrap.io/api/send" \
  -H "Api-Token: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": [{"email": "test@example.com"}],
    "from": {"email": "shop@directhomemedical.com"},
    "subject": "Test Email",
    "html": "YOUR_HTML_HERE"
  }'
```

## Resources

- [Mailtrap Documentation](https://help.mailtrap.io/)
- [Email Client Testing Guide](https://mailtrap.io/blog/email-client-testing/)
- [HTML Email Best Practices](https://mailtrap.io/blog/how-to-test-email/)
