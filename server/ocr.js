import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs';

let workerInstance = null;

async function getWorker() {
  if (!workerInstance) {
    workerInstance = await createWorker('eng');
  }
  return workerInstance;
}

/**
 * Perform real OCR on an image file (PNG, JPG, JPEG, WEBP)
 * @param {string} filePath - Absolute path to the image
 * @returns {Promise<{rawText: string, confidence: number, extracted: object}>}
 */
export async function performOcr(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return { rawText: '', confidence: 0, extracted: {} };
  }

  const ext = path.extname(filePath).toLowerCase();
  const isImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);

  if (!isImage) {
    // If not direct raster image (e.g. PDF), return empty rawText to let caller use text extraction or defaults
    return { rawText: '', confidence: 0, extracted: {} };
  }

  try {
    const worker = await getWorker();
    const ret = await worker.recognize(filePath);
    const rawText = ret?.data?.text || '';
    const confidence = ret?.data?.confidence || 0;

    const extracted = parseExtractedOcrData(rawText);
    return { rawText, confidence, extracted };
  } catch (err) {
    console.warn('[OCR Engine] Warning during Tesseract OCR execution:', err.message);
    return { rawText: '', confidence: 0, extracted: {} };
  }
}

/**
 * Intelligent regex and heuristic parser for academic transcripts and certifications
 * @param {string} text - Raw OCR text
 * @returns {object} Extracted structured fields
 */
export function parseExtractedOcrData(text) {
  if (!text || typeof text !== 'string') return {};

  const result = {};

  // 1. CGPA / SGPA detection
  const cgpaMatch = text.match(/(?:c\.?g\.?p\.?a\.?|cumulative\s*(?:grade\s*)?(?:point\s*)?(?:average|gpa))\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i)
    || text.match(/([0-9]\.[0-9]{1,2})\s*\/\s*(?:10(?:\.0)?|4(?:\.0)?)/);
  if (cgpaMatch) {
    const val = parseFloat(cgpaMatch[1]);
    if (val >= 1.0 && val <= 10.0) {
      result.cgpa = val;
    }
  }

  const sgpaMatch = text.match(/(?:s\.?g\.?p\.?a\.?|semester\s*(?:grade\s*)?(?:point\s*)?(?:average|gpa))\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (sgpaMatch) {
    const val = parseFloat(sgpaMatch[1]);
    if (val >= 1.0 && val <= 10.0) {
      result.sgpa = val;
    }
  }

  // 2. Register / Roll Number
  const regMatch = text.match(/(?:register\s*no|reg\s*no|roll\s*no|student\s*id)\s*[:=-]?\s*([A-Za-z0-9_-]{5,22})/i);
  if (regMatch) {
    result.registerNumber = regMatch[1].trim();
  }

  // 3. Student Name
  const nameMatch = text.match(/(?:student\s*name|name\s*of\s*the\s*candidate|candidate\s*name)\s*[:=-]?\s*([A-Za-z\t .]{3,35})/i);
  if (nameMatch) {
    const raw = nameMatch[1].trim();
    if (!/semester|marksheet|grade|examination|university|college|department/i.test(raw)) {
      result.studentName = raw;
    }
  }

  // 4. College / University
  const collegeHeaderMatch = text.match(/[^\r\n]*(?:institute\s*of\s*technology|engineering\s*college|university|institute\s*of\s*science)[^\r\n]*/i);
  if (collegeHeaderMatch) {
    result.college = collegeHeaderMatch[0].trim();
  }

  // 5. Degree
  const degreeMatch = text.match(/\b(?:b\.?tech\.?|b\.?e\.?|bachelor\s*of\s*(?:engineering|technology)|m\.?tech\.?|m\.?e\.?|b\.?sc\.?|m\.?ca\.?)\b(?:\s*in\s*[A-Za-z\t &]+)?/i);
  if (degreeMatch) {
    result.degree = degreeMatch[0].trim();
  }

  // 6. Issuer identification (for certificates)
  const issuers = [
    { name: 'Amazon Web Services', regex: /aws|amazon\s*web\s*services/i },
    { name: 'Google Cloud', regex: /google\s*cloud|google\s*developers/i },
    { name: 'Coursera', regex: /coursera/i },
    { name: 'DeepLearning.AI', regex: /deeplearning\.ai/i },
    { name: 'Microsoft', regex: /microsoft\s*(?:certified|azure)?/i },
    { name: 'Oracle', regex: /oracle/i },
    { name: 'Meta', regex: /meta\s*front-end|meta\s*back-end/i },
    { name: 'IBM', regex: /ibm/i },
    { name: 'HackerRank', regex: /hackerrank/i }
  ];

  for (const item of issuers) {
    if (item.regex.test(text)) {
      result.issuer = item.name;
      break;
    }
  }

  // 7. Skills extraction
  const skillKeywords = [
    'Python', 'React', 'Node.js', 'JavaScript', 'TypeScript', 'Docker',
    'Kubernetes', 'AWS', 'Machine Learning', 'Deep Learning', 'PyTorch',
    'TensorFlow', 'Data Structures', 'Algorithms', 'SQL', 'MongoDB',
    'Cybersecurity', 'Cloud Computing', 'Git', 'Java', 'C++', 'FastAPI', 'Figma'
  ];

  const detectedSkills = [];
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  skillKeywords.forEach(skill => {
    const escaped = escapeRegex(skill);
    // Boundary check matching whitespace, start/end of line, or common delimiters
    const regex = new RegExp(`(?:^|[\\s,;()\\[\\]\\/])${escaped}(?=[\\s,;()\\[\\]\\/]|$)`, 'i');
    if (regex.test(text)) {
      detectedSkills.push(skill);
    }
  });

  if (detectedSkills.length > 0) {
    result.skills = detectedSkills;
  }

  // 8. License / Credential ID
  const credMatch = text.match(/(?:credential\s*id|license\s*number|certificate\s*id|id)\s*[:=-]?\s*([A-Za-z0-9_-]{6,30})/i);
  if (credMatch) {
    result.credentialId = credMatch[1].trim();
  }

  return result;
}
