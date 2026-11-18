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

async function runStage3Tests() {
  console.log('====================================================');
  console.log('🧪 Starting Stage 3 "Mo Safai Bhubaneswar" Verification');
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
    // TEST 1: GET /map HTML and Leaflet Markup
    console.log('👉 [1/6] Testing Municipal Command Map View (/map):');
    const mapRes = await request('/map');
    assert(mapRes.statusCode === 200, 'GET /map returns 200 OK');
    assert(mapRes.body.includes('leaflet.css') && mapRes.body.includes('leaflet.js'), 'Leaflet.js CSS & JS CDN loaded');
    assert(mapRes.body.includes('id="bhubaneswarMap"'), 'Leaflet map container (#bhubaneswarMap) present');
    assert(mapRes.body.includes('btnSimulateSpike'), 'Simulate Overflow Spike button present');
    assert(mapRes.body.includes('btnResetBins'), 'Reset Bins button present');
    assert(mapRes.body.includes('btnOptimizeRoutes'), 'Optimize Truck Routes button present');
    assert(mapRes.body.includes('data-zone="North"') && mapRes.body.includes('data-zone="South-East"'), 'BMC Zone filter pills (North, South-East, South-West) present');
    assert(mapRes.body.includes('metricCriticalCount') && mapRes.body.includes('metricCompost'), 'Impact metrics elements present');
    assert(mapRes.body.includes('driverManifestSection'), 'Driver turn-by-turn manifest section present');
    assert(mapRes.body.includes('/js/map.js'), 'Client map.js script included');

    // TEST 2: POST /api/simulate-spike
    console.log('\n👉 [2/6] Testing Live Overflow Spike Simulation (POST /api/simulate-spike):');
    const spikeRes = await request('/api/simulate-spike', { method: 'POST' });
    assert(spikeRes.statusCode === 200, 'POST /api/simulate-spike returns 200 OK');
    const spikeJson = JSON.parse(spikeRes.body);
    assert(spikeJson.success === true, 'Spike response returns success: true');
    assert(spikeJson.count >= 3, `Boosted ${spikeJson.count} bins to critical fill levels`);
    const allOver80 = spikeJson.data.every(b => b.fillLevel >= 85 && b.status === 'Critical');
    assert(allOver80, 'All boosted bins are above 85% with Critical status');

    // TEST 3: GET /api/bins reflects spiked bins
    console.log('\n👉 [3/6] Testing Live Bin Telemetry reflection of spiked bins:');
    const binsRes = await request('/api/bins');
    assert(binsRes.statusCode === 200, 'GET /api/bins returns 200 OK');
    const binsJson = JSON.parse(binsRes.body);
    const criticalBins = binsJson.data.filter(b => b.fillLevel > 80);
    assert(criticalBins.length >= 3, `Telemetry confirms ${criticalBins.length} critical bins in MongoDB`);

    // TEST 4: GET /api/optimize-route (Dual-Stream Haversine Routing)
    console.log('\n👉 [4/6] Testing Dual-Stream Truck Route Optimization (GET /api/optimize-route):');
    const optRes = await request('/api/optimize-route');
    assert(optRes.statusCode === 200, 'GET /api/optimize-route returns 200 OK');
    const optJson = JSON.parse(optRes.body);
    assert(optJson.success === true, 'Optimization returns success: true');
    assert(optJson.summary.totalCriticalBins >= 3, `Optimized for ${optJson.summary.totalCriticalBins} critical bins`);
    assert(optJson.summary.totalOptimizedDistanceKm > 0, `Total route distance calculated: ${optJson.summary.totalOptimizedDistanceKm} km`);
    assert(optJson.summary.fuelSavedLiters >= 0, `Estimated fuel saved: ${optJson.summary.fuelSavedLiters} L diesel`);
    assert(optJson.summary.co2SavedKg >= 0, `Estimated CO2 prevented: ${optJson.summary.co2SavedKg} kg`);
    assert(optJson.summary.compostYieldKg >= 0, `Estimated Mo Khata compost yield: ${optJson.summary.compostYieldKg} kg`);

    // Verify Wet Route -> Niladri Vihar MCC
    assert(optJson.wetRoute.facility.id === 'FAC-MCC-01', 'Wet stream route terminates at Niladri Vihar MCC');
    assert(optJson.wetRoute.facility.lat === 20.3245 && optJson.wetRoute.facility.lng === 85.8140, 'Niladri Vihar MCC coordinates accurate (20.3245, 85.8140)');
    if (optJson.wetRoute.stops.length > 0) {
      const finalStop = optJson.wetRoute.stops[optJson.wetRoute.stops.length - 1];
      assert(finalStop.type === 'facility', 'Wet route final stop is the MCC facility');
    }

    // Verify Dry Route -> Pokhariput MRF
    assert(optJson.dryRoute.facility.id === 'FAC-MRF-01', 'Dry stream route terminates at Pokhariput MRF');
    assert(optJson.dryRoute.facility.lat === 20.2540 && optJson.dryRoute.facility.lng === 85.8020, 'Pokhariput MRF coordinates accurate (20.2540, 85.8020)');
    if (optJson.dryRoute.stops.length > 0) {
      const finalStop = optJson.dryRoute.stops[optJson.dryRoute.stops.length - 1];
      assert(finalStop.type === 'facility', 'Dry route final stop is the MRF facility');
    }

    // TEST 5: GET /api/optimize-route with Zone Filter
    console.log('\n👉 [5/6] Testing Route Optimization with Zone Filter (?zone=North):');
    const zoneOptRes = await request('/api/optimize-route?zone=North');
    assert(zoneOptRes.statusCode === 200, 'GET /api/optimize-route?zone=North returns 200 OK');
    const zoneJson = JSON.parse(zoneOptRes.body);
    assert(zoneJson.zoneFilter === 'North', 'Zone filter correctly set to North');

    // TEST 6: POST /api/reset-bins (Reset to Healthy Levels)
    console.log('\n👉 [6/6] Testing Bin Reset to Healthy Levels (POST /api/reset-bins):');
    const resetRes = await request('/api/reset-bins', { method: 'POST' });
    assert(resetRes.statusCode === 200, 'POST /api/reset-bins returns 200 OK');
    const resetJson = JSON.parse(resetRes.body);
    assert(resetJson.success === true, 'Reset returns success: true');
    assert(resetJson.count === 12, 'All 12 bins reset');
    
    // Check all bins are normal/filling
    const afterResetBinsRes = await request('/api/bins');
    const afterResetJson = JSON.parse(afterResetBinsRes.body);
    const criticalAfterReset = afterResetJson.data.filter(b => b.fillLevel > 80);
    assert(criticalAfterReset.length === 0, 'Zero critical bins remain after reset (all healthy)');

    console.log(`\n====================================================`);
    console.log(`🏁 Stage 3 Verification Results: ${passed} / ${total} Tests Passed`);
    console.log(`====================================================`);
    if (passed === total) {
      console.log('🎉 ALL STAGE 3 REQUIREMENTS FULLY SATISFIED!');
      process.exit(0);
    } else {
      console.error('⚠️ Some tests failed.');
      process.exit(1);
    }

  } catch (err) {
    console.error('Stage 3 test failed with error:', err);
    process.exit(1);
  }
}

runStage3Tests();
