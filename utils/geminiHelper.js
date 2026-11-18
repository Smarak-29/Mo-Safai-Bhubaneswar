require('dotenv').config({ override: true });
try { require('dns').setDefaultResultOrder('ipv4first'); } catch (e) {}
const { GoogleGenAI } = require('@google/genai');

// Predefined verified BMC civic waste samples for 1-click test buttons
const SAMPLES = {
  wet: {
    wasteCategory: 'Wet (Biodegradable)',
    binColor: 'Green Bin',
    isOverflowing: false,
    drainClogRisk: false,
    instructionEn: 'Dispose kitchen scraps and vegetable peels into the Green Bin for BMC Mo Khata organic compost processing.',
    instructionOr: 'ବିଏମସି ମୋ ଖାତା ଜୈବିକ ଖତ ପ୍ରସ୍ତୁତି ପାଇଁ ପନିପରିବା ଚୋପା ଏବଂ ଖାଦ୍ୟ ବର୍ଜ୍ୟବସ୍ତୁକୁ ସବୁଜ ଡଷ୍ଟବିନରେ ପକାନ୍ତୁ।',
    confidence: '97%'
  },
  overflowing: {
    wasteCategory: 'Dry (Recyclable)',
    binColor: 'Blue Bin',
    isOverflowing: true,
    drainClogRisk: true,
    instructionEn: 'CRITICAL: Overflowing roadside bin detected spilling onto the street. An automated BMC 1929 grievance ticket has been generated for priority truck dispatch.',
    instructionOr: 'ଜରୁରୀ: ରାସ୍ତାକଡ଼ ଡଷ୍ଟବିନ୍ ଭରି ଉଛୁଳୁଥିବା ଚିହ୍ନଟ ହୋଇଛି। ତୁରନ୍ତ ସଫେଇ ଗାଡ଼ି ପଠାଇବା ପାଇଁ ସ୍ୱୟଂଚାଳିତ ବିଏମସି ୧୯୨୯ ଅଭିଯୋଗ ଟିକେଟ୍ ଦାଖଲ କରାଗଲା।',
    confidence: '99%'
  },
  temple: {
    wasteCategory: 'Temple Floral Waste',
    binColor: 'Temple Compost',
    isOverflowing: false,
    drainClogRisk: false,
    instructionEn: 'Sacred temple offerings and flower garlands (Nirmalya) must not be mixed with plastic. Place into the Temple Compost bin for holy bio-fertilizer.',
    instructionOr: 'ମନ୍ଦିରର ପବିତ୍ର ଫୁଲ ଚନ୍ଦନ ଓ ନିର୍ମାଲ୍ୟକୁ ପ୍ଲାଷ୍ଟିକ୍ ସହିତ ମିଶାନ୍ତୁ ନାହିଁ। ଏହାକୁ ପବିତ୍ର ଜୈବିକ ଖତ ପାଇଁ ସ୍ୱତନ୍ତ୍ର କମ୍ପୋଷ୍ଟ ପାତ୍ରରେ ରଖନ୍ତୁ।',
    confidence: '95%'
  },
  dry: {
    wasteCategory: 'Dry (Recyclable)',
    binColor: 'Blue Bin',
    isOverflowing: false,
    drainClogRisk: false,
    instructionEn: 'Rinse and flatten clean plastic bottles or packaging and place them in the Blue Bin for recycling.',
    instructionOr: 'ପୁନଃଚକ୍ରଣ ପାଇଁ ପରିଷ୍କାର ପ୍ଲାଷ୍ଟିକ୍ ବୋତଲ କିମ୍ବା ପ୍ୟାକେଟକୁ ଚେପା କରି ନୀଳ ଡଷ୍ଟବିନରେ ରଖନ୍ତୁ।',
    confidence: '94%'
  }
};

/**
 * Analyze waste image using Gemini Vision via official @google/genai SDK
 * @param {Buffer} imageBuffer - Raw image buffer from Multer
 * @param {string} mimeType - e.g. 'image/jpeg', 'image/png'
 * @param {string} sampleType - Optional preset ('wet', 'overflowing', 'temple', 'dry')
 */
async function analyzeWasteImage({ imageBuffer, mimeType = 'image/jpeg', sampleType }) {
  // If explicitly selected one of the 4 quick demo presets
  if (sampleType && SAMPLES[sampleType]) {
    return { ...SAMPLES[sampleType], source: 'demo_sample' };
  }

  // Real image upload path: Must analyze with Gemini Vision
  if (!imageBuffer) {
    throw new Error('No image file or demo sample received for analysis.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    const errMsg = 'GEMINI_API_KEY is not defined in process.env or .env file.';
    console.error(`[Gemini Vision Error] ${errMsg}`);
    throw new Error(errMsg);
  }

  try {
    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });

    const prompt = `You are the Bhubaneswar Municipal Corporation (BMC) AI Smart Waste Segregation & Sanitation Assistant for Odisha, India.
Analyze the uploaded photo and return ONLY a valid JSON object (no markdown, no backticks) with these exact fields:
{
  "wasteCategory": "Wet (Biodegradable)" | "Dry (Recyclable)" | "Hazardous / E-Waste" | "Temple Floral Waste",
  "binColor": "Green Bin" | "Blue Bin" | "Red/Hazardous Bin" | "Temple Compost",
  "isOverflowing": boolean,
  "drainClogRisk": boolean,
  "instructionEn": "Clear 1-2 sentence disposal or civic instruction in natural English.",
  "instructionOr": "Accurate, natural translation of the instruction in authentic Odia script (ଓଡ଼ିଆ).",
  "confidence": "e.g. 96%"
}

Special BMC Rules:
1. Temple City Context: If the image shows flower garlands, bel leaves, or temple puja items, categorize as "Temple Floral Waste" with binColor "Temple Compost".
2. If plastic items/bottles/packets are near an open roadside drain/nallah, set drainClogRisk to true (monsoon flood hazard).
3. If a roadside bin is overflowing, or garbage is dumped on the street/footpath, set isOverflowing to true.
4. If plastic bottles, containers, paper, or dry packaging are shown, categorize as "Dry (Recyclable)" with binColor "Blue Bin".
5. If kitchen food, vegetable/fruit scraps, or organic peels are shown, categorize as "Wet (Biodegradable)" with binColor "Green Bin".`;

    const base64Data = imageBuffer.toString('base64');
    console.log(`[Gemini Vision] Invoking Gemini Vision with image (${mimeType}, size: ${imageBuffer.length} bytes)...`);

    let response;
    let selectedModel = process.env.GEMINI_MODEL || 'gemini-robotics-er-2-preview';

    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Data
            }
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });
    } catch (modelErr) {
      // Fallback between gemini-3.8-flash and gemini-2.5-flash based on account availability
      const fallbackModel = 'gemini-robotics-er-2-preview';
      console.log(`[Gemini Vision] Model ${selectedModel} returned notice, trying ${fallbackModel}...`);
      selectedModel = fallbackModel;
      response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Data
            }
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });
    }

    const responseText = response.text ? response.text.trim() : '';
    if (!responseText) {
      throw new Error('Gemini Vision returned an empty text response.');
    }

    const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log(`[Gemini Vision Success (${selectedModel})] Category: "${parsed.wasteCategory}", Bin: "${parsed.binColor}", Overflowing: ${parsed.isOverflowing}`);
    return { ...parsed, source: selectedModel };

  } catch (err) {
    console.error('[Gemini Vision Error]', err);
    throw new Error(`Gemini Vision analysis failed: ${err.message || err}`);
  }
}

module.exports = {
  analyzeWasteImage,
  SAMPLES
};
