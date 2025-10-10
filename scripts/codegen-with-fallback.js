#!/usr/bin/env node

/**
 * Enhanced GraphQL Codegen runner with better error handling
 * This script attempts to run codegen with fallback strategies if the GraphQL endpoint is unavailable
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GraphQL Codegen...');

// Check environment variables
console.log('DRUPAL_BASE_URL:', process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'not set');
console.log('DRUPAL_API_KEY present:', !!process.env.DRUPAL_API_KEY);

const graphqlDir = path.join(__dirname, '..', 'lib', 'graphql');
const hasExistingFiles = fs.existsSync(graphqlDir) && fs.readdirSync(graphqlDir).length > 0;

if (hasExistingFiles) {
  console.log('📁 Found existing generated GraphQL files');
}

try {
  // Try to run codegen with timeout
  console.log('🔄 Running GraphQL codegen...');
  execSync('bun run codegen:compile', { 
    stdio: 'inherit',
    timeout: 60000, // 60 second timeout
  });
  console.log('✅ Codegen completed successfully');
} catch (error) {
  console.error('❌ Codegen failed:', error.message);
  
  if (hasExistingFiles) {
    console.log('📁 Using existing generated GraphQL files from previous build');
    console.log('⚠️  Note: GraphQL types may be outdated if schema has changed');
  } else {
    console.error('💥 No existing GraphQL files found and codegen failed');
    console.error('🔧 Possible solutions:');
    console.error('   1. Check if DRUPAL_API_KEY is correctly set in Netlify environment variables');
    console.error('   2. Verify that the GraphQL endpoint is accessible from Netlify');
    console.error('   3. Check if there are network restrictions blocking the request');
    console.error('   4. Consider committing generated files to git as a fallback');
    
    // Exit with error only if no fallback files exist
    process.exit(1);
  }
}

console.log('✅ GraphQL setup completed');
