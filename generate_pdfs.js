const fs = require('fs');
const path = require('path');

function createPdf(title, subtitle, outputPath) {
  const streamData = `BT\n/F1 20 Tf\n50 720 Td\n(${title}) Tj\n/F1 12 Tf\n0 -30 Td\n(${subtitle}) Tj\n/F1 10 Tf\n0 -25 Td\n(Candidate: Harsath Ali | Portfolio Verification Document) Tj\nET`;
  const streamLength = Buffer.byteLength(streamData);

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj\n`;

  let offset = 9; // header length '%PDF-1.4\n'
  const offsets = [0];

  offsets.push(offset);
  offset += Buffer.byteLength(obj1);

  offsets.push(offset);
  offset += Buffer.byteLength(obj2);

  offsets.push(offset);
  offset += Buffer.byteLength(obj3);

  offsets.push(offset);
  offset += Buffer.byteLength(obj4);

  offsets.push(offset);
  offset += Buffer.byteLength(obj5);

  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  const startxref = offset;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  const pdfBuffer = Buffer.concat([
    Buffer.from('%PDF-1.4\n'),
    Buffer.from(obj1),
    Buffer.from(obj2),
    Buffer.from(obj3),
    Buffer.from(obj4),
    Buffer.from(obj5),
    Buffer.from(xref),
    Buffer.from(trailer)
  ]);

  const targetDir = path.dirname(outputPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log('Successfully generated:', outputPath);
}

// Generate resume
// Generate resume
createPdf('HARSATH ALI A - RESUME', 'ASPIRING SOFTWARE DEVELOPER | FRONTEND DEVELOPER | +91 7339454474', path.resolve(__dirname, 'resume/Harsath_Ali_Resume.pdf'));

// Generate certificates
const certs = [
  { name: 'codealpha-internship-certificate.pdf', title: 'CodeAlpha - Frontend Developer Internship Certificate', sub: 'Certificate of Online Internship Completion' },
  { name: 'skill-india-unlocking-ai-for-everyone.pdf', title: 'Skill India - Unlocking AI for Everyone', sub: 'Certificate of Competency in Artificial Intelligence' },
  { name: 'skill-india-ai-for-all.pdf', title: 'Skill India - AI for All', sub: 'AI Literacy and Foundation Program' },
  { name: 'ibm-getting-started-generative-ai.pdf', title: 'IBM SkillsBuild - Getting Started with Generative AI', sub: 'IBM Generative AI Specialist Credential' },
  { name: 'askan-technologies-iv-certificate.pdf', title: 'ASKAN Technologies Pvt Ltd - Industrial Visit', sub: 'Certificate of Industry Exposure & Technical Training' }
];

certs.forEach(c => {
  createPdf(c.title, c.sub, path.resolve(__dirname, 'assets/certificates', c.name));
});
