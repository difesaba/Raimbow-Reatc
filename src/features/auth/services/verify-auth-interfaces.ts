/**
 * Verification script for Authentication API interfaces
 *
 * PURPOSE: Verify that TypeScript interfaces match actual API responses
 *
 * USAGE:
 * 1. Run this script after implementing authentication
 * 2. Check console output to compare actual vs expected structures
 * 3. Update interfaces in models/auth.model.ts if needed
 *
 * EXECUTION:
 * Add to a test component or run via console:
 * import './services/verify-auth-interfaces';
 */

import { apiService } from '@/config/services/apiService';

/**
 * Color codes for console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Log section header
 */
const logSection = (title: string) => {
  console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
};

/**
 * Log field information
 */
const logField = (field: string, value: any, expected?: string) => {
  const valueType = Array.isArray(value) ? 'array' : typeof value;
  const valueStr = value === null ? 'null' : value === undefined ? 'undefined' : JSON.stringify(value);

  console.log(`  ${colors.yellow}${field}:${colors.reset}`);
  console.log(`    ${colors.green}Type:${colors.reset} ${valueType}`);
  console.log(`    ${colors.green}Value:${colors.reset} ${valueStr.substring(0, 100)}${valueStr.length > 100 ? '...' : ''}`);

  if (expected) {
    console.log(`    ${colors.magenta}Expected:${colors.reset} ${expected}`);
  }
};

/**
 * Analyze object structure
 */
const analyzeStructure = (obj: any, name: string) => {
  console.log(`\n${colors.bright}${colors.cyan}Analyzing ${name}:${colors.reset}`);

  if (!obj) {
    console.log(`  ${colors.red}Object is null or undefined${colors.reset}`);
    return;
  }

  const fields = Object.keys(obj).sort();
  console.log(`  ${colors.green}Total fields: ${fields.length}${colors.reset}\n`);

  fields.forEach(field => {
    logField(field, obj[field]);
  });
};

/**
 * Verify login endpoint response
 */
export const verifyLoginResponse = async (email: string, password: string) => {
  logSection('VERIFYING LOGIN ENDPOINT');
  console.log(`${colors.cyan}Endpoint: POST /api/auth/login${colors.reset}`);

  try {
    const response = await apiService.post('/api/auth/login', { email, password });
    const data = response.data;

    console.log(`\n${colors.green}✓ Login successful${colors.reset}`);
    analyzeStructure(data, 'AuthResponse');

    // Specific validations
    console.log(`\n${colors.bright}${colors.yellow}Interface Validation:${colors.reset}`);

    // Check for token
    if (data.token) {
      console.log(`  ${colors.green}✓ token field exists${colors.reset}`);
      console.log(`    Token length: ${data.token.length} characters`);

      // Try to decode JWT (if it's a JWT)
      try {
        const parts = data.token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log(`    ${colors.cyan}JWT Payload:${colors.reset}`);
          analyzeStructure(payload, 'Token Payload');
        }
      } catch (e) {
        console.log(`    ${colors.yellow}Token is not a valid JWT${colors.reset}`);
      }
    } else {
      console.log(`  ${colors.red}✗ token field missing${colors.reset}`);
    }

    // Check for user data
    if (data.user) {
      console.log(`  ${colors.green}✓ user field exists${colors.reset}`);
      analyzeStructure(data.user, 'User Object');
    } else {
      console.log(`  ${colors.yellow}⚠ user field not found in root${colors.reset}`);
      console.log(`    Checking if user data is spread in response...`);

      // Check if user data is spread in the response
      const possibleUserFields = ['id', 'email', 'nombre', 'firstName', 'lastName', 'role', 'rol'];
      const foundUserFields = possibleUserFields.filter(field => data[field] !== undefined);

      if (foundUserFields.length > 0) {
        console.log(`    ${colors.green}Found user fields in root: ${foundUserFields.join(', ')}${colors.reset}`);
      }
    }

    // Generate TypeScript interface suggestion
    console.log(`\n${colors.bright}${colors.magenta}Suggested TypeScript Interface:${colors.reset}`);
    console.log(generateInterface(data, 'AuthResponse'));

    return data;
  } catch (error: any) {
    console.log(`\n${colors.red}✗ Login failed${colors.reset}`);

    if (error.response) {
      console.log(`  ${colors.yellow}Status: ${error.response.status}${colors.reset}`);
      console.log(`  ${colors.yellow}Error Response:${colors.reset}`);
      analyzeStructure(error.response.data, 'Error Response');
    } else {
      console.log(`  ${colors.red}Network or unexpected error:${colors.reset}`, error.message);
    }

    throw error;
  }
};

