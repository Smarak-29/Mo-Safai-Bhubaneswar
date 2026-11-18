// Bhubaneswar Municipal Command Map & Route Optimizer (Leaflet.js)
let map;
let binMarkers = {};
let facilityMarkers = {};
let wetRoutePolyline = null;
let dryRoutePolyline = null;
let activeZone = 'all';
let isOptimizing = false;

// Real BMC Processing Facilities Coordinates
const FACILITIES_DATA = {
  MCC: {
    lat: 20.3245,
    lng: 85.8140,
    name: 'Niladri Vihar MCC (Mo Khata Unit)',
    nameOr: 'ନୀଳାଦ୍ରି ବିହାର ଏମସିସି (ମୋ ଖାତା କେନ୍ଦ୍ର)',
    stream: 'Wet Waste Destination',
    address: 'Niladri Vihar, Ward 14'
  },
  MRF: {
    lat: 20.2540,
    lng: 85.8020,
    name: 'Pokhariput MRF Facility',
    nameOr: 'ପୋଖରୀପୁଟ ଏମଆରଏଫ (ପୁନରୁଦ୍ଧାର କେନ୍ଦ୍ର)',
    stream: 'Dry Recyclable Destination',
    address: 'Pokhariput, Ward 62'
  }
};

// Initialize Map
function initMap() {
  const mapElement = document.getElementById('bhubaneswarMap');
  if (!mapElement) return;

  // Center on Bhubaneswar (20.2961° N, 85.8245° E)
  map = L.map('bhubaneswarMap', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([20.2961, 85.8245], 12);

  // High-contrast clean OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> | BMC Mo Safai'
  }).addTo(map);

  // Add Processing Facilities Pins
  addFacilityMarkers();

  // Load live bins immediately
  fetchAndRenderBins();

  // Periodic Telemetry Poll every 5 seconds
  setInterval(fetchAndRenderBins, 5000);
}

// Facility Custom Markers
function addFacilityMarkers() {
  // Niladri Vihar MCC (Wet Waste)
  const mccIcon = L.divIcon({
    className: 'facility-marker-icon',
    html: `
      <div class="facility-pin bg-emerald-700 text-white shadow-lg border-2 border-white flex items-center justify-center rounded-xl w-9 h-9" title="Niladri Vihar MCC">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.57-.88 1.78 1.78 0 0 0 .004-1.78l-4.04-6.84"/><path d="M20.2 9.5a1.8 1.8 0 0 0-.004-1.78L16.156 3.88a1.83 1.83 0 0 0-1.57-.88H9.42a1.8 1.8 0 0 0-1.57.88L3.81 10.74"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });

  facilityMarkers.MCC = L.marker([FACILITIES_DATA.MCC.lat, FACILITIES_DATA.MCC.lng], { icon: mccIcon })
    .addTo(map)
    .bindPopup(`
      <div class="p-1 font-sans">
        <div class="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>${FACILITIES_DATA.MCC.name}</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">${FACILITIES_DATA.MCC.address}</p>
        <div class="mt-2 text-[10px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-semibold border border-emerald-200 inline-block">
          Mo Khata Micro-Compost Center
        </div>
      </div>
    `);

  // Pokhariput MRF (Dry Waste)
  const mrfIcon = L.divIcon({
    className: 'facility-marker-icon',
    html: `
      <div class="facility-pin bg-blue-700 text-white shadow-lg border-2 border-white flex items-center justify-center rounded-xl w-9 h-9" title="Pokhariput MRF">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });

  facilityMarkers.MRF = L.marker([FACILITIES_DATA.MRF.lat, FACILITIES_DATA.MRF.lng], { icon: mrfIcon })
    .addTo(map)
    .bindPopup(`
      <div class="p-1 font-sans">
        <div class="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
          <span class="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>${FACILITIES_DATA.MRF.name}</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">${FACILITIES_DATA.MRF.address}</p>
        <div class="mt-2 text-[10px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-semibold border border-blue-200 inline-block">
          Material Recovery Facility (Dry Stream)
        </div>
      </div>
    `);
}

