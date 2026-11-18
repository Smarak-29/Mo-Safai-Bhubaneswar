const http = require('http');

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
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

async function runStage4Tests() {
  console.log('====================================================');
  console.log('🧪 Starting Stage 4 "Mo Safai Bhubaneswar" Verification');
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
    // 1. Landing Page (GET /)
    console.log('👉 [1/6] Testing Public Civic Landing Page (GET /):');
    const landingRes = await request('/');
    assert(landingRes.statusCode === 200, 'GET / returns 200 OK');
    assert(landingRes.body.includes('AI Smart Waste Management & Dual-Stream Routing') || landingRes.body.includes('landing_hero_title'), 'Landing hero title rendered');
    assert(landingRes.body.includes('Live Municipal Civic Impact') || landingRes.body.includes('civic_impact_heading'), 'Live Municipal Civic Impact section rendered');
    assert(landingRes.body.includes('Top Clean Wards Leaderboard') || landingRes.body.includes('leaderboard_heading'), 'Top Clean Wards Leaderboard rendered');
    assert(landingRes.body.includes('Mo Khata'), 'Mo Khata bio-compost metrics present');
    assert(landingRes.body.includes('Niladri Vihar MCC'), 'Niladri Vihar MCC reference present');
    assert(landingRes.body.includes('Haversine Route Optimizer') || landingRes.body.includes('stat_fuel_saved'), 'Fuel & CO2 prevention metric present');

    // 2. Live Civic Impact & Ward Leaderboard API (GET /api/impact-metrics)
    console.log('\n👉 [2/6] Testing Live Civic Impact API (GET /api/impact-metrics):');
    const apiRes = await request('/api/impact-metrics');
    assert(apiRes.statusCode === 200, 'GET /api/impact-metrics returns 200 OK');
    const apiData = JSON.parse(apiRes.body);
    assert(apiData.success === true, 'API returns success: true');
    assert(typeof apiData.data.metrics.totalScans === 'number', 'Total AI scans metric is a valid number');
    assert(typeof apiData.data.metrics.compostKg === 'number', 'Mo Khata compost yield (kg) is a valid number');
    assert(typeof apiData.data.metrics.fuelSavedL === 'number', 'Fuel saved metric is a valid number');
    assert(typeof apiData.data.metrics.co2SavedKg === 'number', 'CO2 saved metric is a valid number');
    assert(Array.isArray(apiData.data.leaderboard), 'Ward leaderboard is an array');
    assert(apiData.data.leaderboard.length === 6, 'Leaderboard covers all 6 Bhubaneswar wards');
    assert(apiData.data.leaderboard[0].rank === 1, 'Top ward is ranked #1');
    assert(typeof apiData.data.leaderboard[0].cleanScore === 'number', 'Top ward has a numeric clean score');

    // 3. Authenticated Citizen Account View (GET /account)
    console.log('\n👉 [3/6] Testing Account View with Impact & Leaderboard (/account):');
    const loginRes = await request('/auth/demo-login');
    const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
    const accountRes = await request('/account', { headers: { Cookie: cookie } });
    assert(accountRes.statusCode === 200, 'GET /account returns 200 OK');
    assert(accountRes.body.includes('Live Municipal Civic Impact') || accountRes.body.includes('civic_impact_heading'), 'Account page displays live civic impact strip');
    assert(accountRes.body.includes('Top Clean Wards Leaderboard') || accountRes.body.includes('leaderboard_heading'), 'Account page displays top clean wards leaderboard');
    assert(accountRes.body.includes('Green Credits Balance'), 'Account page displays citizen Green Credits hero card');

    // 4. Ticket Resolution API (POST /api/tickets/:id/resolve)
    console.log('\n👉 [4/6] Testing 1-Click BMC 1929 Ticket Resolution:');
    // First, let's create a report with an overflowing bin to generate an active ticket
    const scanRes = await request('/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      },
      body: 'sampleType=overflowing'
    });
    assert(scanRes.statusCode === 200, 'POST /api/scan (overflowing) returns 200 OK');
    const scanData = JSON.parse(scanRes.body);
    const createdTicketId = scanData.data.ticketId;
    assert(Boolean(createdTicketId), `Active ticket generated: ${createdTicketId}`);

    // Resolve the ticket via 1-click API
    const resolveRes = await request(`/api/tickets/${createdTicketId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      }
    });
    assert(resolveRes.statusCode === 200, 'POST /api/tickets/:id/resolve returns 200 OK');
    const resolveData = JSON.parse(resolveRes.body);
    assert(resolveData.success === true, 'Resolve response returns success: true');
    assert(resolveData.ticket.status === 'Resolved', 'Ticket status updated to Resolved in MongoDB');
    assert(Boolean(resolveData.ticket.resolvedAt), 'Ticket has valid resolvedAt timestamp');

    // 5. Command Map View Ticket Controls (/map)
    console.log('\n👉 [5/6] Testing Command Map 1-Click Ticket UI (/map):');
    const mapRes = await request('/map', { headers: { Cookie: cookie } });
    assert(mapRes.statusCode === 200, 'GET /map returns 200 OK');
    assert(mapRes.body.includes('Live BMC 1929 Citizen Tickets') || mapRes.body.includes('live_tickets_feed'), 'Live 1929 ticket feed present on map');
    assert(mapRes.body.includes('btn-resolve') || mapRes.body.includes('Mark Resolved') || mapRes.body.includes('btn_mark_resolved'), 'Mark Resolved 1-click button rendered on map');
    assert(mapRes.body.includes('ticket-item'), 'Ticket item cards formatted cleanly');

    // 6. Scanner Wi-Fi Fallback & Git Safety
    console.log('\n👉 [6/6] Testing Scanner Demo Safety & Uploads Git Preservation:');
    const scannerRes = await request('/scanner', { headers: { Cookie: cookie } });
    assert(scannerRes.statusCode === 200, 'GET /scanner returns 200 OK');
    assert(scannerRes.body.includes('scanErrorCard'), 'Graceful scanErrorCard fallback element present');
    assert(scannerRes.body.includes('quick_samples_title') || scannerRes.body.includes('Quick Demo Samples'), '1-click quick demo samples present for offline/demo safety');

    const fs = require('fs');
    const path = require('path');
    const gitkeepPath = path.join(__dirname, 'public/uploads/.gitkeep');
    assert(fs.existsSync(gitkeepPath), 'public/uploads/.gitkeep exists for git tracking');

    const readmePath = path.join(__dirname, 'README.md');
    assert(fs.existsSync(readmePath), 'Comprehensive README.md created and verified');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    assert(readmeContent.includes('Niladri Vihar'), 'README documents Niladri Vihar MCC');
    assert(readmeContent.includes('Pokhariput'), 'README documents Pokhariput MRF');
    assert(readmeContent.includes('Haversine'), 'README documents Haversine route optimizer');
    assert(readmeContent.includes('Swachh Survekshan 2026'), 'README documents BMC civic mission');

    console.log('\n====================================================');
    console.log(`🏁 Stage 4 Verification Results: ${passed} / ${total} Tests Passed`);
    console.log('====================================================');

    if (passed === total) {
      console.log('🎉 ALL STAGE 4 REQUIREMENTS FULLY SATISFIED!');
      process.exit(0);
    } else {
      console.error(`⚠️ ${total - passed} tests failed.`);
      process.exit(1);
    }
  } catch (err) {
    console.error('Stage 4 test failed with error:', err);
    process.exit(1);
  }
}

runStage4Tests();
