#!/usr/bin/env node

/**
 * Test script to send email templates to Mailtrap for preview
 *
 * Usage:
 *   node test-mailtrap.js <template-file.html>
 *   npm run test-email -- dist/test-email.html
 *
 * Setup:
 *   1. Create .env file with your Mailtrap credentials:
 *      MAILTRAP_HOST=sandbox.smtp.mailtrap.io
 *      MAILTRAP_PORT=2525
 *      MAILTRAP_USER=your_username
 *      MAILTRAP_PASS=your_password
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load environment variables from .env file if it exists
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

// Get template file from command line arguments
const templateFile = process.argv[2];

if (!templateFile) {
  console.error('❌ Error: Please provide a template file path');
  console.log('\nUsage:');
  console.log('  node test-mailtrap.js <path-to-template.html>');
  console.log('\nExample:');
  console.log('  node test-mailtrap.js dist/test-email.html');
  console.log('  npm run test-email -- dist/test-email.html');
  process.exit(1);
}

// Check if template file exists
if (!fs.existsSync(templateFile)) {
  console.error(`❌ Error: Template file not found: ${templateFile}`);
  process.exit(1);
}

// Check for Mailtrap credentials
const config = {
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.MAILTRAP_PORT || '2525'),
  user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS,
};

if (!config.user || !config.pass) {
  console.error('❌ Error: Mailtrap credentials not found');
  console.log('\nPlease create a .env file with your Mailtrap credentials:');
  console.log('  MAILTRAP_HOST=sandbox.smtp.mailtrap.io');
  console.log('  MAILTRAP_PORT=2525');
  console.log('  MAILTRAP_USER=your_username');
  console.log('  MAILTRAP_PASS=your_password');
  console.log('\nYou can find these credentials at:');
  console.log('  https://mailtrap.io/inboxes → Select Inbox → Integrations → SMTP');
  process.exit(1);
}

// Read template
console.log(`📄 Reading template: ${templateFile}`);
let htmlContent = fs.readFileSync(templateFile, 'utf8');

// Load image URLs if available
let imageUrls = {};
const imageUrlsPath = path.join(__dirname, 'image_urls.json');
if (fs.existsSync(imageUrlsPath)) {
  imageUrls = JSON.parse(fs.readFileSync(imageUrlsPath, 'utf8'));
}

// Replace Shopify Liquid variables with sample data for testing
const sampleData = {
  '{{shop.email_logo_url}}': imageUrls.store_logo || 'https://cdn.shopify.com/s/files/1/0685/5740/6360/files/directhomemedical-logo-color.png?v=1758148022',
  '{{shop.url}}': 'https://directhomemedical.com',
  '{{shop.domain}}': 'directhomemedical.com',
  '{{shop.email}}': 'support@directhomemedical.com',
  '{{shop.country}}': 'United States',
  '{{email_title}}': 'Test Email - DirectHomeMedical',
  '{{email_body}}': 'Thank you for your subscription order! Your order has been confirmed.',
  '{{preview_text}}': 'Testing email template in Mailtrap',
  '{{email_type}}': 'test-email',
  '{{customer_url}}': 'https://directhomemedical.com/account/orders',
  "{{ 'now' | date: '%Y' }}": new Date().getFullYear().toString(),
  '{{ name }}': '#1234',
  '{{ created_at | date: "%B %d, %Y" }}': 'January 15, 2025',
  '{{ line_item.quantity }}': '1',
  '{{ original_item.title }}': 'CPAP Machine - DreamStation 2',
  '{{ line_title }}': 'CPAP Machine - DreamStation 2',
  '{{ original_item.variant.title }}': 'Standard Size',
  '{{ shipping_address.name }}': 'John Smith',
  '{{ shipping_address.address1 }}': '123 Main Street',
  '{{ shipping_address.city }}': 'Los Angeles',
  '{{ shipping_address.province_code }}': 'CA',
  '{{ shipping_address.province }}': 'California',
  '{{ shipping_address.zip | upcase }}': '90001',
  '{{ shipping_address.phone }}': '(555) 123-4567',
  '{{ billing_address.name }}': 'John Smith',
  '{{ billing_address.address1 }}': '123 Main Street',
  '{{ billing_address.city }}': 'Los Angeles',
  '{{ billing_address.province_code }}': 'CA',
  '{{ billing_address.province }}': 'California',
  '{{ billing_address.zip | upcase }}': '90001',
  '{{ billing_address.phone }}': '(555) 123-4567',
  '{{ original_item.image | image_url: width: 240, height: 240, crop: \'center\' }}': 'https://placehold.co/240x240/e7fed0/304535?text=CPAP+Machine',
  '{{ adjusted_line_price | money }}': '$299.99',
  '{{ original_item.final_line_price | divided_by: original_quantity | times: current_item.quantity | money }}': '$299.99',
  '{{ original_item.original_line_price | divided_by: original_quantity | times: current_item.quantity | money }}': '$399.99',
  '{{ original_item.variant.compare_at_price | times: current_item.quantity | money }}': '$399.99',
};

// Additional regex replacements for complex Liquid patterns
const complexReplacements = [
  // Handle image_url filter
  [/\{\{\s*original_item\.image\s*\|\s*image_url:[^}]+\}\}/g, 'https://placehold.co/240x240/e7fed0/304535?text=CPAP+Machine'],
  // Handle remaining money filters (after specific ones are replaced)
  [/\{\{\s*[^}]*\|\s*money\s*\}\}/g, '$0.00'],
  // Handle conditional prices
  [/\{\{-?\s*original_item\.[^}]+\}\}/g, ''],
  [/\{\{-?\s*adjusted_[^}]+\}\}/g, ''],
  [/\{\{-?\s*current_item\.[^}]+\}\}/g, ''],
  // Handle captured variables
  [/\{\{\s*line_title\s*\}\}/g, 'CPAP Machine - DreamStation 2'],
  // Clean up any remaining {{ }} that weren't matched
  [/\{\{[^}]*\}\}/g, ''],
];

// Remove {% capture %} blocks and replace with their content
htmlContent = htmlContent.replace(
  /\{%\s*capture\s+default_utms\s*%\}(.*?)\{%\s*endcapture\s*%\}/gs,
  ''
);
htmlContent = htmlContent.replace(
  /\{%\s*capture\s+question_mark\s*%\}\?\{%\s*endcapture\s*%\}/gs,
  ''
);

// Replace references to captured variables
htmlContent = htmlContent.replace(/\{\{default_utms\}\}/g, 'utm_campaign=test-email&utm_medium=email&utm_source=OrderlyEmails');
htmlContent = htmlContent.replace(/\{\{question_mark\}\}/g, '?');

// Remove other {% capture %} blocks
htmlContent = htmlContent.replace(/\{%\s*capture\s+\w+\s*%\}.*?\{%\s*endcapture\s*%\}/gs, '');

// Handle {% case %} blocks - keep first when option
let caseRegex = /\{%\s*case\s+[^%]+%\}([\s\S]*?)\{%\s*endcase\s*%\}/g;
htmlContent = htmlContent.replace(caseRegex, function(match, content) {
  const whenMatch = content.match(/\{%\s*when\s+[^%]+%\}([\s\S]*?)(?:\{%\s*when\s+|$)/);
  return whenMatch ? whenMatch[1].trim() : '';
});

// Process Liquid conditionals iteratively to handle nesting
let maxIterations = 50;  // Increased to handle more conditionals
let iteration = 0;
while (iteration < maxIterations && /\{%\s*if\s+/.test(htmlContent)) {
  let beforeReplace = htmlContent;

  // Handle {% if %} with {% elsif %} and {% else %}
  htmlContent = htmlContent.replace(
    /\{%-?\s*if\s+([^%]+)%\}([\s\S]*?)\{%-?\s*endif\s*-?%\}/,
    function(match, condition, content) {
      // Determine if condition should be true or false based on what we're testing
      const conditionStr = condition.trim();

      // Conditions that should be FALSE (remove content including br tags)
      const falseConditions = [
        'original_item.product.metafields.custom.dhm_promos_risk_free_trial',
        'original_item.product.metafields.custom.dhm_promos_warranty',
        'custom.dhm_general_hcpcs_code',
        'original_item.selling_plan_allocation',
        'original_item.refunded_quantity',
        'line_item.variant.unit_price_measurement',
        'shipping_address.company',
        'shipping_address.address2',
        'shipping_address.country != shop.country',
        'billing_address.company',
        'billing_address.address2',
        'billing_address.country != shop.country',
        'p.first contains "preview"',
        'p.last contains "/uploads/"',
        'p.last contains "//uploadery.s3"',
        'original_item.variant.compare_at_price != blank'
      ];

      // Check if this is a false condition
      if (falseConditions.some(fc => conditionStr.includes(fc))) {
        // Remove the entire block for false conditions, including trailing newline if present
        return '';
      }

      // Special handling for pricing conditionals - show sale price (first branch)
      if (conditionStr.includes('original_item.original_line_price != original_item.final_line_price')) {
        // Keep the content before any elsif/else (this is the sale price branch)
        const beforeElse = content.split(/\{%-?\s*(?:elsif|else)/)[0];
        const trimmed = beforeElse.replace(/^\s+|\s+$/g, '');
        return trimmed;
      }

      // For other true conditions, keep the content before any elsif/else
      const beforeElse = content.split(/\{%-?\s*(?:elsif|else)/)[0];
      // If the match started with {%-, preserve that whitespace stripping behavior
      const trimmed = beforeElse.replace(/^\s+|\s+$/g, '');
      return trimmed;
    }
  );

  // Break if no changes were made (prevents infinite loop)
  if (beforeReplace === htmlContent) {
    break;
  }

  iteration++;
}

// Remove {% unless %} blocks
htmlContent = htmlContent.replace(/\{%\s*unless\s+[^%]+%\}[\s\S]*?\{%\s*endunless\s*%\}/gs, '');

// Handle {% for %} loops - render once with sample data
htmlContent = htmlContent.replace(/\{%\s*for\s+line_item\s+in\s+line_items\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, function(_, content) {
  // Render the loop content once with sample data
  return content;
});

// Handle other {% for %} loops - just keep content once
htmlContent = htmlContent.replace(/\{%\s*for\s+[^%]+%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, function(_, content) {
  return content;
});

// Clean up {% assign %} statements
htmlContent = htmlContent.replace(/\{%-?\s*assign\s+[^%]+%\}/g, '');

// Clean up {% continue %} statements
htmlContent = htmlContent.replace(/\{%\s*continue\s*%\}/g, '');

// Clean up any remaining Liquid control tags (multiple passes to catch orphaned tags)
for (let i = 0; i < 3; i++) {
  htmlContent = htmlContent.replace(/\{%\s*if\s+[^%]+%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*elsif\s+[^%]+%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*else\s*%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*endif\s*%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*endcase\s*%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*when\s+[^%]+%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*endunless\s*%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*for\s+[^%]+%\}/g, '');
  htmlContent = htmlContent.replace(/\{%\s*endfor\s*%\}/g, '');
  htmlContent = htmlContent.replace(/\{%-/g, '{%');
  htmlContent = htmlContent.replace(/-%\}/g, '%}');
}

// Replace simple Liquid variables
Object.entries(sampleData).forEach(([variable, value]) => {
  htmlContent = htmlContent.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
});

// Apply complex replacements
complexReplacements.forEach(([pattern, replacement]) => {
  htmlContent = htmlContent.replace(pattern, replacement);
});

// Clean up excessive whitespace and line breaks
// Remove empty lines (multiple newlines with only whitespace between)
htmlContent = htmlContent.replace(/\n\s*\n\s*\n/g, '\n\n');
// Remove lines that only contain whitespace between br tags and next content
htmlContent = htmlContent.replace(/(<br\s*\/?>)\s*\n\s*\n/gi, '$1\n');
// Remove whitespace-only lines
htmlContent = htmlContent.replace(/\n\s*\n/g, '\n');

// Extract subject from HTML or use default
const titleMatch = htmlContent.match(/<!--\s*(.+?)\s*-->/);
const subject = titleMatch ? titleMatch[1] : path.basename(templateFile, '.html');

console.log(`📧 Subject: ${subject}`);
console.log('🔄 Sending to Mailtrap...\n');

// Create transporter with nodemailer fallback
let transporter;

try {
  // Try to use nodemailer if available
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  // Send email
  transporter.sendMail({
    from: '"DirectHomeMedical" <noreply@directhomemedical.com>',
    to: 'test@example.com',
    subject: subject,
    html: htmlContent,
  }, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error.message);
      process.exit(1);
    }
    console.log('✅ Email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log('\n🎉 Check your Mailtrap inbox at: https://mailtrap.io/inboxes');
  });

} catch (error) {
  // If nodemailer is not available, provide instructions
  console.log('⚠️  nodemailer is not installed. To send emails automatically, run:');
  console.log('    npm install nodemailer');
  console.log('\n📋 Or manually copy and paste into Mailtrap:');
  console.log('─'.repeat(60));
  console.log('Subject:', subject);
  console.log('─'.repeat(60));
  console.log('\n💡 Tip: You can also upload the HTML file directly in Mailtrap.');
}
