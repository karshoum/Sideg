// ملف تسليم مشروع توقع أسعار المنازل — مطابق للمستند الأصلي
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const S = require('./submission_lib');

const out = process.argv[2] || 'submission.docx';
const c = [];

// ── العنوان ────────────────────────────────────────────────────────────────
c.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 320 },
    children: [
      new TextRun({
        text: 'House Price Prediction Using an Artificial Neural Network',
        font: S.FONT_EN, size: 30, bold: true, color: S.C.black,
      }),
    ],
  })
);
c.push(
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 320, line: 320 },
    children: [
      new TextRun({
        text: 'مشروع توقّع أسعار المنازل باستخدام شبكة عصبية اصطناعية',
        rightToLeft: true, font: S.FONT_AR, size: 26, bold: true, color: S.C.black,
      }),
    ],
  })
);

// ── 1) فكرة المشروع ────────────────────────────────────────────────────────
c.push(S.headingAr('1) فكرة المشروع', { before: 0 }));

c.push(S.enRight('This project aims to build an AI model that predicts house prices based on:'));
c.push(S.enRight('Area', { color: S.C.red }));
c.push(S.enRight('Rooms', { color: S.C.red }));
c.push(S.enRight('Age', { color: S.C.red, after: 160 }));

c.push(S.arRight('يهدف هذا المشروع إلى بناء نموذج ذكاء اصطناعي يتوقع أسعار المنازل بناءً على'));
c.push(S.arRight('مساحة المنزل', { after: 60 }));
c.push(S.arRight('عدد الغرف', { after: 60 }));
c.push(S.arRight('عمر المنزل', { after: 200 }));

c.push(S.enLeft('The model learns the relationship between inputs and price using training data.'));

// ── 2) نوع البيانات ────────────────────────────────────────────────────────
c.push(S.headingAr('2) Data Type / نوع البيانات'));
c.push(S.arRight('بيانات رقمية منظمة', { after: 180 }));

c.push(S.headingEn('Features:', { before: 60, after: 100 }));
c.push(S.bulletEn('Area  →  Numerical'));
c.push(S.bulletEn('Rooms  →  Discrete Numerical'));
c.push(S.bulletEn('Age  →  Numerical', { after: 160 }));

c.push(S.headingEn('Target:', { before: 60, after: 100 }));
c.push(S.bulletEn('Price  →  Continuous Value'));

// ── 3) نوع النموذج ─────────────────────────────────────────────────────────
c.push(S.headingEn('3) Model Type'));
c.push(S.enLeft('Artificial Neural Network (ANN)', { color: S.C.cyan, size: 26 }));

// ── 4) هيكل الشبكة ─────────────────────────────────────────────────────────
c.push(S.headingEn('4) Architecture:'));
c.push(S.bulletEn('Input Layer: 3 features'));
c.push(S.bulletEn('Hidden Layer 1: 8 neurons'));
c.push(S.bulletEn('Hidden Layer 2: 4 neurons'));
c.push(S.bulletEn('Output Layer: 1 neuron', { after: 160 }));

c.push(S.enLeft('Activation Functions:', { bold: true, after: 80 }));
c.push(S.enLeft('ReLU : hidden layers', { after: 60 }));
c.push(S.enLeft('Linear : output layer', { after: 100 }));
c.push(S.arRight('مناسب لمشاكل الانحدار'));

// ── 5) معالجة البيانات ─────────────────────────────────────────────────────
c.push(S.headingAr('5) معالجة البيانات'));
c.push(S.arRight('استخدمت', { after: 60 }));
c.push(S.enLeft('StandardScaler', { bold: true, after: 60 }));
c.push(S.arRight('من اجل توحيد القيم وجعل النموذج يتعلم بشكل افضل'));

// ── 6) تفسير النتائج ───────────────────────────────────────────────────────
c.push(S.headingAr('6) تفسير النتائج'));
c.push(S.enLeft('The model outputs:', { after: 100 }));
c.push(S.bulletEn('240,000'));
c.push(S.bulletEn('443,000'));
c.push(S.bulletEn('578,000', { after: 160 }));

c.push(S.enLeft('Within range  →  correct prediction', { after: 60 }));
c.push(S.enLeft('Out of range or negative  →  training issue'));

// ── الخلاصة ────────────────────────────────────────────────────────────────
c.push(S.headingEn('Conclusion', { color: S.C.cyan }));
c.push(
  new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 120, line: 320 },
    children: [
      new TextRun({
        text: 'This project demonstrates how artificial neural networks can be used to predict '
            + 'house prices by learning complex patterns from structured numerical data such as '
            + 'area, number of rooms, and house age. The model processes these features through '
            + 'multiple hidden layers to capture non-linear relationships between inputs and '
            + 'output. After training on historical data, the network is able to generalize and '
            + 'produce approximate price predictions for new, unseen houses.',
        font: S.FONT_EN, size: 24, color: S.C.black,
      }),
    ],
  })
);

const doc = new Document({
  styles: S.styles,
  numbering: S.numbering,
  sections: [{ properties: S.pageSetup, children: c }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log('تم إنشاء:', out, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
