// بناء ملف السيمنار الحادي عشر بصيغة Word
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak,
  Header, Footer, PageNumber, ShadingType, BorderStyle,
} = require('docx');
const A = require('./arabic');

const W = A.CONTENT_WIDTH;
const out = process.argv[2] || 'seminar.docx';

const children = [];

function quote(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 120, after: 160, line: 320 },
    indent: { right: 300, left: 300 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F6FA' },
    border: { right: { style: BorderStyle.SINGLE, size: 18, color: A.C.accent, space: 10 } },
    children: [
      new TextRun({ text, rightToLeft: true, font: A.FONT, size: 26, bold: true, color: A.C.sub }),
    ],
  });
}

function en(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 120, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: A.C.codeBg },
    indent: { left: 200, right: 200 },
    children: [new TextRun({ text, font: A.FONT_EN, size: 21, color: '333333' })],
  });
}

// ── الغلاف ─────────────────────────────────────────────────────────────────
children.push(A.gap(800));
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: 'Seminar 11: Agents and Future Directions',
        font: A.FONT_EN, size: 26, bold: true, color: A.C.muted,
      }),
    ],
  })
);
children.push(A.docTitle('من النماذج اللغوية'));
children.push(A.docTitle('إلى الوكلاء الأذكياء'));
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 500 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: A.C.accent, space: 8 } },
    children: [
      new TextRun({ text: 'From LLMs to AI Agents', font: A.FONT_EN, size: 24, italics: true, color: A.C.muted }),
    ],
  })
);

children.push(
  A.table(
    ['البند', 'التفصيل'],
    [
      ['المُقدِّم', 'صديق إبراهيم علي كمبال'],
      ['التاريخ', 'السبت ٤ يوليو ٢٠٢٦م'],
      ['المادة', 'الذكاء الاصطناعي والتعلم العميق'],
      ['المخرَج المطلوب', 'رؤية مستقبلية لما بعد الـ LLM'],
    ],
    [2800, W - 2800],
    { boldFirstCol: true }
  )
);

children.push(A.gap(400));
children.push(A.h2('المحاور'));
children.push(
  A.table(
    ['#', 'المحور', 'بالإنجليزية'],
    [
      ['١', 'استخدام الأدوات', 'Tool Use'],
      ['٢', 'الوكلاء', 'Agents'],
      ['٣', 'الأنظمة متعددة الوكلاء', 'Multi-Agent Systems'],
      ['٤', 'الاتجاهات المستقبلية', 'Future Trends'],
    ],
    [900, 4200, W - 5100],
    { ltrCols: [2] }
  )
);

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── تمهيد ──────────────────────────────────────────────────────────────────
children.push(A.h1('تمهيد: أين توقّف النموذج اللغوي؟'));
children.push(
  A.ar('قطعت النماذج اللغوية الكبيرة (LLM) شوطاً هائلاً في فهم اللغة وتوليدها. لكنها، مهما بلغت قدرتها، تبقى محصورة داخل حدّ واحد واضح: هي تُنتج نصاً، ولا تفعل شيئاً في العالم.')
);
children.push(A.gap(80));
children.push(A.h2('ثلاثة قيود بنيوية'));
children.push(
  A.table(
    ['القيد', 'ما معناه عملياً'],
    [
      ['معرفة مجمّدة', 'لا يعرف النموذج شيئاً بعد تاريخ تدريبه — لا سعر صرف اليوم ولا خبر الأمس.'],
      ['لا وصول للعالم', 'لا يقرأ ملفاتك ولا قاعدة بياناتك ولا يرسل بريداً.'],
      ['خطوة واحدة', 'يعطي جواباً واحداً ثم ينتهي، ولا يراجع نفسه بناءً على نتيجة.'],
    ],
    [2600, W - 2600],
    { boldFirstCol: true }
  )
);
children.push(A.gap(200));
children.push(quote('النموذج اللغوي يتكلّم، أما الوكيل فيتصرّف.'));
children.push(
  A.ar('والانتقال من الأول إلى الثاني لا يحتاج نموذجاً أذكى، بل يحتاج ثلاث إضافات حول النموذج نفسه:')
);
children.push(
  A.table(
    ['الإضافة', 'ما تمنحه للنموذج'],
    [
      ['أدوات (Tools)', 'يدٌ يمتدّ بها إلى العالم: بحث، حاسبة، قاعدة بيانات، بريد.'],
      ['حلقة (Loop)', 'قدرة على تكرار المحاولة بعد رؤية النتيجة، بدل جواب واحد نهائي.'],
      ['ذاكرة (Memory)', 'إدراك ما جرى في الخطوات السابقة.'],
    ],
    [2600, W - 2600],
    { boldFirstCol: true }
  )
);

