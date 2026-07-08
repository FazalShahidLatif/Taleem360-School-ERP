import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PRODUCT_CATALOG, REGIONAL_CONVERSION_RATES } from '../services/pricingService.ts';

function cleanFeatureText(features: string[]): string {
  return `"${features.join('; ')}"`;
}

async function run() {
  console.log('Generating product and pricing CSV files...');

  const usdCsvHeaders = 'Product ID,Product Name,Module Type,USD Price Per Month,USD Price Per Year,Max Students,Included Features\n';
  let usdCsvContent = usdCsvHeaders;

  const regionalCsvHeaders = 'Product ID,Product Name,Billing Cycle,Currency,Converted Price,Multiplier Rate (x1000)\n';
  let regionalCsvContent = regionalCsvHeaders;

  const products = Object.values(PRODUCT_CATALOG);

  for (const product of products) {
    const priceMoUSD = (product.usdPricePerMonth / 100).toFixed(2);
    const priceYrUSD = (product.usdPricePerYear !== undefined) 
      ? (product.usdPricePerYear / 100).toFixed(2) 
      : (product.usdPricePerMonth * 12 / 100).toFixed(2);

    const maxStudentsVal = product.maxStudents !== undefined ? String(product.maxStudents) : 'Unlimited';
    const featuresList = cleanFeatureText(product.features);

    // Append USD catalog entry
    usdCsvContent += `${product.id},${product.name},${product.moduleType},$${priceMoUSD},$${priceYrUSD},${maxStudentsVal},${featuresList}\n`;

    // Append regional pricing conversions (AED, PKR, USD)
    const cycles = ['monthly', 'yearly'] as const;
    const currencies = ['USD', 'AED', 'PKR'] as const;

    for (const cycle of cycles) {
      let usdCents = product.usdPricePerMonth;
      if (cycle === 'yearly') {
        usdCents = product.usdPricePerYear !== undefined ? product.usdPricePerYear : product.usdPricePerMonth * 12;
      }

      for (const cur of currencies) {
        const rate = REGIONAL_CONVERSION_RATES[cur] || 1000;
        const convertedAmountCents = Math.round((usdCents * rate) / 1000);
        const amountDecimal = (convertedAmountCents / 100).toFixed(2);

        regionalCsvContent += `${product.id},${product.name},${cycle},${cur},${amountDecimal},${rate}\n`;
      }
    }
  }

  const readmeContent = `Taleem360 Product and Pricing Catalog Export
=============================================
Exported Date: ${new Date().toISOString().split('T')[0]}
Version: 1.0.0

Included Files:
1. products_usd_pricing.csv       - Master USD pricing tier configurations, maximum student capacities, and features list.
2. products_regional_pricing.csv  - Converted local currency pricing ledger for United Arab Emirates (AED) and Pakistan (PKR).

Exchange Multipliers Reference (with integer-safe precision / scale 1000):
- USD: 1.00 (rate scaling: 1000)
- AED: 3.673 (rate scaling: 3673)
- PKR: 278.50 (rate scaling: 278500)

Processed and compiled securely inside the Taleem360 ERP Ecosystem.
`;

  // Create temporary workspace directory
  const tempDir = path.resolve(process.cwd(), 'scripts', 'temp_export');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const usdCsvPath = path.join(tempDir, 'products_usd_pricing.csv');
  const regionalCsvPath = path.join(tempDir, 'products_regional_pricing.csv');
  const readmePath = path.join(tempDir, 'README_pricing.txt');

  fs.writeFileSync(usdCsvPath, usdCsvContent, 'utf8');
  fs.writeFileSync(regionalCsvPath, regionalCsvContent, 'utf8');
  fs.writeFileSync(readmePath, readmeContent, 'utf8');

  const zipPath = path.resolve(process.cwd(), 'public', 'taleem360_pricing.zip');
  
  console.log(`CSV files generated at: ${tempDir}`);
  console.log('Packaging files into a zip archive...');

  try {
    // Try using Python's built-in zipfile library (available on almost all systems including light linux containers)
    const pythonCode = `
import zipfile, os
zip_path = "${zipPath.replace(/\\/g, '\\\\')}"
src_dir = "${tempDir.replace(/\\/g, '\\\\')}"
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
    for file in os.listdir(src_dir):
        zip_file.write(os.path.join(src_dir, file), file)
print("Zip archive written successfully.")
`;
    fs.writeFileSync(path.join(tempDir, 'zip_script.py'), pythonCode, 'utf8');
    execSync('python3 zip_script.py', { cwd: tempDir, stdio: 'inherit' });
    console.log(`Zip archive compiled successfully at: ${zipPath}`);
  } catch (err) {
    console.warn('Python zip packaging failed. Attempting native shell zip command...');
    try {
      execSync(`zip -j "${zipPath}" "${usdCsvPath}" "${regionalCsvPath}" "${readmePath}"`, { stdio: 'inherit' });
      console.log(`Zip archive compiled successfully via shell zip at: ${zipPath}`);
    } catch (shellErr) {
      console.error('Failed to create ZIP file via zip command as well:', shellErr);
      throw new Error('Could not package ZIP archive. Please ensure python3 or zip utilities are installed.');
    }
  }

  // Cleanup temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Temporary folder cleaned up.');
  } catch (cleanErr) {
    console.warn('Could not clean temporary folder:', cleanErr);
  }
}

run().catch((err) => {
  console.error('Pricing Export Error:', err);
  process.exit(1);
});
