// ملف تسليم السيمنار الحادي عشر — مطابق للمستند الأصلي
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const S = require('./submission_lib');

const out = process.argv[2] || 'submission.docx';
const c = [];

// ── العنوان ────────────────────────────────────────────────────────────────
c.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 260, line: 320 },
    children: [
      new TextRun({
        text: 'Seminar 11: Agents and Future Directions',
        font: S.FONT_EN, size: 30, bold: true, color: S.C.black,
      }),
    ],
  })
);

// ── المُقدِّم والتاريخ ───────────────────────────────────────────────────────
c.push(S.arRight('صديق ابراهيم على كمبال', { bold: true, color: S.C.red, after: 80 }));
c.push(S.arRight('السبت 4 يوليو 2026م', { bold: true, color: S.C.blue, after: 300 }));

// ── العنوان الفرعي ─────────────────────────────────────────────────────────
c.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 260, line: 320 },
    children: [
      new TextRun({ text: 'Title: ', font: S.FONT_EN, size: 24, bold: true, color: S.C.black }),
      new TextRun({ text: 'From LLMs to AI Agents', font: S.FONT_EN, size: 24, color: S.C.black }),
    ],
  })
);

// ── المحاور ────────────────────────────────────────────────────────────────
c.push(S.enLeft('Topics', { bold: true, after: 120 }));
c.push(S.bulletEn('Tool Use'));
c.push(S.bulletEn('Agents'));
c.push(S.bulletEn('Multi-Agent Systems'));
c.push(S.bulletEn('Future Trends', { after: 400 }));

// ── المخرَج ────────────────────────────────────────────────────────────────
c.push(S.enRight('Outcome', { bold: true, after: 100 }));
c.push(S.arRight('رؤية مستقبلية لما بعد LLM.', { bold: true }));

const doc = new Document({
  styles: S.styles,
  numbering: S.numbering,
  sections: [{ properties: S.pageSetup, children: c }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log('تم إنشاء:', out, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
