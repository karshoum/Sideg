# أدوات توليد ملفات Word

هذا المجلد **ليس مشروعاً** — هو أدوات مساعدة على مستوى المستودع، مثل `_template/`.

ملفات `report.docx` و `seminar.docx` الموجودة داخل المشاريع **جاهزة للاستخدام مباشرة**،
وتُفتح في Word أو WPS أو Google Docs بالنقر المزدوج. **لا تحتاج هذه الأدوات إطلاقاً**
إلا إن أردت إعادة توليد المستندات برمجياً بعد تعديل محتواها في الكود.

> إن كان كل ما تريده هو قراءة تقرير أو تعديله، فافتح ملف `.docx` في Word وتجاهل هذا المجلد.

---

## المحتويات

```
_tools/docx/
├── README.md                    ← هذا الملف
├── arabic.js                    ← أدوات ملفات الشرح (تنسيق كامل: عناوين، جداول، ترويسة)
├── submission_lib.js            ← أدوات ملفات التسليم (تنسيق مبسّط مطابق للأصل)
├── build_house_report.js        ← يولّد house-price-ann/explanation.docx
├── build_house_submission.js    ← يولّد house-price-ann/submission.docx
├── build_seminar.js             ← يولّد seminar-11-agents/explanation.docx
└── build_seminar_submission.js  ← يولّد seminar-11-agents/submission.docx
```

لكل مشروع ملفان: **`submission.docx`** للتسليم و **`explanation.docx`** للشرح.

---

## التشغيل

المتطلب: **Node.js 18** أو أحدث.

```bash
cd _tools/docx
npm install docx

node build_house_report.js       ../../projects/house-price-ann/explanation.docx
node build_house_submission.js   ../../projects/house-price-ann/submission.docx
node build_seminar.js            ../../projects/seminar-11-agents/explanation.docx
node build_seminar_submission.js ../../projects/seminar-11-agents/submission.docx
```

---

## لماذا سكربتات بدل كتابة الملفات يدوياً؟

- **المحتوى في نص عادي** يظهر تغيّره في `git diff`، بخلاف ملف `.docx` الثنائي.
- **إعادة التوليد لحظية** عند تغيّر أرقام النتائج بعد تشغيل جديد للنموذج.
- **تنسيق موحّد** بين كل مستندات المستودع من ملف `arabic.js` واحد.

---

## ملاحظة على العربية داخل Word

بناء مستند عربي سليم يحتاج ثلاثة أشياء في كل عنصر، وهي مطبّقة في `arabic.js`:

| العنصر | الإعداد المطلوب |
|---|---|
| الفقرة | `bidirectional: true` مع `alignment: START` |
| النص | `rightToLeft: true` |
| الجدول | `visuallyRightToLeft: true` |

### مصيدتان تستحقان الانتباه

**١) `START` وليس `RIGHT`.** داخل فقرة عربية تُفسَّر قيم المحاذاة على أنها نسبية
لاتجاه الفقرة لا لاتجاه الصفحة، فتنقلب النتيجة عكس المتوقع:

| القيمة | أين يظهر النص فعلياً |
|---|---|
| `START` | يمين الصفحة ✅ وهو المطلوب |
| `END` | يسار الصفحة |
| `RIGHT` | **يسار** الصفحة ⚠️ عكس ما يوحي به الاسم |

**٢) لا تكتب `rightToLeft: false`.** في النص الإنجليزي احذف الخاصية تماماً بدل
تصفيرها، لأن `w:rtl w:val="false"` الصريح يربك محاذاة بعض القارئات فيقفز النص
إلى الجهة الخطأ. ولهذا تبني الدالة `runOpts` في الملفين خيارات النص بحذف الخاصية
لا بتصفيرها.

ولإجبار جزء إنجليزي أو رقمي على العرض من اليسار لليمين داخل جملة عربية
(مثل `3 → 8 → 4 → 1`)، يُحاط الجزء بالرمزين غير المرئيين `U+202A` و `U+202C`.

---

## معاينة النتيجة

للتأكد من شكل المستند قبل تسليمه، حوّله إلى صور:

```bash
soffice --headless --convert-to pdf report.docx
pdftoppm -jpeg -r 85 report.pdf page
```
