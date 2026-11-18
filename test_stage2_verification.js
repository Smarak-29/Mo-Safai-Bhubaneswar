const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let sessionCookie = '';

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

    if (sessionCookie) {
      reqOptions.headers['Cookie'] = sessionCookie;
    }

    const req = http.request(reqOptions, (res) => {
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

// Multipart helper for file upload
function postMultipart(urlPath, fields, fileField) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const url = new URL(urlPath, BASE_URL);
    
    let postData = [];
    
    for (const [key, value] of Object.entries(fields)) {
      postData.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`));
    }

    if (fileField) {
      postData.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.contentType}\r\n\r\n`));
      postData.push(fileField.buffer);
      postData.push(Buffer.from('\r\n'));
    }

    postData.push(Buffer.from(`--${boundary}--\r\n`));
    const fullBody = Buffer.concat(postData);

    const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length
    };
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers
    }, (res) => {
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
    req.write(fullBody);
    req.end();
  });
}

async function runStage2Tests() {
  console.log('====================================================');
  console.log('🧪 Starting Stage 2 "Mo Safai Bhubaneswar" Verification');
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
    // Authenticate as Smarak
    console.log('👉 [1/6] Demo Citizen Login to obtain active session:');
    const demoRes = await request('/auth/demo-login');
    assert(demoRes.statusCode === 302, 'Demo login redirects to /account');
    assert(sessionCookie.includes('connect.sid'), 'Active session cookie captured');

    // Get initial credits
    const accountRes = await request('/account');
    const creditsMatch = accountRes.body.match(/id="creditsHeroCount"[^>]*>(\d+)</);
    const initialCredits = creditsMatch ? parseInt(creditsMatch[1]) : 120;
    console.log(`     Initial Citizen Green Credits: ${initialCredits}`);

    // TEST 2: GET /scanner UI Verification
    console.log('\n👉 [2/6] Testing Smart Scanner View (/scanner):');
    const scannerRes = await request('/scanner');
    assert(scannerRes.statusCode === 200, 'GET /scanner returns 200 OK');
    assert(scannerRes.body.includes('AI Smart Waste Scanner'), 'Scanner title rendered');
    assert(scannerRes.body.includes('Gemini 2.5 Flash'), 'Gemini 2.5 Flash badge rendered');
    assert(scannerRes.body.includes('wasteImageInput'), 'Camera / file upload input element present');
    assert(scannerRes.body.includes('capture="environment"'), 'Mobile environment camera capture enabled');
    assert(scannerRes.body.includes('runSampleScan(\'wet\')'), 'Quick demo button for Wet Waste present');
    assert(scannerRes.body.includes('runSampleScan(\'overflowing\')'), 'Quick demo button for Overflowing Bin present');
    assert(scannerRes.body.includes('runSampleScan(\'temple\')'), 'Quick demo button for Temple Flowers present');
    assert(scannerRes.body.includes('runSampleScan(\'dry\')'), 'Quick demo button for Dry Recyclable present');
    assert(scannerRes.body.includes('🔊 Listen in Odia / ଓଡ଼ିଆରେ ଶୁଣନ୍ତୁ'), 'Prominent Odia Speech Synthesis button present');
    assert(scannerRes.body.includes('BMC 1929 Grievance Ticket Logged'), 'BMC 1929 Grievance Ticket card markup present');
    assert(scannerRes.body.includes('Recent Scans & 1929 Tickets'), 'Recent citizen scans history section present');

    // TEST 3: POST /api/scan with Wet Waste Sample
    console.log('\n👉 [3/6] Testing Wet Waste Scan & Green Credits (+10 GC):');
    const wetScanRes = await postMultipart('/api/scan', { sampleType: 'wet' });
    assert(wetScanRes.statusCode === 200, 'POST /api/scan (Wet) returns 200 OK');
    const wetJson = JSON.parse(wetScanRes.body);
    assert(wetJson.success === true, 'Scan returns success: true');
    assert(wetJson.data.wasteCategory === 'Wet (Biodegradable)', 'Classified as "Wet (Biodegradable)"');
    assert(wetJson.data.binColor === 'Green Bin', 'Recommended bin is "Green Bin"');
    assert(wetJson.data.isOverflowing === false, 'isOverflowing is false');
    assert(wetJson.data.creditsEarned === 10, 'Awarded +10 Green Credits');
    assert(wetJson.data.instructionOr.includes('ସବୁଜ ଡଷ୍ଟବିନରେ'), 'Authentic Odia instruction generated');
    assert(wetJson.data.newGreenCredits === initialCredits + 10, `Green credits incremented to ${initialCredits + 10}`);

    // TEST 4: POST /api/scan with Overflowing Bin (BMC 1929 Auto-Ticket +20 GC)
    console.log('\n👉 [4/6] Testing Overflowing Bin Scan & BMC 1929 Grievance Auto-Ticket (+20 GC):');
    const overflowScanRes = await postMultipart('/api/scan', { sampleType: 'overflowing' });
    assert(overflowScanRes.statusCode === 200, 'POST /api/scan (Overflowing) returns 200 OK');
    const overflowJson = JSON.parse(overflowScanRes.body);
    assert(overflowJson.success === true, 'Scan returns success: true');
    assert(overflowJson.data.isOverflowing === true, 'isOverflowing is true');
    assert(overflowJson.data.drainClogRisk === true, 'drainClogRisk is true');
    assert(overflowJson.data.creditsEarned === 20, 'Awarded +20 Green Credits for civic hazard reporting');
    assert(/^BMC-SWM-2026-\d{4}$/.test(overflowJson.data.ticketId), `Generated valid BMC Grievance Ticket ID: ${overflowJson.data.ticketId}`);
    assert(overflowJson.data.instructionOr.includes('୧୯୨୯'), 'Odia instruction mentions BMC 1929 grievance ticket');
    assert(overflowJson.data.newGreenCredits === initialCredits + 30, `Green credits incremented to ${initialCredits + 30}`);

    // TEST 5: POST /api/scan with Temple Floral Waste
    console.log('\n👉 [5/6] Testing Temple Floral Waste (Nirmalya / Bio-Compost):');
    const templeScanRes = await postMultipart('/api/scan', { sampleType: 'temple' });
    assert(templeScanRes.statusCode === 200, 'POST /api/scan (Temple) returns 200 OK');
    const templeJson = JSON.parse(templeScanRes.body);
    assert(templeJson.success === true, 'Scan returns success: true');
    assert(templeJson.data.wasteCategory === 'Temple Floral Waste', 'Classified as "Temple Floral Waste"');
    assert(templeJson.data.binColor === 'Temple Compost', 'Recommended bin is "Temple Compost"');
    assert(templeJson.data.instructionOr.includes('ନିର୍ମାଲ୍ୟ'), 'Odia instruction properly identifies Nirmalya sacred flowers');

    // TEST 6: Real Image File Upload via Multer & Gemini API Integration
    console.log('\n👉 [6/6] Testing Real File Upload via Multer & Gemini API Error Reporting:');
    const dummyImageBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xFF, 0xD9]);
    const fileUploadRes = await postMultipart(
      '/api/scan',
      {},
      {
        name: 'wasteImage',
        filename: 'plastic_bottle_drain.jpg',
        contentType: 'image/jpeg',
        buffer: dummyImageBuffer
      }
    );
    const uploadJson = JSON.parse(fileUploadRes.body);
    if (fileUploadRes.statusCode === 200) {
      assert(uploadJson.success === true, 'Gemini Vision successfully classified uploaded image');
      assert(uploadJson.data.imageUrl && uploadJson.data.imageUrl.startsWith('/uploads/'), `Image saved to static path: ${uploadJson.data.imageUrl}`);
    } else {
      assert(fileUploadRes.statusCode === 500, 'POST /api/scan returns 500 on Gemini API error');
      assert(uploadJson.success === false, 'Scan returns success: false on Gemini error');
      assert(uploadJson.error.includes('Gemini Vision analysis failed'), 'Returns clear JSON error message describing the Gemini API failure');
      assert(!uploadJson.data, 'No hardcoded "Wet (Biodegradable)" mock result returned when upload fails');
    }

    // Verify GET /api/reports includes the created tickets
    const reportsRes = await request('/api/reports');
    assert(reportsRes.statusCode === 200, 'GET /api/reports returns 200 OK');
    const reportsJson = JSON.parse(reportsRes.body);
    assert(reportsJson.count >= 2, `Citizen reports retrieved from DB (count: ${reportsJson.count})`);
    const hasTicket = reportsJson.data.some(r => r.ticketId && r.ticketId.startsWith('BMC-SWM-2026-'));
    assert(hasTicket, 'At least one report contains an active BMC 1929 grievance ticket');

    console.log(`\n====================================================`);
    console.log(`🏁 Stage 2 Verification Results: ${passed} / ${total} Tests Passed`);
    console.log(`====================================================`);
    if (passed === total) {
      console.log('🎉 ALL STAGE 2 REQUIREMENTS FULLY SATISFIED!');
      process.exit(0);
    } else {
      console.error('⚠️ Some tests failed. Please review the output above.');
      process.exit(1);
    }

  } catch (err) {
    console.error('Stage 2 test failed with error:', err);
    process.exit(1);
  }
}

runStage2Tests();
