// أدوات مشتركة لبناء مستندات Word عربية (من اليمين إلى اليسار)
const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, ShadingType, BorderStyle, HeadingLevel, LevelFormat,
} = require('docx');

const FONT = 'Arial';
const FONT_EN = 'Consolas';

// ألوان المستند
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

/** فقرة عربية عادية */
function ar(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.RIGHT,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    indent: opts.indent,
    children: [
      new TextRun({
        text,
        rightToLeft: true,
        font: FONT,
        size: opts.size || 24,
        bold: opts.bold || false,
        italics: opts.italics || false,
        color: opts.color,
      }),
    ],
  });
}

/** فقرة مكوّنة من عدة أجزاء بتنسيقات مختلفة */
function arRuns(runs, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.RIGHT,
    spacing: { after: opts.after ?? 120, line: opts.line ?? 300 },
    children: runs.map((r) =>
      new TextRun({
        text: r.text,
        rightToLeft: r.ltr ? false : true,
        font: r.ltr ? FONT_EN : FONT,
        size: r.size || opts.size || 24,
        bold: r.bold || false,
        italics: r.italics || false,
        color: r.color,
      })
    ),
  });
}

/** عنوان المستند الرئيسي */
function docTitle(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 340 },
    children: [
      new TextRun({ text, rightToLeft: true, font: FONT, size: 40, bold: true, color: C.title }),
    ],
  });
}

/** عنوان قسم رئيسي (يظهر في جدول المحتويات) */
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.heading, space: 4 } },
    children: [
      new TextRun({ text, rightToLeft: true, font: FONT, size: 30, bold: true, color: C.heading }),
    ],
  });
}

/** عنوان فرعي */
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({ text, rightToLeft: true, font: FONT, size: 26, bold: true, color: C.sub }),
    ],
  });
}

/** عنصر قائمة نقطية */
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'ar-bullets', level: 0 },
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { after: 60, line: 300 },
    children: [
      new TextRun({
        text,
        rightToLeft: true,
        font: FONT,
        size: opts.size || 24,
        bold: opts.bold || false,
        color: opts.color,
      }),
    ],
  });
}

/** سطر كود بخلفية رمادية */
function code(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 0, line: 260 },
    shading: { type: ShadingType.CLEAR, fill: C.codeBg },
    indent: { left: 240, right: 240 },
    children: [new TextRun({ text, font: FONT_EN, size: 20, color: '1A1A1A' })],
  });
}

/** فقرة فارغة صغيرة */
function gap(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

/** خلية جدول */
function cell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        bidirectional: !opts.ltr,
        alignment: opts.align || (opts.ltr ? AlignmentType.LEFT : AlignmentType.RIGHT),
        spacing: { after: 0, line: 260 },
        children: [
          new TextRun({
            text: String(text),
            rightToLeft: !opts.ltr,
            font: opts.ltr ? FONT_EN : FONT,
            size: opts.size || 22,
            bold: opts.bold || false,
            color: opts.color,
          }),
        ],
      }),
    ],
  });
}

/**
 * جدول عربي.
 * @param {string[]} headers  عناوين الأعمدة (من اليمين لليسار بصرياً)
 * @param {Array[]} rows      الصفوف
 * @param {number[]} widths   عرض كل عمود بوحدة DXA، مجموعها = CONTENT_WIDTH
 * @param {object} opts       { ltrCols: [أرقام الأعمدة التي محتواها إنجليزي] }
 */
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

/** إعداد القوائم النقطية — يُمرّر إلى Document */
const numbering = {
  config: [
    {
      reference: 'ar-bullets',
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.RIGHT,
          style: { paragraph: { indent: { right: 460, hanging: 260 } } },
        },
      ],
    },
  ],
};

/** الأنماط الافتراضية — يُمرّر إلى Document */
const styles = {
  default: {
    document: { run: { font: FONT, size: 24 } },
  },
};

/** إعدادات الصفحة A4 من اليمين لليسار */
const pageSetup = {
  page: {
    margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
  },
  bidi: true,
};

module.exports = {
  ar, arRuns, docTitle, h1, h2, bullet, code, gap, cell, table,
  numbering, styles, pageSetup, C, FONT, FONT_EN, CONTENT_WIDTH,
};