// Marker Icon Factory based on fillLevel
function createBinIcon(fillLevel, wasteStream) {
  let colorClass = 'bg-emerald-600';
  let pulseHtml = '';
  let borderClass = 'border-white';

  if (fillLevel >= 80) {
    colorClass = 'bg-rose-600';
    borderClass = 'border-rose-100';
    // Pulsing animation ripple ring for Critical Bins
    pulseHtml = '<span class="absolute -inset-1 rounded-full bg-rose-500 opacity-75 animate-ping"></span>';
  } else if (fillLevel >= 50) {
    colorClass = 'bg-amber-500';
    borderClass = 'border-amber-100';
  }

  const streamBadge = wasteStream === 'Wet' 
    ? '<span class="text-[8px] font-extrabold text-white">W</span>' 
    : '<span class="text-[8px] font-extrabold text-white">D</span>';

  return L.divIcon({
    className: 'custom-bin-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulseHtml}
        <div class="relative w-7 h-7 rounded-full ${colorClass} ${borderClass} border-2 shadow-md flex items-center justify-center text-white transition-all transform hover:scale-110">
          ${streamBadge}
        </div>
        <div class="absolute -bottom-4 bg-slate-900 text-white font-mono text-[9px] px-1 py-0.2 rounded shadow leading-tight">
          ${fillLevel}%
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

// Build popup content
function createPopupContent(bin) {
  const streamBadgeClass = bin.wasteStream === 'Wet' 
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
    : 'bg-blue-100 text-blue-800 border-blue-200';
  
  const statusColor = bin.fillLevel >= 80 ? 'text-rose-600' : (bin.fillLevel >= 50 ? 'text-amber-600' : 'text-emerald-600');
  const barColor = bin.fillLevel >= 80 ? 'bg-rose-600' : (bin.fillLevel >= 50 ? 'bg-amber-500' : 'bg-emerald-600');

  return `
    <div class="p-2 font-sans min-w-[210px]">
      <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
        <span class="font-bold text-xs text-slate-900 tracking-tight">${bin.binId}</span>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${streamBadgeClass}">
          ${bin.wasteStream} Waste
        </span>
      </div>
      <div class="text-xs text-slate-600 space-y-1">
        <div>Ward ${bin.wardNumber}: <strong>${bin.wardName}</strong></div>
        <div class="text-slate-400 text-[11px]">Zone: <strong>${bin.zone}</strong></div>
        <div class="flex items-center justify-between text-xs pt-1.5">
          <span class="text-slate-500 font-medium">Fill Status:</span>
          <span class="font-bold ${statusColor}">${bin.fillLevel}% (${bin.status})</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div class="h-full rounded-full ${barColor}" style="width: ${bin.fillLevel}%"></div>
        </div>
      </div>
      <div class="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
        <span>GPS: ${bin.lat.toFixed(4)}, ${bin.lng.toFixed(4)}</span>
        <span>${new Date(bin.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  `;
}

// Fetch and render bins
async function fetchAndRenderBins() {
  try {
    const res = await fetch('/api/bins');
    const json = await res.json();
    if (!json.success || !json.data) return;

    let criticalCount = 0;

    json.data.forEach((bin) => {
      // Check zone filter
      const matchesZone = (activeZone === 'all' || activeZone === 'All Zones' || bin.zone === activeZone);

      if (bin.fillLevel >= 80) {
        criticalCount++;
      }

      if (binMarkers[bin.binId]) {
        // Update existing marker
        binMarkers[bin.binId].setIcon(createBinIcon(bin.fillLevel, bin.wasteStream));
        binMarkers[bin.binId].setPopupContent(createPopupContent(bin));
        if (matchesZone) {
          if (!map.hasLayer(binMarkers[bin.binId])) {
            binMarkers[bin.binId].addTo(map);
          }
        } else {
          if (map.hasLayer(binMarkers[bin.binId])) {
            map.removeLayer(binMarkers[bin.binId]);
          }
        }
      } else {
        // Create new marker
        const marker = L.marker([bin.lat, bin.lng], {
          icon: createBinIcon(bin.fillLevel, bin.wasteStream)
        }).bindPopup(createPopupContent(bin));

        if (matchesZone) {
          marker.addTo(map);
        }
        binMarkers[bin.binId] = marker;
      }
    });

    // Update critical badge in UI
    const critBadge = document.getElementById('criticalBinsCounter');
    if (critBadge) {
      critBadge.textContent = criticalCount;
    }
  } catch (err) {
    console.warn('[Map Live Telemetry] Poll warning:', err.message);
  }
}

// Zone Filter Handler
function filterZone(zone) {
  activeZone = zone;

  document.querySelectorAll('.zone-pill-btn').forEach((btn) => {
    if (btn.getAttribute('data-zone') === zone) {
      btn.className = "zone-pill-btn px-3 py-1.5 rounded-lg bg-civic-700 text-white font-medium text-xs whitespace-nowrap transition-all shadow-xs";
    } else {
      btn.className = "zone-pill-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-xs whitespace-nowrap transition-all";
    }
  });

  // Re-filter marker visibility
  fetchAndRenderBins();

  // If routes are drawn, re-optimize for the selected zone
  if (wetRoutePolyline || dryRoutePolyline) {
    optimizeTruckRoutes();
  }
}

// Simulate Overflow Spike (POST /api/simulate-spike)
async function triggerOverflowSpike() {
  const btn = document.getElementById('btnSimulateSpike');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/simulate-spike', { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      showMapToast((currentLanguage === 'or') 
        ? "ଅତିରିକ୍ତ ଅଳିଆ ସ୍ଥିତି ସୃଷ୍ଟି ହେଲା! ୩-୪ଟି ଡଷ୍ଟବିନ୍ ସଙ୍କଟଜନକ ସ୍ତରକୁ ଆସିଲା।" 
        : "Overflow spike simulated! 3-4 bins surged to critical levels.");
      await fetchAndRenderBins();
      // Auto-trigger route optimization to showcase live response
      optimizeTruckRoutes();
    }
  } catch (err) {
    console.error('Spike error:', err);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Reset All Bins (POST /api/reset-bins)
async function triggerResetBins() {
  const btn = document.getElementById('btnResetBins');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/reset-bins', { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      showMapToast((currentLanguage === 'or') 
        ? "ସମସ୍ତ ସ୍ମାର୍ଟ ଡଷ୍ଟବିନ୍ ସ୍ୱାଭାବିକ ସ୍ତରକୁ ଫେରିଆସିଲା।" 
        : "All smart bins successfully reset to normal levels.");
      
      // Clear route polylines
      clearRoutes();
      await fetchAndRenderBins();
      resetImpactSummary();
    }
  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Optimize Truck Routes (GET /api/optimize-route)
async function optimizeTruckRoutes() {
  if (isOptimizing) return;
  isOptimizing = true;

  const btn = document.getElementById('btnOptimizeRoutes');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> <span>${translations[currentLanguage]?.optimizing_label || 'Calculating optimal routes...'}</span>`;

  try {
    const zoneQuery = (activeZone !== 'all' && activeZone !== 'All Zones') ? `?zone=${encodeURIComponent(activeZone)}` : '';
    const res = await fetch(`/api/optimize-route${zoneQuery}`);
    const data = await res.json();

    if (data.success) {
      renderOptimizedRoutes(data);
      updateImpactMetrics(data.summary);
      renderDriverManifest(data.wetRoute, data.dryRoute);
      showMapToast((currentLanguage === 'or') 
        ? "ଉଭୟ ସଫେଇ ରୁଟ୍ ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!" 
        : "Dual-stream routes optimized successfully!");
    }
  } catch (err) {
    console.error('Route optimization error:', err);
    alert('Failed to calculate optimal routes: ' + err.message);
  } finally {
    isOptimizing = false;
    btn.disabled = false;
    btn.innerHTML = originalText;
    lucide.createIcons();
  }
}

// Render Leaflet Polylines for Dual-Stream Routes
function renderOptimizedRoutes(data) {
  clearRoutes();

  const allPoints = [];

  // 1. Wet Waste Route -> Solid Civic Green
  if (data.wetRoute && data.wetRoute.coordinates.length > 1) {
    wetRoutePolyline = L.polyline(data.wetRoute.coordinates, {
      color: '#15803D',
      weight: 5,
      opacity: 0.9,
      lineJoin: 'round'
    }).addTo(map);

    wetRoutePolyline.bindPopup(`
      <div class="p-1 font-sans">
        <strong class="text-emerald-800 text-xs">🟢 Wet Waste Truck Route</strong>
        <p class="text-[11px] text-slate-600 mt-0.5">${data.wetRoute.stopCount} stops • ${data.wetRoute.distanceKm} km</p>
        <p class="text-[10px] text-emerald-700 font-semibold mt-1">Destination: Niladri Vihar MCC</p>
      </div>
    `);

    data.wetRoute.coordinates.forEach(pt => allPoints.push(pt));
  }

  // 2. Dry Waste Route -> Dashed Blue
  if (data.dryRoute && data.dryRoute.coordinates.length > 1) {
    dryRoutePolyline = L.polyline(data.dryRoute.coordinates, {
      color: '#2563EB',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
      lineJoin: 'round'
    }).addTo(map);

    dryRoutePolyline.bindPopup(`
      <div class="p-1 font-sans">
        <strong class="text-blue-800 text-xs">🔵 Dry Waste Truck Route</strong>
        <p class="text-[11px] text-slate-600 mt-0.5">${data.dryRoute.stopCount} stops • ${data.dryRoute.distanceKm} km</p>
        <p class="text-[10px] text-blue-700 font-semibold mt-1">Destination: Pokhariput MRF</p>
      </div>
    `);

    data.dryRoute.coordinates.forEach(pt => allPoints.push(pt));
  }

  // Fit map bounds to show full optimized route
  if (allPoints.length > 0) {
    map.fitBounds(allPoints, { padding: [50, 50], maxZoom: 14 });
  }
}

// Clear existing polylines
function clearRoutes() {
  if (wetRoutePolyline) {
    map.removeLayer(wetRoutePolyline);
    wetRoutePolyline = null;
  }
  if (dryRoutePolyline) {
    map.removeLayer(dryRoutePolyline);
    dryRoutePolyline = null;
  }
}

// Update Impact Metric Cards
function updateImpactMetrics(summary) {
  document.getElementById('metricCriticalCount').textContent = summary.totalCriticalBins;
  document.getElementById('metricDistance').textContent = `${summary.totalOptimizedDistanceKm} km`;
  document.getElementById('metricSavedDist').textContent = `(-${summary.distanceSavedKm} km vs sweep)`;
  document.getElementById('metricFuelSaved').textContent = `${summary.fuelSavedLiters} L (${summary.co2SavedKg} kg CO₂)`;
  document.getElementById('metricCompost').textContent = `${summary.compostYieldKg} kg`;

  // Reveal impact section
  const section = document.getElementById('impactSummarySection');
  if (section) section.classList.remove('hidden');
}

// Reset Impact Cards
function resetImpactSummary() {
  document.getElementById('metricCriticalCount').textContent = '0';
  document.getElementById('metricDistance').textContent = '0 km';
  document.getElementById('metricSavedDist').textContent = '0 km saved';
  document.getElementById('metricFuelSaved').textContent = '0 L (0 kg CO₂)';
  document.getElementById('metricCompost').textContent = '0 kg';

  const manifest = document.getElementById('driverManifestSection');
  if (manifest) manifest.classList.add('hidden');
}

// Render Turn-by-Turn Driver Manifest
function renderDriverManifest(wetRoute, dryRoute) {
  const manifestSection = document.getElementById('driverManifestSection');
  if (!manifestSection) return;
  manifestSection.classList.remove('hidden');

  // Wet Route Stops
  const wetContainer = document.getElementById('wetRouteStopsList');
  if (wetContainer) {
    if (wetRoute.stops.length === 0) {
      wetContainer.innerHTML = `<p class="text-xs text-slate-400 py-2">No critical wet bins requiring pickup in this zone.</p>`;
    } else {
      wetContainer.innerHTML = wetRoute.stops.map((stop, i) => {
        if (stop.type === 'facility') {
          return `
            <div class="flex items-start gap-2.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
              <span class="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">✓</span>
              <div>
                <strong class="text-emerald-900">${stop.name}</strong>
                <p class="text-[11px] text-emerald-700">Final Leg: +${stop.legDistanceKm} km • Mo Khata Processing</p>
              </div>
            </div>
          `;
        }
        return `
          <div class="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span class="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">${stop.stopNumber}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <strong>${stop.binId}</strong>
                <span class="font-bold text-rose-600">${stop.fillLevel}% Full</span>
              </div>
              <p class="text-[11px] text-slate-500">Ward ${stop.wardNumber}: ${stop.wardName} (${stop.legDistanceKm > 0 ? '+' + stop.legDistanceKm + ' km' : 'Start'})</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Dry Route Stops
  const dryContainer = document.getElementById('dryRouteStopsList');
  if (dryContainer) {
    if (dryRoute.stops.length === 0) {
      dryContainer.innerHTML = `<p class="text-xs text-slate-400 py-2">No critical dry bins requiring pickup in this zone.</p>`;
    } else {
      dryContainer.innerHTML = dryRoute.stops.map((stop, i) => {
        if (stop.type === 'facility') {
          return `
            <div class="flex items-start gap-2.5 p-2 bg-blue-50 rounded-lg border border-blue-200 text-xs">
              <span class="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">✓</span>
              <div>
                <strong class="text-blue-900">${stop.name}</strong>
                <p class="text-[11px] text-blue-700">Final Leg: +${stop.legDistanceKm} km • Recycling Center</p>
              </div>
            </div>
          `;
        }
        return `
          <div class="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span class="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">${stop.stopNumber}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <strong>${stop.binId}</strong>
                <span class="font-bold text-rose-600">${stop.fillLevel}% Full</span>
              </div>
              <p class="text-[11px] text-slate-500">Ward ${stop.wardNumber}: ${stop.wardName} (${stop.legDistanceKm > 0 ? '+' + stop.legDistanceKm + ' km' : 'Start'})</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// 1-Click BMC 1929 Grievance Ticket Resolution
async function resolveTicket(ticketId, btnElement) {
  if (!ticketId) return;
  try {
    if (btnElement) {
      btnElement.disabled = true;
      btnElement.innerHTML = `
        <svg class="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Resolving...</span>
      `;
    }

    const res = await fetch(`/api/tickets/${ticketId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await res.json();
    if (data.success) {
      if (btnElement) {
        const ticketRow = btnElement.closest('.ticket-item');
        if (ticketRow) {
          const statusBadge = ticketRow.querySelector('.ticket-status-badge');
          if (statusBadge) {
            statusBadge.textContent = (typeof currentLanguage !== 'undefined' && currentLanguage === 'or') ? 'ସମାଧାନ ହୋଇଛି' : 'RESOLVED';
            statusBadge.className = 'ticket-status-badge px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200';
          }
          const iconWrapper = ticketRow.querySelector('.w-7.h-7');
          if (iconWrapper) {
            iconWrapper.className = 'w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0';
            iconWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-700"><polyline points="20 6 9 17 4 12"/></svg>`;
          }
        }
        btnElement.outerHTML = `
          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Resolved</span>
          </span>
        `;
      }
      const toastMsg = (typeof currentLanguage !== 'undefined' && currentLanguage === 'or')
        ? `ଅଭିଯୋଗ ଟିକେଟ୍ ସଫଳତାର ସହ ସମାଧାନ ହେଲା! ବିଏମସି ସଫେଇ ରେକର୍ଡ ଅପଡେଟ୍ ହୋଇଛି।`
        : `BMC 1929 Ticket marked as Resolved! Sanitation crew closed report.`;
      showMapToast(toastMsg);
    } else {
      alert(data.error || 'Failed to resolve ticket');
      if (btnElement) {
        btnElement.disabled = false;
        btnElement.innerHTML = `<span>Mark Resolved</span>`;
      }
    }
  } catch (err) {
    console.error('Error resolving ticket:', err);
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = `<span>Mark Resolved</span>`;
    }
  }
}

// Toast Notification
function showMapToast(msg) {
  const toast = document.getElementById('mapToast');
  if (!toast) return;
  document.getElementById('mapToastMsg').textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 4000);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});
