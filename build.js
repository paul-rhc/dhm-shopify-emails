#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Cache for loaded partials
const partialsCache = {};

/**
 * Load a partial file from the partials directory
 * @param {string} partialName - Name of the partial (without .html extension)
 * @returns {string} Content of the partial
 */
function loadPartial(partialName) {
  if (partialsCache[partialName]) {
    return partialsCache[partialName];
  }

  const partialPath = path.join(PARTIALS_DIR, `${partialName}.html`);

  if (!fs.existsSync(partialPath)) {
    console.error(`❌ Partial not found: ${partialName}.html`);
    return `<!-- PARTIAL NOT FOUND: ${partialName} -->`;
  }

  const content = fs.readFileSync(partialPath, 'utf8');
  partialsCache[partialName] = content;
  return content;
}

/**
 * Process a template and resolve all partial includes
 * Supports syntax: {{> partial-name }}
 * @param {string} content - Template content
 * @returns {string} Processed content with partials included
 */
function processTemplate(content) {
  // Match {{> partial-name }} patterns
  const partialRegex = /\{\{>\s*([a-zA-Z0-9_\-\/]+)\s*\}\}/g;

  let processed = content;
  let match;

  while ((match = partialRegex.exec(content)) !== null) {
    const partialName = match[1];
    const partialContent = loadPartial(partialName);

    // Replace the include tag with the partial content
    processed = processed.replace(match[0], partialContent);
  }

  return processed;
}

/**
 * Build a single template file
 * @param {string} templateFile - Name of the template file
 */
function buildTemplate(templateFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const outputFileName = templateFile.replace(/\.html$/, '.html');
  const outputPath = path.join(DIST_DIR, outputFileName);

  console.log(`📄 Building: ${templateFile}`);

  // Read template
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Process includes
  const processed = processTemplate(templateContent);

  // Write output
  fs.writeFileSync(outputPath, processed, 'utf8');

  console.log(`✅ Built: dist/${outputFileName}`);
}

/**
 * Build all templates in the templates directory
 */
function buildAll() {
  console.log('🚀 Starting build process...\n');

  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error(`❌ Templates directory not found: ${TEMPLATES_DIR}`);
    process.exit(1);
  }

  const templateFiles = fs.readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith('.html'));

  if (templateFiles.length === 0) {
    console.log('⚠️  No template files found in src/templates/');
    return;
  }

  templateFiles.forEach(buildTemplate);

  console.log(`\n✨ Build complete! ${templateFiles.length} template(s) built.`);
}

// Run build
buildAll();
