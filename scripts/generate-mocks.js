import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGE_PATH = path.join(__dirname, '../pages/free-resources.tsx');
const PUBLIC_RESOURCES_DIR = path.join(__dirname, '../public/resources/packs');

console.log('🔨 Starting Mock PDF Generation for Taleem360...');

// Ensure the target packs directory exists
if (!fs.existsSync(PUBLIC_RESOURCES_DIR)) {
  fs.mkdirSync(PUBLIC_RESOURCES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${PUBLIC_RESOURCES_DIR}`);
}

if (!fs.existsSync(PAGE_PATH)) {
  console.error(`❌ Error: Could not find page file at ${PAGE_PATH}`);
  process.exit(1);
}

// Read pages/free-resources.tsx
const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');

// Regex patterns to find referenced PDF paths inside code strings
const pdfRegex = /\/resources\/packs\/[a-zA-Z0-9_-]+\.pdf/g;
const referencedPdfs = [...new Set(pageContent.match(pdfRegex))];

if (!referencedPdfs || referencedPdfs.length === 0) {
  console.warn('⚠️ No PDF resource links were found in free-resources.tsx.');
  process.exit(0);
}

console.log(`📋 Found ${referencedPdfs.length} unique PDF configurations. Generating missing assets...`);

// Minimal valid PDF content with some padding to ensure realistic size (~100KB - 1MB)
function generateMockPdfBuffer(filename) {
  const basePdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 595 842] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
100 700 Td
(Taleem360 Mock PDF) Tj
/F1 14 Tf
100 650 Td
(File: ${filename}) Tj
/F1 10 Tf
100 600 Td
(This is an automatically generated mock asset for testing purposes.) Tj
ET
endstream
endobj
`;
  
  // Pad the PDF with a huge comment so it has a realistic weight (e.g., 1.5 Megabytes)
  const targetSizeInBytes = 1.5 * 1024 * 1024; // 1.5MB
  const currentLen = basePdf.length;
  const paddingNeeded = Math.max(0, targetSizeInBytes - currentLen - 50);
  
  let padding = '\n%';
  if (paddingNeeded > 0) {
    // Generate a long dummy comment block
    padding += 'x'.repeat(paddingNeeded);
  }
  
  const footerPdf = `\nxref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000212 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
500
%%EOF
`;

  return Buffer.from(basePdf + padding + footerPdf);
}

let generatedCount = 0;
let existingCount = 0;

referencedPdfs.forEach((relativePath) => {
  const localFileName = relativePath.replace('/resources/packs/', '');
  const absoluteFilePath = path.join(PUBLIC_RESOURCES_DIR, localFileName);

  if (fs.existsSync(absoluteFilePath)) {
    const stats = fs.statSync(absoluteFilePath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ [EXISTS] ${localFileName} (${sizeMb} MB)`);
    existingCount++;
  } else {
    // Generate mock PDF
    const buffer = generateMockPdfBuffer(localFileName);
    fs.writeFileSync(absoluteFilePath, buffer);
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
    console.log(`🆕 [GENERATED] ${localFileName} (${sizeMb} MB)`);
    generatedCount++;
  }
});

console.log(`\n🎉 Mock Generation Complete:`);
console.log(`   - Existing files: ${existingCount}`);
console.log(`   - Generated files: ${generatedCount}`);
process.exit(0);