// ── المحور 1 ───────────────────────────────────────────────────────────────
children.push(A.h1('المحور الأول: استخدام الأدوات (Tool Use)'));
children.push(
  A.ar('الفكرة أبسط مما تبدو: بدل أن يحاول النموذج معرفة كل شيء، نُعلِمه بوجود أدوات ونصف له وظيفة كل أداة. فإذا واجه سؤالاً يحتاج أداة، لم يُجب من عنده، بل قال: «استدعوا الحاسبة بهذا التعبير».')
);
children.push(A.gap(80));
children.push(A.h2('الدورة الكاملة'));
children.push(A.bullet('المستخدم يسأل سؤالاً.'));
children.push(A.bullet('النموذج يقرّر: هل أحتاج أداة؟ وأيّها؟ وبأي مدخلات؟'));
children.push(A.bullet('البرنامج — لا النموذج — ينفّذ الأداة فعلياً.'));
children.push(A.bullet('نتيجة الأداة تُعاد إلى النموذج.'));
children.push(A.bullet('النموذج يصوغ الجواب النهائي معتمداً على النتيجة الحقيقية.'));
children.push(A.gap(140));
children.push(
  A.arRuns([
    { text: 'نقطة جوهرية كثيراً ما تُساء: ', bold: true, color: A.C.heading },
    { text: 'النموذج لا ينفّذ الأداة بنفسه، بل يطلب تنفيذها فقط. التنفيذ يبقى في يد البرنامج — وهنا تُوضع كل قيود الأمان والصلاحيات.' },
  ])
);

