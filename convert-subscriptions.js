#!/usr/bin/env node

/**
 * Convert subscription emails from Original Email folder to new template system
 * This script extracts the content from Shopify default templates and wraps
 * them in our new partial-based structure
 */

const fs = require('fs');
const path = require('path');

const ORIGINALS_DIR = path.join(__dirname, 'Original Email/subscriptions');
const TEMPLATES_DIR = path.join(__dirname, 'src/templates/subscriptions');

// Ensure templates directory exists
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Extract the main content from a Shopify email template
 * Looks for content between header and footer sections
 */
function extractContent(html) {
  // Find content section (between header and footer)
  const contentMatch = html.match(/<table class="row content">(.*?)<\/table>\s*<table class="row footer">/s);

  if (!contentMatch) {
    console.log('⚠️  Could not find content section, extracting body');
    // Fallback: extract everything between header and footer
    const bodyMatch = html.match(/<table class="header row">.*?<\/table>(.*?)<table class="row footer">/s);
    return bodyMatch ? bodyMatch[1].trim() : '';
  }

  // Extract just the inner content (skip the outer table wrapper)
  const innerContent = contentMatch[1];
  const tdMatch = innerContent.match(/<td>(.*?)<\/td>/s);

  return tdMatch ? tdMatch[1].trim() : innerContent.trim();
}

/**
 * Wrap extracted content in our new template structure
 */
function wrapInTemplate(content) {
  return `{{> head }}
                      {{> header }}
                      {{> container-open }}

                      <!-- BEGIN: MAIN CONTENT -->
                      <table
                        class="sections_container"
                        border="0"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        align="center"
                        style="min-width: 100%; direction: ltr"
                        role="presentation"
                      >
                        <tr>
                          <th
                            class="section_border"
                            style="mso-line-height-rule: exactly; padding: 45px 30px"
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              align="center"
                              style="min-width: 100%; direction: ltr"
                              role="presentation"
                            >
                              <tr>
                                <th
                                  class="section_content"
                                  style="
                                    mso-line-height-rule: exactly;
                                    direction: ltr;
                                    font-family: Verdana, sans-serif, 'Montserrat';
                                    font-size: 18px;
                                    line-height: 28px;
                                    font-weight: 400;
                                    color: #333333;
                                    padding: 8px 30px;
                                  "
                                  align="left"
                                >
${content}
                                </th>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                      <!-- END: MAIN CONTENT -->

                      {{> container-close }}
                      {{> footer-short }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>
    <!-- END: CONTAINER -->
{{> body-close }}
`;
}

/**
 * Convert a single subscription email
 */
function convertEmail(filename) {
  const sourcePath = path.join(ORIGINALS_DIR, filename);
  const templateName = filename.replace(/\.html$/, '').replace(/_/g, '-');
  const destPath = path.join(TEMPLATES_DIR, `${templateName}.html`);

  console.log(`📧 Converting: ${filename}`);

  // Read original
  const originalHtml = fs.readFileSync(sourcePath, 'utf8');

  // Extract content
  const content = extractContent(originalHtml);

  if (!content) {
    console.log(`  ⚠️  Warning: No content extracted from ${filename}`);
    return false;
  }

  // Wrap in template
  const newTemplate = wrapInTemplate(content);

  // Write new template
  fs.writeFileSync(destPath, newTemplate, 'utf8');

  console.log(`  ✅ Created: src/templates/subscriptions/${templateName}.html`);
  return true;
}

/**
 * Convert all subscription emails
 */
function convertAll() {
  console.log('🔄 Converting subscription emails to new template system\n');

  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`❌ Error: Original emails directory not found: ${ORIGINALS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ORIGINALS_DIR)
    .filter(file => file.endsWith('.html'));

  if (files.length === 0) {
    console.log('⚠️  No subscription email files found');
    return;
  }

  let successCount = 0;
  files.forEach(file => {
    if (convertEmail(file)) {
      successCount++;
    }
  });

  console.log(`\n✨ Conversion complete! ${successCount}/${files.length} templates converted.`);
  console.log('\n📝 Next steps:');
  console.log('  1. Run: npm run build');
  console.log('  2. Review templates in dist/subscriptions/');
  console.log('  3. Test with: npm run test-email -- dist/subscriptions/subscription-*.html');
}

// Run conversion
convertAll();
