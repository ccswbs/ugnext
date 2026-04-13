#!/usr/bin/env node

// Alternative build script that handles codegen errors gracefully
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...');
console.log('DRUPAL_API_KEY present:', !!process.env.DRUPAL_API_KEY);
console.log('DRUPAL_BASE_URL:', process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);

const graphqlDir = path.join(__dirname, '..', 'lib', 'graphql');

try {
  // Try to run codegen
  console.log('🚀 Running GraphQL codegen...');
  execSync('npm run codegen:compile', { stdio: 'inherit' });
  console.log('✅ Codegen completed successfully');
} catch (error) {
  console.error('❌ Codegen failed:', error.message);
  
  // Check if generated files exist from a previous build
  if (fs.existsSync(graphqlDir)) {
    console.log('📁 Using existing generated GraphQL files');
  } else {
    console.error('💥 No generated GraphQL files found and codegen failed');
    process.exit(1);
  }
}

// Continue with Next.js build
console.log('🏗️ Running Next.js build...');
execSync('next build', { stdio: 'inherit' });
console.log('✅ Build completed successfully');