children.push(A.h2('مثال عملي'));
children.push(A.ar('السؤال: «راتبي ٨٤٠٠ وعليه ضريبة ١٥٪، كم يبقى؟»'));
children.push(
  A.table(
    ['الطريقة', 'ما يحدث', 'النتيجة'],
    [
      ['نموذج لغوي مجرّد', 'يحاول الحساب ذهنياً داخل النص', 'قد يخطئ'],
      ['وكيل بأداة', 'يستدعي الحاسبة بالتعبير 8400*(1-15/100)', '7140 — مضمونة'],
    ],
    [2600, 3600, W - 6200],
    { boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.ar('الفرق ليس في الذكاء، بل في الاعتراف بالحدود واستخدام الأداة المناسبة. وهذا بالضبط ما يفعله المهندس حين يمسك الآلة الحاسبة بدل أن يحسب في رأسه.')
);
children.push(A.gap(120));
children.push(
  A.arRuns([
    { text: 'المثال البرمجي الكامل في الملف: ' },
    { text: 'examples/01_tool_use.py', ltr: true, bold: true, color: A.C.accent },
  ])
);

// ── المحور 2 ───────────────────────────────────────────────────────────────
children.push(A.h1('المحور الثاني: الوكلاء (Agents)'));
children.push(
  A.ar('استخدام الأداة خطوة واحدة. الوكيل هو ما يحدث حين نضع هذه الخطوة داخل حلقة.')
);
children.push(
  A.table(
    ['النمط', 'المسار'],
    [
      ['استخدام أداة', 'سؤال ← أداة واحدة ← جواب'],
      ['وكيل', 'سؤال ← فكّر ← نفّذ ← لاحظ ← فكّر ← ... حتى يكتمل الهدف'],
    ],
    [2600, W - 2600],
    { boldFirstCol: true }
  )
);
children.push(A.gap(200));
children.push(
  A.ar('هذا النمط معروف باسم ReAct، اختصاراً لـ Reasoning + Acting — أي التفكير والتنفيذ معاً. وجوهره أن الوكيل يرى نتيجة كل خطوة قبل أن يقرّر الخطوة التالية، ولهذا يستطيع معالجة مهام لا تُحلّ بخطوة واحدة.')
);

children.push(A.h2('أركان الوكيل الأربعة'));
children.push(
  A.table(
    ['الركن', 'وظيفته'],
    [
      ['الهدف (Goal)', 'ما المطلوب إنجازه — وهو مقياس التوقّف.'],
      ['الأدوات (Tools)', 'ما يستطيع الوكيل فعله في العالم.'],
      ['الذاكرة (Memory)', 'سجل ما نُفِّذ وما لوحِظ حتى الآن.'],
      ['شرط التوقّف', 'متى يتوقّف: باكتمال الهدف أو ببلوغ سقف الخطوات.'],
    ],
    [2600, W - 2600],
    { boldFirstCol: true }
  )
);

children.push(A.h2('مثال: طلب ثلاثة أجهزة'));
children.push(A.ar('الهدف: «أريد طلب ٣ لابتوبات — هل الكمية تكفي وكم التكلفة؟»'));
children.push(
  A.table(
    ['الخطوة', 'فكّر', 'نفّذ', 'لاحظ'],
    [
      ['١', 'أتحقّق من الكمية أولاً', 'stock', '12'],
      ['٢', 'الكمية تكفي، أحتاج السعر', 'price', '45000'],
      ['٣', 'أضرب السعر في العدد', 'calc', '135000'],
      ['٤', 'اكتملت المعلومات — أتوقّف', '—', 'الجواب النهائي'],
    ],
    [900, 3400, 1600, W - 5900],
    { ltrCols: [2] }
  )
);
children.push(A.gap(180));
children.push(A.ar('ثلاث ملاحظات على ما جرى:'));
children.push(A.bullet('كل خطوة بُنيت على نتيجة سابقتها — لم تكن الخطوات مرسومة سلفاً.'));
children.push(A.bullet('الوكيل توقّف بنفسه حين اكتمل الهدف، ولم نحدّد له عدد الخطوات.'));
children.push(A.bullet('لو كانت الكمية أقل من ٣ لأنهى المهمة مبكراً دون حساب التكلفة — لأنه لا معنى لها.'));
children.push(A.gap(120));
children.push(
  A.arRuns([
    { text: 'تحذير عملي: ', bold: true, color: A.C.heading },
    { text: 'كل وكيل يحتاج سقفاً أعلى لعدد الخطوات (MAX_STEPS). بدونه قد يدور الوكيل بلا نهاية عند أول خطأ متكرّر، ويستهلك تكلفة غير محدودة.' },
  ])
);
children.push(A.gap(120));
children.push(
  A.arRuns([
    { text: 'المثال البرمجي الكامل في الملف: ' },
    { text: 'examples/02_simple_agent.py', ltr: true, bold: true, color: A.C.accent },
  ])
);

// ── المحور 3 ───────────────────────────────────────────────────────────────
children.push(A.h1('المحور الثالث: الأنظمة متعددة الوكلاء (Multi-Agent Systems)'));
children.push(
  A.ar('حين تكبر المهمة، يصبح تحميل وكيل واحد كل المسؤوليات مصدراً للأخطاء: تعليماته تطول، وأدواته تكثر، ويختلط عليه الأمر. الحل هو ما يفعله أي فريق بشري — التخصّص.')
);
children.push(A.gap(80));
children.push(A.h2('مثال: إعداد تقرير مبيعات'));
children.push(
  A.table(
    ['الوكيل', 'دوره', 'مخرَجه'],
    [
      ['الباحث', 'يجمع البيانات الخام', 'بيانات المبيعات'],
      ['المحلّل', 'يحسب المؤشرات ويستخرج الدلالة', 'إجمالي ونِسب ونمو'],
      ['الكاتب', 'يصوغ التقرير بلغة مفهومة', 'نص التقرير'],
      ['المراجع', 'يفحص المخرَج ويقبله أو يردّه', 'قبول أو ملاحظات'],
    ],
    [1800, 3800, W - 5600],
    { boldFirstCol: true }
  )
);
children.push(A.gap(160));
children.push(
  A.ar('ويتولّى وكيل خامس — المنسّق (Orchestrator) — تمرير مخرَج كل وكيل مدخلاً للذي بعده، وإعادة العمل إن ردّه المراجع.')
);

children.push(A.h2('المكاسب والتكاليف'));
children.push(
  A.table(
    ['المكاسب', 'التكاليف'],
    [
      ['تعليمات كل وكيل أضيق وأوضح فتقلّ أخطاؤه', 'كل وكيل نداء إضافي للنموذج — التكلفة تتضاعف'],
      ['وكيل المراجعة يمسك الأخطاء قبل المستخدم', 'زمن الاستجابة يطول'],
      ['يسهل استبدال وكيل أو تطويره وحده', 'خطأ في وكيل مبكّر ينتقل إلى من بعده'],
      ['إمكانية تشغيل بعض الوكلاء بالتوازي', 'تعقيد أكبر في التتبّع وكشف الأعطال'],
    ],
    [4500, W - 4500]
  )
);
children.push(A.gap(180));
children.push(
  A.arRuns([
    { text: 'القاعدة العملية: ', bold: true, color: A.C.heading },
    { text: 'لا تلجأ إلى تعدّد الوكلاء إلا حين يعجز الوكيل الواحد فعلاً. التعقيد المبكّر يكلّف أكثر مما يفيد.' },
  ])
);
children.push(A.gap(120));
children.push(
  A.arRuns([
    { text: 'المثال البرمجي الكامل في الملف: ' },
    { text: 'examples/03_multi_agent.py', ltr: true, bold: true, color: A.C.accent },
  ])
);

// ── المحور 4 ───────────────────────────────────────────────────────────────
children.push(A.h1('المحور الرابع: الاتجاهات المستقبلية (Future Trends)'));
children.push(A.ar('ما الذي يتحرّك الآن، وإلى أين يتّجه المجال؟'));

children.push(A.h2('١) توحيد طريقة ربط الأدوات'));
children.push(
  A.ar('كانت كل منصّة تربط أدواتها بطريقتها الخاصة، فيُعاد كتابة العمل مع كل تغيير. ظهرت معايير مفتوحة — أبرزها Model Context Protocol (MCP) — لتوحيد الطريقة التي تُعرَّف بها الأداة وتُستدعى، فتُكتب الأداة مرة وتعمل مع أي نموذج.')
);

children.push(A.h2('٢) الذاكرة طويلة المدى'));
children.push(
  A.ar('وكيل اليوم ينسى كل شيء بانتهاء الجلسة. الاتجاه هو منحه ذاكرة دائمة يتذكّر بها تفضيلاتك وما تعلّمه من تعاملاته السابقة معك، فيتحسّن أداؤه مع الوقت بدل أن يبدأ من الصفر كل مرة.')
);

children.push(A.h2('٣) الوكلاء متعددو الوسائط'));
children.push(
  A.ar('لم يعد المدخل نصاً فقط. الوكيل يقرأ الصور والمخططات، ويستمع، ويرى الشاشة ويتحكّم فيها. وهذا يوسّع دائرة المهام من «معالجة النص» إلى «إنجاز العمل».')
);

children.push(A.h2('٤) الاستقلالية وحدودها'));
children.push(
  A.ar('كلما زادت استقلالية الوكيل زادت فائدته وزاد خطره معاً. ولهذا تتّجه الأنظمة الجادّة إلى تدرّج واضح في الصلاحيات:')
);
children.push(
  A.table(
    ['المستوى', 'الصلاحية', 'مثال'],
    [
      ['مقترِح', 'يقترح ولا ينفّذ', 'يكتب مسودّة بريد وينتظر موافقتك'],
      ['منفِّذ بإذن', 'ينفّذ بعد موافقة صريحة على كل خطوة', 'يطلب الإذن قبل إرسال البريد'],
      ['مستقلّ محدود', 'ينفّذ وحده داخل حدود مرسومة', 'يرد على الرسائل الروتينية فقط'],
      ['مستقلّ كامل', 'ينفّذ دون مراجعة', 'نادر — ويحتاج مبرّراً قوياً'],
    ],
    [1800, 3000, W - 4800],
    { boldFirstCol: true }
  )
);
children.push(A.gap(180));
children.push(
  A.ar('والقاعدة أن الصلاحية تُمنح بقدر الحاجة لا بقدر القدرة. فالخطأ في نص مقروء يُصحَّح، أما الخطأ في تحويل مالي أو حذف بيانات فقد لا يُستدرك.')
);

children.push(A.h2('٥) التحدّيات المفتوحة'));
children.push(A.bullet('الموثوقية: الوكيل الذي ينجح ٩٠٪ من المرات قد يكون غير صالح للاستخدام إن كانت الـ ١٠٪ مكلفة.'));
children.push(A.bullet('التكلفة: كل خطوة في الحلقة نداء مدفوع، والمهمة الطويلة تتحوّل إلى فاتورة طويلة.'));
children.push(A.bullet('الأمان: أداة تكتب في قاعدة بيانات أو ترسل بريداً تعني أن الخطأ يخرج إلى العالم ولا يبقى نصاً.'));
children.push(A.bullet('حقن التعليمات: محتوى خبيث في صفحة يقرأها الوكيل قد يحاول توجيهه لتنفيذ ما لم يطلبه المستخدم.'));
children.push(A.bullet('التقييم: كيف نقيس نجاح وكيل في مهمة مفتوحة لا إجابة وحيدة لها؟'));

// ── الخلاصة ────────────────────────────────────────────────────────────────
children.push(A.h1('الخلاصة: رؤية لما بعد الـ LLM'));
children.push(
  A.ar('لم يعد السؤال المطروح «ما أذكى نموذج؟» بل «ما أنفع نظام نبنيه حول النموذج؟». النموذج اللغوي صار مكوّناً — محرّكاً للاستدلال — داخل نظام أكبر فيه أدوات وذاكرة وحلقة تنفيذ وحدود صلاحيات.')
);
children.push(A.gap(120));
children.push(
  A.table(
    ['المحور', 'الخلاصة في سطر'],
    [
      ['استخدام الأدوات', 'النموذج يطلب، والبرنامج ينفّذ — وهنا تُوضع قيود الأمان.'],
      ['الوكلاء', 'الحلقة هي الفرق: فكّر ← نفّذ ← لاحظ، حتى يكتمل الهدف.'],
      ['تعدّد الوكلاء', 'التخصّص يقلّل الخطأ ويرفع التكلفة — استخدمه عند الحاجة فقط.'],
      ['المستقبل', 'معايير موحّدة، وذاكرة دائمة، وصلاحيات متدرّجة.'],
    ],
    [2400, W - 2400],
    { boldFirstCol: true }
  )
);
children.push(A.gap(240));
children.push(quote('المستقبل ليس نموذجاً أكبر، بل نظاماً أذكى حول النموذج.'));

// ── مراجع ──────────────────────────────────────────────────────────────────
children.push(A.h1('مراجع للاستزادة'));
children.push(A.gap(60));
children.push(en('ReAct: Synergizing Reasoning and Acting in Language Models'));
children.push(A.ar('الورقة التي أسّست نمط «فكّر ثم نفّذ» الذي بُني عليه المحور الثاني.', { size: 22, color: A.C.muted }));
children.push(A.gap(80));
children.push(en('Toolformer: Language Models Can Teach Themselves to Use Tools'));
children.push(A.ar('كيف يتعلّم النموذج بنفسه متى يستدعي أداة ومتى يجيب مباشرة.', { size: 22, color: A.C.muted }));
children.push(A.gap(80));
children.push(en('Model Context Protocol (MCP)'));
children.push(A.ar('معيار مفتوح لربط النماذج بالأدوات ومصادر البيانات بطريقة موحّدة.', { size: 22, color: A.C.muted }));

children.push(A.h1('ملحق: تشغيل الأمثلة'));
children.push(
  A.ar('الأمثلة الثلاثة تعمل بلا إنترنت وبلا مفتاح API، لأنها تحاكي استجابة النموذج بدالة بسيطة. الهدف منها توضيح البنية والمنطق لا استدعاء نموذج حقيقي، ولا تحتاج تثبيت أي مكتبة — تستخدم بايثون القياسية فقط.')
);
children.push(A.gap(80));
children.push(A.code('cd Sideg/projects/seminar-11-agents'));
children.push(A.code('python examples/01_tool_use.py'));
children.push(A.code('python examples/02_simple_agent.py'));
children.push(A.code('python examples/03_multi_agent.py'));

// ── المستند ────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: A.styles,
  numbering: A.numbering,
  sections: [
    {
      properties: A.pageSetup,
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              bidirectional: true,
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF', space: 4 } },
              children: [
                new TextRun({
                  text: 'السيمنار الحادي عشر — من النماذج اللغوية إلى الوكلاء الأذكياء',
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
