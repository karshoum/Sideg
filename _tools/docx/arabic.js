// أدوات مشتركة لبناء مستندات Word عربية (من اليمين إلى اليسار)
//
// ── قاعدة المحاذاة (مُختبَرة، لا تُخالف) ────────────────────────────────────
// في فقرة عربية (bidirectional: true) تُفسَّر قيم w:jc على أنها نسبية
// لاتجاه الفقرة لا للصفحة:
//     START -> يمين الصفحة   (وهو المطلوب في العربية)
//     END   -> يسار الصفحة
//     RIGHT -> يسار الصفحة   (مفاجئ — لا تستخدمها)
// ولهذا كل فقرة عربية هنا تستخدم START وليس RIGHT.
//
// وفي الفقرات الإنجليزية نتجنّب تعيين rightToLeft: false صراحةً،
// لأن w:rtl val="false" يربك محاذاة بعض القارئات — نحذف الخاصية بدل تصفيرها.

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, ShadingType, BorderStyle, HeadingLevel, LevelFormat,
} = require('docx');

const FONT = 'Arial';
const FONT_EN = 'Consolas';

const C = {
  title:   '1F3864',
  heading: 'C00000',
  sub:     '1F4E79',
  accent:  '2E74B5',
  headBg:  'DCE6F1',
  altBg:   'F2F6FA',
  codeBg:  'F5F5F5',
  muted:   '595959',
  ok:      '2E7D32',
};

const CONTENT_WIDTH = 9000; // عرض المحتوى داخل هوامش A4 بوحدة DXA

/** يبني خيارات TextRun — يحذف rightToLeft تماماً في النص الإنجليزي */
function runOpts({ text, ltr, font, size, bold, italics, color }) {
  const opts = {
    text,
    font: font || (ltr ? FONT_EN : FONT),
    size: size || 24,
  };
  if (!ltr) opts.rightToLeft = true;
  if (bold) opts.bold = true;
  if (italics) opts.italics = true;
  if (color) opts.color = color;
  return opts;
}

/** فقرة عربية عادية */
function ar(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.START,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    indent: opts.indent,
    children: [new TextRun(runOpts({ text, ...opts }))],
  });
}

/** فقرة عربية مكوّنة من عدة أجزاء بتنسيقات مختلفة */
function arRuns(runs, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.START,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    children: runs.map((r) => new TextRun(runOpts({ ...r, size: r.size || opts.size }))),
  });
}

/** فقرة إنجليزية خالصة (من اليسار) */
function enPara(text, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.LEFT,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 280 },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    indent: opts.indent,
    children: [new TextRun(runOpts({ text, ltr: true, ...opts }))],
  });
}

/** عنوان المستند الرئيسي */
function docTitle(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 340 },
    children: [new TextRun(runOpts({ text, size: 40, bold: true, color: C.title }))],
  });
}

/** عنوان قسم رئيسي */
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    alignment: AlignmentType.START,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.heading, space: 4 } },
    children: [new TextRun(runOpts({ text, size: 30, bold: true, color: C.heading }))],
  });
}

/** عنوان فرعي */
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    alignment: AlignmentType.START,
    spacing: { before: 240, after: 120 },
    children: [new TextRun(runOpts({ text, size: 26, bold: true, color: C.sub }))],
  });
}

/** عنصر قائمة نقطية عربية */
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'ar-bullets', level: 0 },
    bidirectional: true,
    alignment: AlignmentType.START,
    spacing: { after: 60, line: 300 },
    children: [new TextRun(runOpts({ text, ...opts }))],
  });
}

/** سطر كود بخلفية رمادية */
function code(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 0, line: 260 },
    shading: { type: ShadingType.CLEAR, fill: C.codeBg },
    indent: { left: 240, right: 240 },
    children: [new TextRun(runOpts({ text, ltr: true, size: 20, color: '1A1A1A' }))],
  });
}

function gap(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

/** خلية جدول */
function cell(text, width, opts = {}) {
  const ltr = !!opts.ltr;
  const alignment = opts.align || (ltr ? AlignmentType.LEFT : AlignmentType.START);

  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        bidirectional: !ltr,
        alignment,
        spacing: { after: 0, line: 260 },
        children: [
          new TextRun(runOpts({
            text: String(text), ltr, size: opts.size || 22,
            bold: opts.bold, color: opts.color,
          })),
        ],
      }),
    ],
  });
}

/** جدول عربي */
function table(headers, rows, widths, opts = {}) {
  const ltrCols = new Set(opts.ltrCols || []);

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      cell(h, widths[i], { fill: C.headBg, bold: true, align: AlignmentType.CENTER })
    ),
  });

  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((v, i) =>
        cell(v, widths[i], {
          fill: ri % 2 === 1 ? C.altBg : undefined,
          ltr: ltrCols.has(i),
          bold: opts.boldFirstCol && i === 0,
        })
      ),
    })
  );

  return new Table({
    visuallyRightToLeft: true,
    columnWidths: widths,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: [headerRow, ...bodyRows],
  });
}

const numbering = {
  config: [
    {
      reference: 'ar-bullets',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { right: 460, hanging: 260 } } },
        },
      ],
    },
  ],
};

const styles = {
  default: { document: { run: { font: FONT, size: 24 } } },
};

const pageSetup = {
  page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } },
};

module.exports = {
  ar, arRuns, enPara, docTitle, h1, h2, bullet, code, gap, cell, table, runOpts,
  numbering, styles, pageSetup, C, FONT, FONT_EN, CONTENT_WIDTH,
};
