# معمل TensorFlow — حزمة جاهزة للتشغيل

حزمة كاملة لإعداد بيئة الذكاء الاصطناعي والتعلم العميق (`tf_env`) وتشغيل أول شبكة عصبية اصطناعية.
تعمل على **Windows** و **macOS** و **Linux**.

---

## المتطلب الوحيد قبل البدء

تثبيت **Anaconda** (أو Miniconda) من الموقع الرسمي:
👉 https://www.anaconda.com/download

بعد التثبيت **أعد تشغيل الجهاز** (أو على الأقل أغلق كل نوافذ الطرفية وافتح واحدة جديدة).

---

## طريقة التشغيل السريعة (موصى بها)

### على Windows

> **أولاً: احصل على المجلد.** إما بفك ضغط الحزمة التي وصلتك،
> أو بتنزيل المستودع كـ ZIP من زر **Code ← Download ZIP** في صفحة GitHub،
> أو `git clone https://github.com/karshoum/Sideg.git` إن كان `git` مثبتاً لديك.
> النتيجة واحدة في كل الحالات: مجلد اسمه `tensorflow-lab` يحتوي على هذه الملفات.

### على Windows

1. افتح **Anaconda Prompt** من قائمة ابدأ (Start Menu).
   > ⚠️ لا تستخدم CMD أو PowerShell العادي — لن يتعرّفا على أمر `conda`.
2. انتقل إلى مجلد المشروع. أسهل طريقة: اكتب `cd` ومسافة، ثم **اسحب المجلد
   بالفأرة وأفلته داخل نافذة الأوامر** فيُكتب المسار تلقائياً، ثم اضغط Enter.
   ```
   cd C:\Users\<اسمك>\Downloads\Sideg\projects\tensorflow-lab
   ```
3. شغّل ملف الإعداد:
   ```
   setup_windows.bat
   ```
4. انتظر حتى تظهر رسالة **DONE** (قد يستغرق التثبيت من 5 إلى 15 دقيقة حسب سرعة الإنترنت).
5. لفتح بيئة العمل:
   ```
   start_jupyter.bat
   ```

### على macOS أو Linux

افتح **Terminal** ثم انتقل إلى مجلد المشروع وشغّل الإعداد:

```bash
cd ~/Downloads/Sideg/projects/tensorflow-lab
bash setup_unix.sh
```

ولتشغيل بيئة العمل:

```bash
bash start_jupyter.sh
```

---

## ماذا يفعل ملف الإعداد بالضبط؟

هو ينفّذ نفس خطوات المحاضرة تلقائياً، خطوة بخطوة:

| # | الخطوة | الأمر المكافئ |
|---|---|---|
| 1 | إنشاء البيئة الافتراضية | `conda create -n tf_env python=3.10` |
| 2 | تفعيل البيئة | `conda activate tf_env` |
| 3 | تثبيت المكتبات | `pip install -r requirements.txt` |
| 4 | ربط البيئة بـ Jupyter | `python -m ipykernel install --user --name tf_env --display-name "Python (TensorFlow)"` |
| 5 | التحقق من نجاح التثبيت | `python verify_install.py` |

الملف **آمن للتشغيل أكثر من مرة**: إذا كانت البيئة موجودة مسبقاً فلن يعيد إنشاءها، وإذا فشلت خطوة يمكنك إصلاح المشكلة وإعادة التشغيل من جديد.

---

## الطريقة اليدوية (إن أردت تنفيذ الأوامر بنفسك)

داخل **Anaconda Prompt**:

```bash
conda create -n tf_env python=3.10
conda activate tf_env
pip install tensorflow numpy pandas matplotlib scikit-learn
pip install ipykernel jupyterlab
python -m ipykernel install --user --name tf_env --display-name "Python (TensorFlow)"
jupyter lab
```

للتحقق من نجاح التثبيت:

```python
import tensorflow as tf
print(tf.__version__)
```

---

## محتويات المشروع

```
projects/tensorflow-lab/
├── README.md                    ← هذا الملف
├── requirements.txt             ← قائمة المكتبات المطلوبة
├── environment.yml              ← بديل لإنشاء البيئة بأمر conda واحد
├── setup_windows.bat            ← إعداد تلقائي لويندوز
├── setup_unix.sh                ← إعداد تلقائي لماك/لينكس
├── start_jupyter.bat            ← تشغيل Jupyter Lab (ويندوز)
├── start_jupyter.sh             ← تشغيل Jupyter Lab (ماك/لينكس)
├── verify_install.py            ← فحص شامل للبيئة والمكتبات
├── first_ann.py                 ← كود الشبكة العصبية (نسخة سطر الأوامر)
└── notebooks/
    └── 01_first_ann.ipynb       ← كود المحاضرة مشروحاً خطوة بخطوة
```

---

## بعد فتح Jupyter Lab

1. ستفتح صفحة في المتصفح تلقائياً.
2. من الشجرة على اليسار افتح: `notebooks` ← `01_first_ann.ipynb`
3. **مهم جداً:** تأكد أن النواة (Kernel) المكتوبة أعلى اليمين هي **Python (TensorFlow)**.
   إن لم تكن كذلك، اضغط عليها واخترها من القائمة.
4. شغّل الخلايا بالترتيب بـ `Shift + Enter`.

لتشغيل الكود بدون Jupyter من الطرفية مباشرة:

```bash
conda activate tf_env
python first_ann.py
```

---

## حل المشكلات الشائعة

**`'conda' is not recognized as an internal or external command`**
أنت في CMD أو PowerShell العادي. أغلقه وافتح **Anaconda Prompt** من قائمة ابدأ.

**التثبيت بطيء جداً أو ينقطع**
حزمة TensorFlow حجمها كبير (‏~600 ميجابايت). تأكد من ثبات الاتصال وأعد تشغيل ملف الإعداد — سيكمل من حيث توقف.

**`ERROR: Could not find a version that satisfies the requirement tensorflow`**
غالباً إصدار بايثون غير متوافق. تأكد أن البيئة أُنشئت بـ Python 3.10:
```bash
conda activate tf_env
python --version
```
إن لم تكن 3.10، احذف البيئة وأعد الإعداد:
```bash
conda deactivate
conda env remove -n tf_env
```

**النواة `Python (TensorFlow)` لا تظهر في Jupyter**
أعد تنفيذ خطوة الربط داخل البيئة المفعّلة:
```bash
conda activate tf_env
python -m ipykernel install --user --name tf_env --display-name "Python (TensorFlow)"
```
ثم أعد تشغيل Jupyter Lab.

**رسائل مثل `oneDNN custom operations are on` أو `Could not find TensorRT`**
هذه **تحذيرات وليست أخطاء** — تجاهلها تماماً، الكود يعمل بشكل سليم.

**`No GPU found` / الجهاز يستخدم المعالج فقط**
هذا طبيعي ومتوقع. تمارين المعمل صغيرة وتعمل على المعالج (CPU) بسرعة ممتازة.
> للعلم: إصدارات TensorFlow بعد 2.10 لا تدعم كرت الشاشة على Windows أصلاً إلا عبر WSL2.

**أريد البدء من الصفر**
```bash
conda deactivate
conda env remove -n tf_env
```
ثم شغّل ملف الإعداد مرة أخرى.

---

## ملاحظة عن الرسائل داخل ملفات الإعداد

رسائل ملفات `.bat` و `.sh` مكتوبة بالإنجليزية عمداً، لأن نافذة الأوامر في ويندوز
لا تعرض العربية بشكل صحيح في كثير من الأجهزة. الشرح الكامل بالعربية موجود هنا وداخل الـ Notebook.