/**
 * Verify token validation endpoint (if exists)
 */
export const verifyTokenEndpoint = async () => {
  logSection('VERIFYING TOKEN VALIDATION ENDPOINT');
  console.log(`${colors.cyan}Endpoint: GET /api/auth/verify${colors.reset}`);

  try {
    const response = await apiService.get('/api/auth/verify');
    const data = response.data;

    console.log(`\n${colors.green}✓ Token verification successful${colors.reset}`);
    analyzeStructure(data, 'Token Verification Response');

    // Generate TypeScript interface suggestion
    console.log(`\n${colors.bright}${colors.magenta}Suggested TypeScript Interface:${colors.reset}`);
    console.log(generateInterface(data, 'TokenVerificationResponse'));

    return data;
  } catch (error: any) {
    console.log(`\n${colors.yellow}⚠ Token verification endpoint not available or failed${colors.reset}`);

    if (error.response?.status === 404) {
      console.log(`  ${colors.yellow}Endpoint does not exist (404)${colors.reset}`);
    } else if (error.response) {
      console.log(`  ${colors.yellow}Status: ${error.response.status}${colors.reset}`);
      analyzeStructure(error.response.data, 'Error Response');
    }

    return null;
  }
};

/**
 * Generate TypeScript interface from object
 */
const generateInterface = (obj: any, name: string): string => {
  if (!obj || typeof obj !== 'object') {
    return `export interface ${name} {\n  // Unable to generate - not an object\n}`;
  }

  let result = `export interface ${name} {\n`;

  Object.entries(obj).forEach(([key, value]) => {
    const type = getTypeString(value);
    const optional = value === null || value === undefined ? '?' : '';
    result += `  ${key}${optional}: ${type};\n`;
  });

  result += '}';
  return result;
};

/**
 * Get TypeScript type string from value
 */
const getTypeString = (value: any): string => {
  if (value === null || value === undefined) return 'any';
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const firstType = getTypeString(value[0]);
      return `${firstType}[]`;
    }
    return 'any[]';
  }
  if (typeof value === 'object') {
    return 'Record<string, any>';
  }
  return typeof value;
};

/**
 * Run all verifications
 */
export const runAllVerifications = async (testCredentials?: { email: string; password: string }) => {
  console.clear();
  logSection('RAINBOW PAINTING ERP - AUTH API VERIFICATION');
  console.log(`${colors.cyan}Starting API interface verification...${colors.reset}`);
  console.log(`${colors.yellow}Note: This will make real API calls${colors.reset}\n`);

  const results: Record<string, any> = {};

  // Test login if credentials provided
  if (testCredentials) {
    try {
      results.login = await verifyLoginResponse(testCredentials.email, testCredentials.password);
    } catch (error) {
      results.loginError = error;
    }
  } else {
    console.log(`${colors.yellow}⚠ Skipping login test - no credentials provided${colors.reset}`);
    console.log(`  To test login, call: runAllVerifications({ email: 'test@example.com', password: 'password' })\n`);
  }

  // Test token verification
  try {
    results.tokenVerification = await verifyTokenEndpoint();
  } catch (error) {
    results.tokenVerificationError = error;
  }

  // Summary
  logSection('VERIFICATION SUMMARY');

  console.log(`${colors.bright}Results:${colors.reset}`);
  Object.entries(results).forEach(([key, value]) => {
    if (key.includes('Error')) {
      console.log(`  ${colors.red}✗ ${key}${colors.reset}`);
    } else if (value) {
      console.log(`  ${colors.green}✓ ${key}${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}⚠ ${key} (no data)${colors.reset}`);
    }
  });

  console.log(`\n${colors.bright}${colors.yellow}Next Steps:${colors.reset}`);
  console.log('1. Review the actual API responses above');
  console.log('2. Update interfaces in models/auth.model.ts to match actual responses');
  console.log('3. Pay special attention to:');
  console.log('   - Optional vs required fields');
  console.log('   - Field names and casing');
  console.log('   - Nested object structures');
  console.log('4. Remove any [key: string]: any after confirming all fields');

  return results;
};

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).verifyAuth = {
    runAll: runAllVerifications,
    verifyLogin: verifyLoginResponse,
    verifyToken: verifyTokenEndpoint
  };

  console.log(`${colors.bright}${colors.green}Auth verification tools loaded!${colors.reset}`);
  console.log('Available commands:');
  console.log('  window.verifyAuth.runAll({ email: "test@example.com", password: "password" })');
  console.log('  window.verifyAuth.verifyLogin("email", "password")');
  console.log('  window.verifyAuth.verifyToken()');
}