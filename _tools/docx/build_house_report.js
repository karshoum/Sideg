// بناء تقرير مشروع توقع أسعار المنازل بصيغة Word
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak,
  Header, Footer, PageNumber, TableOfContents, ShadingType, BorderStyle,
} = require('docx');
const A = require('./arabic');

const W = A.CONTENT_WIDTH;
const out = process.argv[2] || 'report.docx';

const children = [];

// ── صفحة الغلاف ────────────────────────────────────────────────────────────
children.push(A.gap(900));
children.push(A.docTitle('توقُّع أسعار المنازل'));
children.push(A.docTitle('باستخدام شبكة عصبية اصطناعية'));
children.push(A.gap(120));
children.push(
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: A.C.accent, space: 8 } },
    children: [
      new TextRun({
        text: 'Predicting House Prices with an Artificial Neural Network',
        font: A.FONT_EN, size: 24, color: A.C.muted, italics: true,
      }),
    ],
  })
);

children.push(
  A.table(
    ['البند', 'التفصيل'],
    [
      ['المادة', 'الذكاء الاصطناعي والتعلم العميق'],
      ['نوع المسألة', 'انحدار (Regression)'],
      ['التقنية', 'TensorFlow / Keras — Python 3.10'],
      // ‪ ... ‬ يفرض عرض هذا الجزء من اليسار لليمين داخل فقرة عربية
      ['هيكل الشبكة', '‪3 → 8 → 4 → 1‬'],
      ['البيئة', 'tf_env'],
    ],
    [2600, W - 2600],
    { boldFirstCol: true }
  )
);

children.push(A.gap(400));
children.push(
  A.ar('يشرح هذا التقرير المشروع من الفكرة حتى تفسير النتائج، وكل الأرقام الواردة فيه ناتجة عن تشغيل فعلي للكود المرفق.', {
    alignment: AlignmentType.CENTER, italics: true, size: 22, color: A.C.muted,
  })
);

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── جدول المحتويات ─────────────────────────────────────────────────────────
children.push(A.h1('المحتويات'));
children.push(
  A.table(
    ['القسم', 'الموضوع'],
    [
      ['١', 'فكرة المشروع'],
      ['٢', 'نوع البيانات (Data Type)'],
      ['٣', 'نوع النموذج (Model Type)'],
      ['٤', 'هيكل الشبكة (Architecture)'],
      ['٥', 'معالجة البيانات (Preprocessing)'],
      ['٦', 'النتائج وتفسيرها'],
      ['٧', 'الخلاصة (Conclusion)'],
      ['ملحق', 'كيف تشغّل الكود'],
    ],
    [1400, W - 1400],
    { boldFirstCol: true }
  )
);
children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 1) فكرة المشروع ────────────────────────────────────────────────────────
children.push(A.h1('١) فكرة المشروع'));
children.push(
  A.ar('يهدف هذا المشروع إلى بناء نموذج ذكاء اصطناعي يتوقّع أسعار المنازل بناءً على ثلاث خصائص:')
);
children.push(A.bullet('مساحة المنزل'));
children.push(A.bullet('عدد الغرف'));
children.push(A.bullet('عمر المنزل'));
children.push(A.gap(80));
children.push(
  A.ar('يتعلّم النموذج العلاقة بين هذه المدخلات وبين السعر من خلال بيانات التدريب، ثم يستخدم ما تعلّمه لتوقُّع أسعار منازل لم يرها من قبل.')
);
children.push(A.gap(120));
children.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 120, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: A.C.codeBg },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({
        text: 'This project aims to build an AI model that predicts house prices based on area, number of rooms, and house age. The model learns the relationship between inputs and price using training data.',
        font: A.FONT_EN, size: 21, color: '333333',
      }),
    ],
  })
);

children.push(A.h2('لماذا هذه مسألة انحدار وليست تصنيفاً؟'));
children.push(
  A.ar('لأن المطلوب رقم مستمر (السعر) وليس فئة. في التصنيف الثنائي يكون الجواب «نعم أو لا» — أي 0 أو 1 — أما هنا فالجواب قد يكون 234,387 أو 393,773 أو أي قيمة بينهما. هذا الفرق هو ما يحدّد دالة التفعيل في طبقة المخرجات ودالة الخسارة، كما سيأتي.')
);

