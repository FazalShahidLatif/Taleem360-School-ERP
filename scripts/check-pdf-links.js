const fs = require('fs');
const path = require('path');

// 1. Define paths to check against your Vercel project structure
const PAGE_PATH = path.join(__dirname, '../pages/free-resources.tsx');
const PUBLIC_RESOURCES_DIR = path.join(__dirname, '../public/resources/packs');

console.log('🔍 Starting Taleem360 Free Resource Asset Auditing...');

// 2. Read the frontend file to extract defined asset paths
if (!fs.existsSync(PAGE_PATH)) {
  console.error(`❌ Error: Could not locate free-resources.tsx at ${PAGE_PATH}`);
  process.exit(1);
}

const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');

// Regex patterns to find referenced PDF paths inside your code strings
const pdfRegex = /\/resources\/packs\/[a-zA-Z0-9_-]+\.pdf/g;
const referencedPdfs = [...new Set(pageContent.match(pdfRegex))];

if (!referencedPdfs || referencedPdfs.length === 0) {
  console.warn('⚠️ Warning: No PDF resource links were parsed from free-resources.tsx.');
  process.exit(0);
}

console.log(`📋 Found ${referencedPdfs.length} unique PDF configurations in code. Validating paths...`);

let brokenLinksCount = 0;

// 3. Scan the public directory to verify each file exists
referencedPdfs.forEach((relativePath) => {
  // Translate the URL path back to the actual local system path
  const localFileName = relativePath.replace('/resources/packs/', '');
  const absoluteFilePath = path.join(PUBLIC_RESOURCES_DIR, localFileName);

  if (fs.existsSync(absoluteFilePath)) {
    const stats = fs.statSync(absoluteFilePath);
    const fileSizeInMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ [VALID] ${localFileName} (${fileSizeInMb} MB)`);
  } else {
    console.error(`❌ [BROKEN LINK] File missing: ${localFileName}`);
    console.error(`   -> Expected location: ${absoluteFilePath}`);
    brokenLinksCount++;
  }
});

// 4. Report final testing parameters
console.log('\n📊 Asset Audit Summary:');
if (brokenLinksCount === 0) {
  console.log('🚀 Success! All asset configurations match files in public directory.');
  process.exit(0);
} else {
  console.error(`🚨 Failure: ${brokenLinksCount} configuration mismatches found. Please fix before deployment.`);
  process.exit(1);
}
