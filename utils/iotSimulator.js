const Bin = require('../models/Bin');

const INITIAL_BINS = [
  // Ward 1 - Patia (North Zone)
  {
    binId: 'BMC-PAT-01',
    wardNumber: 1,
    wardName: 'Patia',
    zone: 'North',
    lat: 20.3533,
    lng: 85.8189,
    wasteStream: 'Wet',
    fillLevel: 42,
    status: 'Normal'
  },
  {
    binId: 'BMC-PAT-02',
    wardNumber: 1,
    wardName: 'Patia',
    zone: 'North',
    lat: 20.3582,
    lng: 85.8241,
    wasteStream: 'Dry',
    fillLevel: 68,
    status: 'Filling'
  },
  // Ward 26 - Jaydev Vihar (North Zone)
  {
    binId: 'BMC-JDV-01',
    wardNumber: 26,
    wardName: 'Jaydev Vihar',
    zone: 'North',
    lat: 20.3012,
    lng: 85.8214,
    wasteStream: 'Wet',
    fillLevel: 55,
    status: 'Filling'
  },
  {
    binId: 'BMC-JDV-02',
    wardNumber: 26,
    wardName: 'Jaydev Vihar',
    zone: 'North',
    lat: 20.2987,
    lng: 85.8190,
    wasteStream: 'Dry',
    fillLevel: 30,
    status: 'Normal'
  },
  // Ward 27 - Saheed Nagar (South-East Zone)
  {
    binId: 'BMC-SHN-01',
    wardNumber: 27,
    wardName: 'Saheed Nagar',
    zone: 'South-East',
    lat: 20.2882,
    lng: 85.8455,
    wasteStream: 'Wet',
    fillLevel: 84,
    status: 'Critical'
  },
  {
    binId: 'BMC-SHN-02',
    wardNumber: 27,
    wardName: 'Saheed Nagar',
    zone: 'South-East',
    lat: 20.2915,
    lng: 85.8430,
    wasteStream: 'Dry',
    fillLevel: 45,
    status: 'Normal'
  },
  // Ward 39 - Old Town / Lingaraj (South-West Zone)
  {
    binId: 'BMC-OLD-01',
    wardNumber: 39,
    wardName: 'Old Town / Lingaraj',
    zone: 'South-West',
    lat: 20.2390,
    lng: 85.8340,
    wasteStream: 'Wet',
    fillLevel: 72,
    status: 'Filling'
  },
  {
    binId: 'BMC-OLD-02',
    wardNumber: 39,
    wardName: 'Old Town / Lingaraj',
    zone: 'South-West',
    lat: 20.2435,
    lng: 85.8362,
    wasteStream: 'Dry',
    fillLevel: 25,
    status: 'Normal'
  },
  // Ward 47 - Bapuji Nagar (South-East Zone)
  {
    binId: 'BMC-BPJ-01',
    wardNumber: 47,
    wardName: 'Bapuji Nagar',
    zone: 'South-East',
    lat: 20.2642,
    lng: 85.8367,
    wasteStream: 'Wet',
    fillLevel: 88,
    status: 'Critical'
  },
  {
    binId: 'BMC-BPJ-02',
    wardNumber: 47,
    wardName: 'Bapuji Nagar',
    zone: 'South-East',
    lat: 20.2671,
    lng: 85.8349,
    wasteStream: 'Dry',
    fillLevel: 62,
    status: 'Filling'
  },
  // Ward 49 - Khandagiri (South-West Zone)
  {
    binId: 'BMC-KHD-01',
    wardNumber: 49,
    wardName: 'Khandagiri',
    zone: 'South-West',
    lat: 20.2605,
    lng: 85.7876,
    wasteStream: 'Wet',
    fillLevel: 35,
    status: 'Normal'
  },
  {
    binId: 'BMC-KHD-02',
    wardNumber: 49,
    wardName: 'Khandagiri',
    zone: 'South-West',
    lat: 20.2580,
    lng: 85.7898,
    wasteStream: 'Dry',
    fillLevel: 78,
    status: 'Filling'
  }
];

const seedBins = async () => {
  try {
    const count = await Bin.countDocuments();
    if (count === 0) {
      await Bin.insertMany(INITIAL_BINS);
      console.log(`[IoT Simulator] Seeded 12 real Bhubaneswar smart bins across 6 wards.`);
    } else {
      console.log(`[IoT Simulator] Found ${count} existing bins in database.`);
    }
  } catch (err) {
    console.error(`[IoT Simulator] Error seeding bins: ${err.message}`);
  }
};

const startIoTSimulator = () => {
  seedBins().then(() => {
    // Run every 6 seconds
    setInterval(async () => {
      try {
        const bins = await Bin.find();
        if (!bins || bins.length === 0) return;

        // Pick 2 to 3 random bins to update telemetry
        const countToUpdate = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < countToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * bins.length);
          const bin = bins[randomIndex];

          // Increment fill level slightly
          const increment = Math.floor(Math.random() * 5) + 2; // +2 to +6%
          let newFill = bin.fillLevel + increment;

          // If bin overflows 98%, simulate BMC sanitation truck clearance
          if (newFill > 98) {
            newFill = Math.floor(Math.random() * 15) + 5; // Emptied to 5-20%
            console.log(`[IoT Telemetry] 🚛 BMC Sanitation truck cleared ${bin.binId} (${bin.wardName}). Reset to ${newFill}%.`);
          }

          let newStatus = 'Normal';
          if (newFill >= 80) {
            newStatus = 'Critical';
          } else if (newFill >= 50) {
            newStatus = 'Filling';
          }

          bin.fillLevel = newFill;
          bin.status = newStatus;
          bin.lastUpdated = new Date();
          await bin.save();
        }
      } catch (err) {
        console.error(`[IoT Simulator] Telemetry loop error: ${err.message}`);
      }
    }, 6000);
    console.log('[IoT Simulator] Telemetry streaming active (6-second pulse interval).');
  });
};

module.exports = {
  seedBins,
  startIoTSimulator,
  INITIAL_BINS
};