// ── 2) نوع البيانات ────────────────────────────────────────────────────────
children.push(A.h1('٢) نوع البيانات (Data Type)'));
children.push(A.ar('بيانات رقمية منظّمة (Structured Numerical Data).'));
children.push(A.gap(80));

children.push(A.h2('المدخلات (Features)'));
children.push(
  A.table(
    ['الخاصية', 'الاسم في الكود', 'النوع', 'المدى'],
    [
      ['مساحة المنزل', 'area', 'رقمية مستمرة', '٦٠ – ٢٥٠ م²'],
      ['عدد الغرف', 'rooms', 'رقمية منفصلة', '١ – ٦'],
      ['عمر المنزل', 'age', 'رقمية مستمرة', '٠ – ٤٠ سنة'],
    ],
    [2400, 2000, 2400, W - 6800],
    { ltrCols: [1], boldFirstCol: true }
  )
);

children.push(A.gap(200));
children.push(A.h2('المخرج (Target)'));
children.push(
  A.table(
    ['المخرج', 'الاسم في الكود', 'النوع'],
    [['سعر المنزل', 'price', 'قيمة مستمرة (Continuous Value)']],
    [2400, 2000, W - 4400],
    { ltrCols: [1], boldFirstCol: true }
  )
);

children.push(A.gap(240));
children.push(A.h2('من أين تأتي البيانات؟'));
children.push(
  A.ar('لا يوجد ملف بيانات خارجي — يولّد الكود ١٠٠٠ صف من البيانات بنفسه وفق علاقة معلومة مسبقاً:')
);
children.push(A.gap(60));
children.push(A.code('price = 2500 x area + 20000 x rooms - 3000 x age + 50000 + noise'));
children.push(A.gap(140));
children.push(
  A.ar('فائدة هذا الأسلوب أننا نعرف الإجابة الصحيحة نظرياً، فنستطيع الحكم على النموذج بموضوعية: إن اكتشف هذه العلاقة بنفسه فقد نجح فعلاً.')
);
children.push(
  A.ar('أما الضوضاء (noise) فهي مقصودة، لأنها تحاكي الواقع: منزلان بنفس المواصفات تماماً لا يُباعان بنفس السعر بالضبط.')
);

// ── 3) نوع النموذج ─────────────────────────────────────────────────────────
children.push(A.h1('٣) نوع النموذج (Model Type)'));
children.push(A.ar('شبكة عصبية اصطناعية — Artificial Neural Network (ANN).'));
children.push(
  A.ar('اختيرت الشبكة العصبية لقدرتها على التقاط العلاقات غير الخطية بين المدخلات والمخرج، وهو ما يعجز عنه الانحدار الخطي البسيط عندما تتشابك أثر المساحة مع أثر العمر وعدد الغرف.')
);

