import axios, { AxiosError } from 'axios';
import { PRODUCT_CATALOG } from '../services/pricingService.ts';

// Configure console colors for premium visual report
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

async function syncCreemProducts() {
  console.log(`\n${colors.cyan}${colors.bright}=====================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}   Taleem360 - Creem Pay Product Catalog Synchronizer  ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}=====================================================${colors.reset}\n`);

  const apiKey = process.env.CREEM_API_KEY;
  const apiUrl = process.env.CREEM_API_URL || 'https://api.creem.io/v1';

  let isDryRun = false;
  if (!apiKey) {
    console.warn(`${colors.yellow}${colors.bright}⚠️  Warning: CREEM_API_KEY environment variable is not configured.${colors.reset}`);
    console.warn(`${colors.yellow}Running in DRY-RUN / DEMO simulation mode. Set CREEM_API_KEY to synchronize live data.${colors.reset}\n`);
    isDryRun = true;
  } else {
    const isTestKey = apiKey.startsWith('test_') || apiKey.includes('test');
    console.log(`${colors.green}✅ Authentication detected! Mode: ${colors.bright}${isTestKey ? 'TEST / SANDBOX' : 'LIVE / PRODUCTION'}${colors.reset}`);
    console.log(`${colors.dim}Target Endpoint: ${apiUrl}${colors.reset}\n`);
  }

  // 1. Fetch existing Creem products (to check if we should create or update)
  let existingProducts: Record<string, any> = {};
  if (!isDryRun && apiKey) {
    try {
      console.log(`${colors.blue}🔄 Fetching existing products from Creem Pay API...${colors.reset}`);
      const response = await axios.get(`${apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      const productsList = response.data?.data || response.data || [];
      if (Array.isArray(productsList)) {
        for (const prod of productsList) {
          if (prod.id) {
            existingProducts[prod.id] = prod;
          }
        }
        console.log(`${colors.green}Found ${Object.keys(existingProducts).length} existing products in Creem.${colors.reset}\n`);
      }
    } catch (error) {
      const axiosErr = error as AxiosError;
      console.warn(`${colors.yellow}⚠️  Failed to fetch existing products (${axiosErr.message}). Assuming clean catalog sync...${colors.reset}\n`);
    }
  }

  // 2. Map and process products from our central PRODUCT_CATALOG
  const productEntries = Object.values(PRODUCT_CATALOG).filter(p => p.usdPricePerMonth > 0);
  const syncResults = {
    created: 0,
    updated: 0,
    simulated: 0,
    failed: 0,
  };

  for (const tier of productEntries) {
    // Generate both Monthly and Yearly options
    const billingCycles: Array<{ suffix: string; price: number; cycleLabel: string }> = [
      { suffix: 'MONTHLY', price: tier.usdPricePerMonth, cycleLabel: 'monthly' },
    ];

    if (tier.usdPricePerYear !== undefined && tier.usdPricePerYear > 0) {
      billingCycles.push({ suffix: 'YEARLY', price: tier.usdPricePerYear, cycleLabel: 'yearly' });
    }

    for (const cycle of billingCycles) {
      const creemProductId = `${tier.id}_${cycle.suffix}`;
      const productName = `${tier.name} (${cycle.suffix === 'MONTHLY' ? 'Monthly' : 'Yearly'})`;
      const description = `Subscription license for ${tier.name}. Maximum students: ${tier.maxStudents || 'unlimited'}. Included features: ${tier.features.slice(0, 3).join(', ')}...`;

      const requestPayload = {
        id: creemProductId,
        productId: creemProductId, // supporting dual key mapping
        name: productName,
        description: description,
        price: cycle.price, // cents
        currency: 'USD',
        billingCycle: cycle.cycleLabel,
        metadata: {
          platform: 'Taleem360',
          moduleType: tier.moduleType,
          maxStudents: String(tier.maxStudents || 'unlimited'),
          billingCycle: cycle.cycleLabel,
          originalProductId: tier.id,
        },
      };

      console.log(`${colors.blue}📦 Processing product ${colors.bright}${creemProductId}${colors.reset}...`);
      console.log(`${colors.dim}   Price: $${(cycle.price / 100).toFixed(2)} USD | Category: ${tier.moduleType}${colors.reset}`);

      if (isDryRun) {
        console.log(`${colors.yellow}   [DRY-RUN] Simulated creation of ${productName} with ID: ${creemProductId}${colors.reset}\n`);
        syncResults.simulated++;
      } else {
        const productExists = existingProducts[creemProductId] !== undefined;

        try {
          if (productExists) {
            console.log(`${colors.cyan}   🔄 Product exists. Triggering update (PATCH/PUT)...${colors.reset}`);
            // Creem standard updates
            await axios.put(`${apiUrl}/products/${creemProductId}`, requestPayload, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            });
            console.log(`${colors.green}   ✅ Successfully updated: ${productName}${colors.reset}\n`);
            syncResults.updated++;
          } else {
            console.log(`${colors.cyan}   🆕 Creating new product registry...${colors.reset}`);
            await axios.post(`${apiUrl}/products`, requestPayload, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            });
            console.log(`${colors.green}   ✅ Successfully registered: ${productName}${colors.reset}\n`);
            syncResults.created++;
          }
        } catch (error) {
          const axiosErr = error as AxiosError;
          const errorDetails = axiosErr.response?.data ? JSON.stringify(axiosErr.response.data) : axiosErr.message;
          console.error(`${colors.red}   ❌ Sync error for product ${creemProductId}: ${errorDetails}${colors.reset}\n`);
          syncResults.failed++;
        }
      }
    }
  }

  // 3. Output beautiful report
  console.log(`${colors.cyan}${colors.bright}=====================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}                SYNCHRONIZATION REPORT               ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}=====================================================${colors.reset}`);
  console.log(`${colors.green}   Products Created: ${colors.bright}${syncResults.created}${colors.reset}`);
  console.log(`${colors.cyan}   Products Updated: ${colors.bright}${syncResults.updated}${colors.reset}`);
  console.log(`${colors.yellow}   Simulated Runs  : ${colors.bright}${syncResults.simulated}${colors.reset}`);
  if (syncResults.failed > 0) {
    console.log(`${colors.red}   Sync Failures   : ${colors.bright}${syncResults.failed}${colors.reset}`);
  }
  console.log(`${colors.cyan}${colors.bright}=====================================================${colors.reset}\n`);

  if (isDryRun) {
    console.log(`${colors.yellow}💡 To run this live against Creem servers:${colors.reset}`);
    console.log(`   1. Set CREEM_API_KEY environment variable in your sandbox or live console.`);
    console.log(`   2. Execute: ${colors.bright}npm run sync-products${colors.reset}\n`);
  } else {
    console.log(`${colors.green}🎉 Synchronization completed successfully! Products are active on Creem portal.${colors.reset}\n`);
  }
}

syncCreemProducts().catch((err) => {
  console.error('\x1b[31mCritical script failure:\x1b[0m', err);
  process.exit(1);
});
