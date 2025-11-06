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

// Replace Shopify Liquid variables with sample data for testing
const sampleData = {
  '{{shop.email_logo_url}}': 'https://via.placeholder.com/240x80/e7fed0/4a693d?text=DHM+Logo',
  '{{shop.url}}': 'https://directhomemedical.com',
  '{{shop.domain}}': 'directhomemedical.com',
  '{{shop.email}}': 'support@directhomemedical.com',
  '{{email_title}}': 'Test Email - DirectHomeMedical',
  '{{preview_text}}': 'Testing email template in Mailtrap',
  '{{email_type}}': 'test',
  "{{ 'now' | date: '%Y' }}": new Date().getFullYear().toString(),
};

Object.entries(sampleData).forEach(([variable, value]) => {
  htmlContent = htmlContent.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
});

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
