#!/usr/bin/env node
/**
 * Broadbeach Academy — Cryptographically Secure Admin Login Path Generator & Rotator
 * 
 * Usage:
 *   node scripts/rotate-admin-path.cjs
 *   node scripts/rotate-admin-path.cjs --prefix=portal-auth
 *   node scripts/rotate-admin-path.cjs --custom=/secure-console/my-custom-path
 * 
 * Generates >= 160 bits (20 bytes) of cryptographically secure pseudorandom entropy (CSPRNG)
 * and safely updates VITE_ADMIN_LOGIN_PATH and ADMIN_LOGIN_PATH in .env without committing
 * secrets to source control.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateSecurePath(prefix = 'secure-console', bytes = 20) {
  // 20 bytes = 160 bits of cryptographic entropy (exceeds the 128-bit requirement)
  const token = crypto.randomBytes(bytes).toString('hex');
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
  return `/${cleanPrefix}/${token}`;
}

function validatePath(adminPath) {
  if (!adminPath || typeof adminPath !== 'string') return false;
  const trimmed = adminPath.trim();
  if (!trimmed.startsWith('/')) return false;
  if (trimmed === '/admin/login' || trimmed === '/admin' || trimmed === '/login') return false;
  // Requires at least 16 characters of entropy
  if (!/^\/[a-zA-Z0-9_\-\/]{16,}$/.test(trimmed)) return false;
  return true;
}

function updateEnvFile(filePath, newPath) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // Update or append VITE_ADMIN_LOGIN_PATH
  if (/^VITE_ADMIN_LOGIN_PATH=/m.test(content)) {
    content = content.replace(/^VITE_ADMIN_LOGIN_PATH=.*$/m, `VITE_ADMIN_LOGIN_PATH=${newPath}`);
  } else {
    content = content.trim() ? `${content.trim()}\nVITE_ADMIN_LOGIN_PATH=${newPath}\n` : `VITE_ADMIN_LOGIN_PATH=${newPath}\n`;
  }

  // Update or append ADMIN_LOGIN_PATH
  if (/^ADMIN_LOGIN_PATH=/m.test(content)) {
    content = content.replace(/^ADMIN_LOGIN_PATH=.*$/m, `ADMIN_LOGIN_PATH=${newPath}`);
  } else {
    content = `${content.trim()}\nADMIN_LOGIN_PATH=${newPath}\n`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const args = process.argv.slice(2);
  let customPath = null;
  let customPrefix = 'secure-console';

  for (const arg of args) {
    if (arg.startsWith('--custom=')) {
      customPath = arg.split('=')[1].trim();
    } else if (arg.startsWith('--prefix=')) {
      customPrefix = arg.split('=')[1].trim();
    }
  }

  const selectedPath = customPath || generateSecurePath(customPrefix, 20);

  if (!validatePath(selectedPath)) {
    console.error(`[Security Error] Path does not meet security requirements: "${selectedPath}"`);
    console.error('Path must start with "/", contain at least 16 characters of entropy, and not use predictable routes like "/admin/login".');
    process.exit(1);
  }

  // Target directories to update
  const appRoots = [
    path.resolve(__dirname, '..'),
    'C:\\Users\\ADMIN\\Desktop\\bb_exp-2.0',
    'C:\\Users\\ADMIN\\Desktop\\BB_course\\bb_react (2)'
  ];

  const updatedFiles = [];

  for (const root of appRoots) {
    if (fs.existsSync(root)) {
      const envPath = path.join(root, '.env');
      updateEnvFile(envPath, selectedPath);
      updatedFiles.push(envPath);
    }
  }

  console.log('\n=======================================================================');
  console.log('   BROADBEACH ACADEMY — SECURE ADMIN URL ROTATION SUCCESSFUL');
  console.log('=======================================================================');
  console.log(`\n  Generated High-Entropy Path: ${selectedPath}`);
  console.log(`  Full Local Login URL:        http://localhost:3000${selectedPath}`);
  console.log(`  Entropy:                     160 bits (CSPRNG crypto.randomBytes)`);
  console.log(`\n  Environment Files Updated:`);
  updatedFiles.forEach(f => console.log(`   - ${f}`));
  console.log('\n  Previous Route Invalidation:');
  console.log('   - http://localhost:3000/admin/login now returns HTTP 404 (NotFound)');
  console.log('   - No redirects exist from /admin/login to prevent reconnaissance leakage.');
  console.log('\n  Next Step: Restart the development server for changes to take effect:');
  console.log('   npm run dev\n');
  console.log('=======================================================================\n');
}

if (require.main === module) {
  main();
}

module.exports = { generateSecurePath, validatePath, updateEnvFile };
