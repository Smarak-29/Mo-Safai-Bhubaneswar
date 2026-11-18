const http = require('http');

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Simple helper for HTTP requests with cookie jar
let sessionCookie = '';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (sessionCookie) {
      reqOptions.headers['Cookie'] = sessionCookie;
    }

    const req = http.request(reqOptions, (res) => {
      // Capture cookies
      if (res.headers['set-cookie']) {
        sessionCookie = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting "Mo Safai Bhubaneswar" Verification Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // TEST 1: GET /login and Design System Verification
    console.log('👉 [1/6] Testing Login Page & Civic UI Design System:');
    const loginRes = await request('/login');
    assert(loginRes.statusCode === 200, 'GET /login returns 200 OK');
    assert(loginRes.body.includes('Plus Jakarta Sans') && loginRes.body.includes('Noto Sans Oriya'), 'Google Fonts includes Plus Jakarta Sans and Noto Sans Oriya');
    assert(loginRes.body.includes('Mo Safai Bhubaneswar'), 'App brand "Mo Safai Bhubaneswar" present');
    assert(loginRes.body.includes('Bhubaneswar Municipal Corporation'), 'BMC subtitle present');
    assert(loginRes.body.includes('lang-btn-en') && loginRes.body.includes('lang-btn-or'), 'English | ଓଡ଼ିଆ pill switcher present');
    assert(loginRes.body.includes('One-Click Demo Citizen Login'), 'One-Click Demo Citizen Login button present');
    assert(loginRes.body.includes('Scan Waste') && loginRes.body.includes('City Map') && loginRes.body.includes('Account'), 'Mobile bottom navigation tabs present');
    assert(loginRes.body.includes('touch-target'), 'Generous touch target classes present on buttons and inputs');

    // TEST 2: One-Click Demo Citizen Login
    console.log('\n👉 [2/6] Testing One-Click Demo Citizen Login:');
    const demoRes = await request('/auth/demo-login');
    assert(demoRes.statusCode === 302, 'GET /auth/demo-login redirects (302) to /account');
    assert(demoRes.headers.location === '/account', 'Redirect destination is /account');
    assert(sessionCookie.includes('connect.sid'), 'Express session cookie created successfully');

    // TEST 3: Authenticated Account Page
    console.log('\n👉 [3/6] Testing Authenticated Citizen Account View:');
    const accountRes = await request('/account');
    assert(accountRes.statusCode === 200, 'GET /account returns 200 OK with session');
    assert(accountRes.body.includes('Smarak Mohapatra'), 'Demo citizen name "Smarak Mohapatra" rendered');
    assert(accountRes.body.includes('smarak.citizen@bhubaneswar.gov.in'), 'Demo citizen email rendered');
    assert(/id="creditsHeroCount"[^>]*>\d+</.test(accountRes.body) && accountRes.body.includes('Green Credits Balance'), 'Green Credits Balance displayed in hero card');
    assert(accountRes.body.includes('Mo Khata Citizen Tier 1'), 'Mo Khata Citizen Tier 1 badge displayed');
    assert(accountRes.body.includes('Ward 1 - Patia') && accountRes.body.includes('Ward 26 - Jaydev Vihar'), 'BMC Ward options (Patia, Jaydev Vihar, Saheed Nagar, Old Town, Bapuji Nagar, Khandagiri) rendered in dropdown');
    assert(accountRes.body.includes('autoVoiceToggle'), 'Auto-Voice Readout toggle switch present');
    assert(accountRes.body.includes('toastNotification'), 'Subtle toast notification element present');

    // TEST 4: Account Settings Persistence (POST /account/settings)
    console.log('\n👉 [4/6] Testing Settings Persistence via POST /account/settings:');
    const updatePayload = JSON.stringify({
      ward: 'Ward 26 - Jaydev Vihar',
      language: 'or',
      autoVoice: true
    });
    const updateRes = await request('/account/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: updatePayload
    });
    assert(updateRes.statusCode === 200, 'POST /account/settings returns 200 OK');
    const updateJson = JSON.parse(updateRes.body);
    assert(updateJson.success === true, 'JSON response returns success: true');
    assert(updateJson.user.ward === 'Ward 26 - Jaydev Vihar', 'User ward updated to "Ward 26 - Jaydev Vihar"');
    assert(updateJson.user.settings.language === 'or', 'User preferred language updated to "or" (Odia)');
    assert(updateJson.user.settings.autoVoice === true, 'User autoVoice toggle updated to true');

    // Verify persistence on fresh GET /account
    const reloadedAccount = await request('/account');
    assert(reloadedAccount.body.includes('Ward 26 - Jaydev Vihar'), 'Persisted ward "Ward 26 - Jaydev Vihar" correctly selected on reloaded account page');
    assert(/id="langOr"[^>]*checked/.test(reloadedAccount.body) || /value="or"[^>]*checked/.test(reloadedAccount.body), 'Persisted language "or" correctly checked');

    // TEST 5: Live IoT Bin Telemetry API (GET /api/bins)
    console.log('\n👉 [5/6] Testing Live IoT Bin Telemetry API:');
    const binsRes = await request('/api/bins');
    assert(binsRes.statusCode === 200, 'GET /api/bins returns 200 OK');
    const binsJson = JSON.parse(binsRes.body);
    assert(binsJson.success === true, 'API returns success: true');
    assert(binsJson.count === 12, 'Exactly 12 realistic Bhubaneswar bins seeded');

    // Verify ward distribution
    const wardsPresent = new Set(binsJson.data.map(b => b.wardName));
    assert(wardsPresent.has('Patia') && wardsPresent.has('Jaydev Vihar') && wardsPresent.has('Saheed Nagar') && wardsPresent.has('Old Town / Lingaraj') && wardsPresent.has('Bapuji Nagar') && wardsPresent.has('Khandagiri'), 'Bins cover Patia, Jaydev Vihar, Saheed Nagar, Old Town, Bapuji Nagar, and Khandagiri');

    // Verify GPS coordinates in Bhubaneswar range
    const validCoords = binsJson.data.every(b => b.lat >= 20.20 && b.lat <= 20.40 && b.lng >= 85.70 && b.lng <= 85.90);
    assert(validCoords, 'All 12 bins have realistic Bhubaneswar GPS coordinates (~20.24-20.36°N, 85.78-85.85°E)');

    // Verify Waste Streams
    const streams = new Set(binsJson.data.map(b => b.wasteStream));
    assert(streams.has('Wet') && streams.has('Dry'), 'Both Wet and Dry waste streams represented');

    // TEST 6: City Map & Scanner Views
    console.log('\n👉 [6/6] Testing City Map & Scanner Views:');
    const mapRes = await request('/map');
    assert(mapRes.statusCode === 200, 'GET /map returns 200 OK');
    assert(mapRes.body.includes('Live Smart Bin Telemetry'), 'Map page title rendered');
    assert(mapRes.body.includes('Normal') && mapRes.body.includes('Critical'), 'Status legend badges rendered');
    assert(mapRes.body.includes('data-ward="Patia"'), 'Ward filter buttons rendered');

    const scannerRes = await request('/scanner');
    assert(scannerRes.statusCode === 200, 'GET /scanner returns 200 OK');
    assert(scannerRes.body.includes('Smart Scanner'), 'Scanner page title rendered');
    assert(scannerRes.body.includes('Listen in Odia') || scannerRes.body.includes('ଓଡ଼ିଆରେ ଶୁଣନ୍ତୁ'), 'Bilingual waste segregation guidance rendered');

    console.log(`\n====================================================`);
    console.log(`🏁 Verification Results: ${passed} / ${total} Tests Passed`);
    console.log(`====================================================`);
    if (passed === total) {
      console.log('🎉 ALL STAGE 1 REQUIREMENTS FULLY SATISFIED!');
      process.exit(0);
    } else {
      console.error('⚠️ Some tests failed. Please review the output above.');
      process.exit(1);
    }

  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  }
}

runTests();