// ── 4) هيكل الشبكة ─────────────────────────────────────────────────────────
children.push(A.h1('٤) هيكل الشبكة (Architecture)'));
children.push(
  A.table(
    ['الطبقة', 'عدد العصبونات', 'دالة التفعيل', 'المعاملات'],
    [
      ['طبقة المدخلات', '٣ خصائص', '—', '٠'],
      ['الطبقة المخفية الأولى', '٨ عصبونات', 'ReLU', '٣٢'],
      ['الطبقة المخفية الثانية', '٤ عصبونات', 'ReLU', '٣٦'],
      ['طبقة المخرجات', 'عصبون واحد', 'Linear', '٥'],
    ],
    [2900, 2000, 2000, W - 6900],
    { ltrCols: [2], boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.arRuns([
    { text: 'إجمالي المعاملات القابلة للتدريب: ', bold: true },
    { text: '73', ltr: true, bold: true, color: A.C.accent },
    { text: ' معاملاً — شبكة صغيرة جداً، وهذا مقصود: المسألة بسيطة ولا تحتاج أكثر من ذلك.' },
  ])
);

children.push(A.h2('لماذا Linear في طبقة المخرجات وليست Sigmoid؟'));
children.push(A.ar('هذا أشهر خطأ في هذا النوع من المشاريع، ويستحق التوقف عنده:'));
children.push(
  A.bullet('دالة sigmoid تحصر المخرج بين ٠ و ١ — ممتازة للتصنيف الثنائي، وكارثية للأسعار.')
);
children.push(
  A.bullet('دالة linear تترك المخرج حراً على كل خط الأعداد — وهذا ما يحتاجه السعر تماماً.')
);
children.push(A.gap(60));
children.push(
  A.ar('لو استُخدمت sigmoid هنا لخرج النموذج بأسعار كلها بين صفر وواحد مهما طال تدريبه.', {
    color: A.C.heading,
  })
);

children.push(A.h2('لماذا ReLU في الطبقات المخفية؟'));
children.push(
  A.ar('دالة ReLU تُبقي القيم الموجبة كما هي وتُصفّر السالبة. بساطتها تجعل التدريب سريعاً، وهي التي تمنح الشبكة قدرتها على تمثيل العلاقات غير الخطية — فبدون دالة تفعيل غير خطية تنهار الشبكة كلها إلى مجرد معادلة خطية واحدة مهما كثرت طبقاتها.')
);

// ── 5) معالجة البيانات ─────────────────────────────────────────────────────
children.push(A.h1('٥) معالجة البيانات (Preprocessing)'));
children.push(A.arRuns([
  { text: 'استُخدمت ' },
  { text: 'StandardScaler', ltr: true, bold: true, color: A.C.accent },
  { text: ' من مكتبة scikit-learn لتوحيد مقاييس القيم وجعل النموذج يتعلّم بشكل أفضل.' },
]));

children.push(A.h2('لماذا؟'));
children.push(A.ar('انظر إلى مقاييس المدخلات الثلاثة:'));
children.push(
  A.table(
    ['الخاصية', 'المدى التقريبي'],
    [
      ['المساحة', '٦٠ – ٢٥٠'],
      ['عدد الغرف', '١ – ٦'],
      ['عمر المنزل', '٠ – ٤٠'],
    ],
    [3000, W - 3000],
    { boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.ar('الشبكة العصبية تتعامل مع الأرقام الكبيرة على أنها أهمّ لمجرد أنها أكبر، وهذا خطأ. توحّد StandardScaler المقاييس بحيث يصبح لكل خاصية متوسط ٠ وانحراف معياري ١، فتنطلق كل الخصائص من أرضية واحدة ويصبح التدريب أسرع وأكثر استقراراً.')
);

children.push(A.h2('نقطة دقيقة: تسريب البيانات'));
children.push(
  A.ar('يُطبَّق fit على بيانات التدريب فقط، ثم transform على بيانات الاختبار. ولو طُبِّق fit على البيانات كلها لتسرّبت معلومات الاختبار إلى التدريب (Data Leakage) ولأصبحت النتيجة متفائلة أكثر من الحقيقة.')
);
children.push(A.gap(60));
children.push(A.code('scaler_X = StandardScaler()'));
children.push(A.code('X_train_scaled = scaler_X.fit_transform(X_train)   # fit + transform'));
children.push(A.code('X_test_scaled  = scaler_X.transform(X_test)        # transform only'));

children.push(A.h2('إعدادات التدريب'));
children.push(
  A.table(
    ['الإعداد', 'القيمة', 'السبب'],
    [
      ['دالة الخسارة', 'MSE', 'المعيار القياسي لمسائل الانحدار'],
      ['المُحسِّن', 'Adam', 'يضبط معدل التعلم تلقائياً'],
      ['عدد الدورات', '100', 'كافٍ لاستقرار الخسارة'],
      ['حجم الدفعة', '32', 'توازن بين السرعة والاستقرار'],
      ['تقسيم البيانات', '80 / 20', 'تدريب / اختبار'],
    ],
    [2400, 1600, W - 4000],
    { ltrCols: [1], boldFirstCol: true }
  )
);

// ── 6) النتائج ─────────────────────────────────────────────────────────────
children.push(A.h1('٦) النتائج وتفسيرها'));
children.push(
  A.ar('الأرقام التالية ناتجة عن تشغيل فعلي للكود المرفق، على ٢٠٠ منزل لم يرها النموذج أثناء التدريب.', { italics: true, color: A.C.muted, size: 22 })
);
children.push(A.gap(120));

children.push(A.h2('مقاييس الأداء'));
children.push(
  A.table(
    ['المقياس', 'القيمة', 'المعنى'],
    [
      ['متوسط الخطأ المطلق (MAE)', '13,911', 'متوسط بُعد التوقع عن السعر الحقيقي'],
      ['جذر متوسط مربع الخطأ (RMSE)', '16,975', 'يعاقب الأخطاء الكبيرة بشدة'],
      ['معامل التحديد (R²)', '0.9862', 'فسّر النموذج ٩٨٫٦٪ من تغيّر السعر'],
    ],
    [3200, 1700, W - 4900],
    { ltrCols: [1], boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.arRuns([
    { text: 'قراءة النتيجة: ', bold: true, color: A.C.ok },
    { text: 'معامل تحديد قدره ' },
    { text: '0.9862', ltr: true, bold: true },
    { text: ' يعني أن الشبكة اكتشفت العلاقة الكامنة في البيانات بنجاح. والخطأ المتبقي — نحو ١٤ ألفاً — قريب من مستوى الضوضاء التي زُرعت في البيانات عمداً، أي أنه الحدّ الأدنى الذي لا يمكن لأي نموذج النزول تحته.' },
  ])
);

children.push(A.h2('توقُّع أسعار منازل جديدة'));
children.push(
  A.table(
    ['المنزل', 'المساحة', 'الغرف', 'العمر', 'السعر المتوقَّع'],
    [
      ['منزل صغير قديم', '٨٠ م²', '٢', '٢٠ سنة', '234,387'],
      ['منزل متوسط', '١٣٠ م²', '٣', '٨ سنوات', '393,773'],
      ['منزل كبير حديث', '٢٠٠ م²', '٥', 'سنتان', '643,734'],
    ],
    [2400, 1500, 1100, 1600, W - 6600],
    { ltrCols: [4], boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.ar('التسلسل منطقي تماماً: كلما زادت المساحة وعدد الغرف ارتفع السعر، وكلما زاد العمر انخفض. النموذج لم يُلقَّن هذه القاعدة، بل استنتجها من البيانات وحدها.')
);

children.push(A.h2('كيف نحكم على أي توقّع؟'));
children.push(
  A.table(
    ['الحالة', 'الحكم'],
    [
      ['السعر داخل مدى أسعار بيانات التدريب', 'توقُّع سليم'],
      ['السعر خارج المدى بشكل كبير', 'يستحق المراجعة'],
      ['السعر سالب', 'مشكلة واضحة في التدريب'],
    ],
    [5200, W - 5200],
    { boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.arRuns([
    { text: 'مدى أسعار بيانات التدريب في هذا التشغيل: من ' },
    { text: '122,143', ltr: true, bold: true },
    { text: ' إلى ' },
    { text: '783,972', ltr: true, bold: true },
    { text: ' — والتوقعات الثلاثة كلها وقعت داخل هذا المدى.' },
  ])
);
children.push(A.gap(120));
children.push(A.h2('الأسباب المعتادة للتوقعات الفاسدة'));
children.push(A.bullet('نسيان توحيد المقاييس (StandardScaler).'));
children.push(A.bullet('عدد دورات التدريب قليل جداً فلم تستقر الخسارة.'));
children.push(A.bullet('دالة تفعيل غير مناسبة في طبقة المخرجات — sigmoid بدل linear.'));
children.push(A.bullet('معدل تعلّم كبير جداً يجعل التدريب يتأرجح دون أن يستقر.'));

// ── 7) الخلاصة ─────────────────────────────────────────────────────────────
children.push(A.h1('٧) الخلاصة (Conclusion)'));
children.push(
  A.ar('يوضّح هذا المشروع كيف يمكن استخدام الشبكات العصبية الاصطناعية لتوقُّع أسعار المنازل، وذلك بتعلُّم الأنماط من بيانات رقمية منظّمة: المساحة، وعدد الغرف، وعمر المنزل.')
);
children.push(
  A.ar('يمرّر النموذج هذه الخصائص عبر طبقتين مخفيتين لالتقاط العلاقات غير الخطية بين المدخلات والمخرج، وبعد التدريب على البيانات التاريخية يصبح قادراً على التعميم وإنتاج توقعات تقريبية لمنازل جديدة لم يرها من قبل.')
);
children.push(A.gap(120));
children.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 120, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: A.C.codeBg },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({
        text: 'This project demonstrates how artificial neural networks can be used to predict house prices by learning complex patterns from structured numerical data such as area, number of rooms, and house age. The model processes these features through multiple hidden layers to capture non-linear relationships between inputs and output. After training on historical data, the network is able to generalize and produce approximate price predictions for new, unseen houses.',
        font: A.FONT_EN, size: 21, color: '333333',
      }),
    ],
  })
);

children.push(A.h2('حدود النموذج'));
children.push(
  A.ar('من الأمانة العلمية ذكر ما لا يستطيعه هذا النموذج:')
);
children.push(A.bullet('البيانات مولّدة اصطناعياً، والسوق الحقيقي أعقد بكثير: الموقع والحيّ والتشطيب وحالة الاقتصاد كلها عوامل غائبة هنا.'));
children.push(A.bullet('لا يصلح للتعميم خارج مدى بيانات التدريب — لن يحسن توقّع سعر قصر مساحته ١٠٠٠ م².'));
children.push(A.bullet('ثلاث خصائص فقط. النماذج العملية تستخدم عشرات الخصائص.'));

children.push(A.h2('خطوات ممكنة للتطوير'));
children.push(A.bullet('استخدام بيانات حقيقية من سوق فعلي بدل البيانات المولّدة.'));
children.push(A.bullet('إضافة خصائص مؤثرة مثل الموقع ونوع التشطيب وسنة آخر تجديد.'));
children.push(A.bullet('تجربة التحقق المتقاطع (Cross-Validation) للحصول على تقدير أدق للأداء.'));
children.push(A.bullet('مقارنة النتيجة بنماذج أخرى مثل Random Forest و Gradient Boosting.'));

// ── ملحق: تشغيل الكود ──────────────────────────────────────────────────────
children.push(A.h1('ملحق: كيف تشغّل الكود'));
children.push(A.ar('على Windows، من خلال Anaconda Prompt (وليس CMD أو PowerShell العادي):'));
children.push(A.gap(60));
children.push(A.code('conda activate tf_env'));
children.push(A.code('cd Sideg\\projects\\house-price-ann'));
children.push(A.code('pip install -r requirements.txt'));
children.push(A.code('python house_price_ann.py'));
children.push(A.gap(160));
children.push(A.ar('على macOS أو Linux، من خلال Terminal:'));
children.push(A.gap(60));
children.push(A.code('conda activate tf_env'));
children.push(A.code('cd Sideg/projects/house-price-ann'));
children.push(A.code('pip install -r requirements.txt'));
children.push(A.code('python house_price_ann.py'));
children.push(A.gap(200));
children.push(
  A.ar('ملاحظة: رسائل مثل «oneDNN custom operations are on» أو «Could not find TensorRT» هي تحذيرات وليست أخطاء — تجاهلها تماماً، فالكود يعمل بشكل سليم.', {
    italics: true, color: A.C.muted, size: 22,
  })
);

// ── المستند ────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: A.styles,
  numbering: A.numbering,
  features: { updateFields: true },
  sections: [
    {
      properties: A.pageSetup,
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.START,
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF', space: 4 } },
              children: [
                new TextRun({
                  text: 'مشروع توقّع أسعار المنازل — شبكة عصبية اصطناعية',
                  rightToLeft: true, font: A.FONT, size: 18, color: A.C.muted,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], font: A.FONT_EN, size: 18, color: A.C.muted }),
                new TextRun({ text: ' / ', font: A.FONT_EN, size: 18, color: A.C.muted }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: A.FONT_EN, size: 18, color: A.C.muted }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log('تم إنشاء:', out, `(${(buf.length / 1024).toFixed(1)} KB)`);
});
