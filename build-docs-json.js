#!/usr/bin/env node
/**
 * Build a comprehensive JSON file with all documentation for AI assistants
 * This avoids GitHub Pages authentication issues with raw .md files
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs/docs/markdown');
const OUTPUT_FILE = path.join(__dirname, 'docs/docs/api-docs.json');
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown';

// Parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const [, frontmatter, body] = match;
  const metadata = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { metadata, content: body };
}

// Recursively find all .md files
function findMarkdownFiles(dir, baseDir = dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(filePath, baseDir));
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(baseDir, filePath);
      results.push({ path: relativePath, fullPath: filePath });
    }
  }

  return results;
}

// Build documentation index
function buildDocsIndex() {
  const files = findMarkdownFiles(DOCS_DIR);
  const docs = {};

  files.forEach(({ path: relativePath, fullPath }) => {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { metadata, content: body } = parseFrontmatter(content);

    // Category from directory structure
    const parts = relativePath.split(path.sep);
    const category = parts.length > 1 ? parts[0] : 'general';
    const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

    if (!docs[category]) {
      docs[category] = [];
    }

    docs[category].push({
      slug,
      title: metadata.title || path.basename(relativePath, '.md'),
      description: metadata.description || '',
      path: relativePath.replace(/\\/g, '/'),
      githubRawUrl: `${GITHUB_RAW_BASE}/${relativePath.replace(/\\/g, '/')}`,
      content: body.trim()
    });
  });

  return docs;
}

// Main
try {
  console.log('Building documentation JSON...');
  const docs = buildDocsIndex();

  const output = {
    version: '0.1.3',
    generated: new Date().toISOString(),
    repository: 'https://github.com/Mode7Labs/zap',
    description: 'Complete Zap game engine documentation for AI assistants',
    categories: docs
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const totalDocs = Object.values(docs).reduce((sum, cat) => sum + cat.length, 0);
  console.log(`✓ Built ${totalDocs} documentation files`);
  console.log(`✓ Saved to ${OUTPUT_FILE}`);

  // Print summary
  console.log('\nCategories:');
  Object.entries(docs).forEach(([category, items]) => {
    console.log(`  ${category}: ${items.length} docs`);
  });

} catch (error) {
  console.error('Error building docs:', error);
  process.exit(1);
}
