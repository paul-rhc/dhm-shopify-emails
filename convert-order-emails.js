#!/usr/bin/env node

/**
 * Convert order status emails from Original Email folder to new template system
 * These use footer-short since they're just status updates
 */

const fs = require('fs');
const path = require('path');

const ORIGINALS_DIR = path.join(__dirname, 'Original Email');
const TEMPLATES_DIR = path.join(__dirname, 'src/templates');

// Ensure templates directory exists
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Extract the main content from a Shopify email template
 */
function extractContent(html) {
  // Find content section (between header and footer)
  const contentMatch = html.match(/<table class="row content">(.*?)<\/table>\s*<table class="row footer">/s);

  if (!contentMatch) {
    console.log('⚠️  Could not find content section, trying alternative pattern');
    // Try alternative pattern
    const altMatch = html.match(/<table class="header row">.*?<\/table>(.*?)<table class="row footer">/s);
    return altMatch ? altMatch[1].trim() : '';
  }

  // Extract just the inner content
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
 * Convert a single order email
 */
function convertEmail(filename) {
  const sourcePath = path.join(ORIGINALS_DIR, filename);
  const templateName = filename.replace(/\.html$/, '').replace(/_/g, '-').toLowerCase();
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

  console.log(`  ✅ Created: src/templates/${templateName}.html`);
  return true;
}

/**
 * Convert all Order_ emails
 */
function convertAll() {
  console.log('🔄 Converting order status emails to new template system\n');

  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`❌ Error: Original emails directory not found: ${ORIGINALS_DIR}`);
    process.exit(1);
  }

  // Find all Order_*.html files (capitalized)
  const files = fs.readdirSync(ORIGINALS_DIR)
    .filter(file => file.startsWith('Order_') && file.endsWith('.html'));

  if (files.length === 0) {
    console.log('⚠️  No Order_*.html files found');
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
  console.log('  2. Review templates in dist/');
  console.log('  3. Test with: npm run test-email -- dist/order-*.html');
}

// Run conversion
convertAll();
