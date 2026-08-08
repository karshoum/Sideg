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
├── README.md                ← هذا الملف
├── arabic.js                ← أدوات مشتركة لبناء مستندات عربية (RTL)
├── build_house_report.js    ← يولّد projects/house-price-ann/report.docx
└── build_seminar.js         ← يولّد projects/seminar-11-agents/seminar.docx
```

---

## التشغيل

المتطلب: **Node.js 18** أو أحدث.

```bash
cd _tools/docx
npm install docx
node build_house_report.js ../../projects/house-price-ann/report.docx
node build_seminar.js      ../../projects/seminar-11-agents/seminar.docx
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
| الفقرة | `bidirectional: true` مع `alignment: RIGHT` |
| النص | `rightToLeft: true` |
| الجدول | `visuallyRightToLeft: true` |

ولإجبار جزء إنجليزي أو رقمي على العرض من اليسار لليمين داخل جملة عربية
(مثل `3 → 8 → 4 → 1`)، يُحاط الجزء بالرمزين غير المرئيين `U+202A` و `U+202C`.

---

## معاينة النتيجة

للتأكد من شكل المستند قبل تسليمه، حوّله إلى صور:

```bash
soffice --headless --convert-to pdf report.docx
pdftoppm -jpeg -r 85 report.pdf page
```
