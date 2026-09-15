/**
 * Test Script for Trading Dashboard API
 * Run: node test-trading-api.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 'DEV0';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`)
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testStartTrading() {
    log.section('Testing START TRADING');
    
    try {
        log.info(`Sending request to ${API_BASE_URL}/start-trading`);
        
        const payload = {
            user_id: TEST_USER_ID,
            access_token: 'test_token_' + Date.now(),
            trade_mode: 'VIRTUAL',
            capital: 50000,
            USE_AI_VALIDATION: false,
            DEBUG_MODE: true
        };
        
        log.info('Payload: ' + JSON.stringify(payload, null, 2));
        
        const response = await axios.post(
            `${API_BASE_URL}/start-trading`,
            payload,
            { timeout: 5000 }
        );
        
        if (response.status === 200 && response.data.success) {
            log.success('Trading started successfully!');
            console.log('Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            log.error('Unexpected response: ' + JSON.stringify(response.data));
            return null;
        }
    } catch (error) {
        log.error('Failed to start trading');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
        return null;
    }
}

async function testGetStatus() {
    log.section('Testing GET STATUS');
    
    try {
        log.info(`Sending request to ${API_BASE_URL}/trading-status?user_id=${TEST_USER_ID}`);
        
        const response = await axios.get(
            `${API_BASE_URL}/trading-status?user_id=${TEST_USER_ID}`,
            { timeout: 5000 }
        );
        
        if (response.status === 200 && response.data.success) {
            log.success('Status retrieved successfully!');
            console.log('Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            log.error('Unexpected response: ' + JSON.stringify(response.data));
            return null;
        }
    } catch (error) {
        log.error('Failed to get status');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
        return null;
    }
}

async function testStopTrading() {
    log.section('Testing STOP TRADING');
    
    try {
        log.info(`Sending request to ${API_BASE_URL}/stop-trading`);
        
        const payload = {
            user_id: TEST_USER_ID,
            access_token: 'test_token_' + Date.now()
        };
        
        log.info('Payload: ' + JSON.stringify(payload, null, 2));
        
        const response = await axios.post(
            `${API_BASE_URL}/stop-trading`,
            payload,
            { timeout: 5000 }
        );
        
        if (response.status === 200 && response.data.success) {
            log.success('Trading stopped successfully!');
            console.log('Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            log.error('Unexpected response: ' + JSON.stringify(response.data));
            return null;
        }
    } catch (error) {
        log.error('Failed to stop trading');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
        return null;
    }
}

async function testDashboard() {
    log.section('Testing DASHBOARD');
    
    try {
        const dashboardUrl = `${API_BASE_URL}/trading-dashboard?` + new URLSearchParams({
            userId: 'TEST123',
            userName: 'Test User',
            email: 'test@example.com',
            userType: 'Individual',
            exchanges: 'NSE,BSE',
            accessToken: 'test_token'
        }).toString();
        
        log.info('Dashboard URL: ' + dashboardUrl);
        log.success('Dashboard URL is valid (open in browser to test)');
        console.log('\nOpen this URL in your browser:');
        console.log(`${colors.cyan}${dashboardUrl}${colors.reset}`);
    } catch (error) {
        log.error('Error: ' + error.message);
    }
}

async function runAllTests() {
    console.clear();
    console.log(`${colors.cyan}
╔══════════════════════════════════════╗
║  Trading Dashboard API Test Suite    ║
╚══════════════════════════════════════╝
    ${colors.reset}`);
    
    log.info(`API Base URL: ${API_BASE_URL}`);
    log.info(`Test User ID: ${TEST_USER_ID}`);
    log.warn('Make sure the server is running on port 3000');
    
    // Test 1: Start Trading
    const startResult = await testStartTrading();
    
    if (!startResult) {
        log.error('Cannot continue - server might not be running');
        process.exit(1);
    }
    
    await delay(1000);
    
    // Test 2: Get Status
    const statusResult = await testGetStatus();
    
    if (statusResult && statusResult.data && statusResult.data.status === 'ACTIVE') {
        log.success('Session is ACTIVE');
    }
    
    await delay(1000);
    
    // Test 3: Stop Trading
    const stopResult = await testStopTrading();
    
    await delay(1000);
    
    // Test 4: Dashboard
    await testDashboard();
    
    // Summary
    log.section('Test Summary');
    console.log(`${colors.green}✓${colors.reset} Start Trading: ${startResult ? 'PASS' : 'FAIL'}`);
    console.log(`${colors.green}✓${colors.reset} Get Status: ${statusResult ? 'PASS' : 'FAIL'}`);
    console.log(`${colors.green}✓${colors.reset} Stop Trading: ${stopResult ? 'PASS' : 'FAIL'}`);
    
    log.section('Next Steps');
    console.log(`1. Open the dashboard in your browser`);
    console.log(`2. Complete Upstox authentication`);
    console.log(`3. Test the full flow from the UI`);
}

// Check if axios is installed
try {
    require('axios');
} catch (e) {
    log.error('axios not installed. Install it with: npm install axios');
    process.exit(1);
}

// Run tests
runAllTests().catch(error => {
    log.error('Test suite failed: ' + error.message);
    process.exit(1);
});
