// أدوات بناء ملفات التسليم — تحاكي تنسيق المستند الأصلي
//
// قاعدة المحاذاة نفسها المشروحة في arabic.js:
//   فقرة عربية (bidirectional) -> START تعطي محاذاة يمين.
//   فقرة إنجليزية -> نحذف خاصية الاتجاه تماماً ونستخدم LEFT/RIGHT مباشرة.

const { Paragraph, TextRun, AlignmentType, LevelFormat } = require('docx');

const FONT_AR = 'Arial';
const FONT_EN = 'Times New Roman';

// الألوان كما تظهر في المستند الأصلي
const C = {
  red:   'C00000',
  blue:  '1F4E79',
  cyan:  '00B0F0',
  black: '000000',
};

/** خيارات TextRun — rightToLeft يُحذف تماماً في النص الإنجليزي */
function runOpts({ text, ltr, font, size, bold, color }) {
  const o = { text, font: font || (ltr ? FONT_EN : FONT_AR), size: size || 24 };
  if (!ltr) o.rightToLeft = true;
  if (bold) o.bold = true;
  if (color) o.color = color;
  return o;
}

/** فقرة عربية — محاذاة يمين */
function arRight(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.START,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    children: [new TextRun(runOpts({ text, ...opts }))],
  });
}

/** فقرة إنجليزية — محاذاة يسار */
function enLeft(text, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.LEFT,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    children: [new TextRun(runOpts({ text, ltr: true, ...opts }))],
  });
}

/** فقرة إنجليزية — محاذاة يمين */
function enRight(text, opts = {}) {
  return enLeft(text, { ...opts, alignment: AlignmentType.RIGHT });
}

/** عنوان قسم عربي (أحمر، يمين) */
function headingAr(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.START,
    spacing: { before: opts.before ?? 240, after: opts.after ?? 140, line: 300 },
    children: [
      new TextRun(runOpts({ text, size: opts.size || 26, bold: true, color: opts.color || C.red })),
    ],
  });
}

/** عنوان قسم إنجليزي (أحمر، يسار) */
function headingEn(text, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.LEFT,
    spacing: { before: opts.before ?? 240, after: opts.after ?? 140, line: 300 },
    children: [
      new TextRun(runOpts({
        text, ltr: true, size: opts.size || 26, bold: true, color: opts.color || C.red,
      })),
    ],
  });
}

/** عنصر قائمة نقطية إنجليزية */
function bulletEn(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'en-bullets', level: 0 },
    alignment: AlignmentType.LEFT,
    spacing: { after: opts.after ?? 60, line: 300 },
    children: [new TextRun(runOpts({ text, ltr: true, ...opts }))],
  });
}

/** عنصر قائمة نقطية عربية */
function bulletAr(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'ar-bullets', level: 0 },
    bidirectional: true,
    alignment: AlignmentType.START,
    spacing: { after: opts.after ?? 60, line: 300 },
    children: [new TextRun(runOpts({ text, ...opts }))],
  });
}

function gap(after = 160) {
  return new Paragraph({ spacing: { after }, children: [] });
}

const numbering = {
  config: [
    {
      reference: 'en-bullets',
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: '•',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 260 } } },
      }],
    },
    {
      reference: 'ar-bullets',
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: '•',
        alignment: AlignmentType.START,
        style: { paragraph: { indent: { right: 720, hanging: 260 } } },
      }],
    },
  ],
};

const styles = {
  default: { document: { run: { font: FONT_EN, size: 24 } } },
};

const pageSetup = {
  page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
};

module.exports = {
  arRight, enLeft, enRight, headingAr, headingEn, bulletEn, bulletAr, gap, runOpts,
  numbering, styles, pageSetup, C, FONT_AR, FONT_EN,
};
