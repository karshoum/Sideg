"""
مشروع: توقع أسعار المنازل باستخدام شبكة عصبية اصطناعية (ANN)
=============================================================

الفكرة: بناء نموذج ذكاء اصطناعي يتوقع سعر المنزل بناءً على ثلاث خصائص:
    - مساحة المنزل   (Area)
    - عدد الغرف      (Rooms)
    - عمر المنزل     (Age)

هذه مسألة انحدار (Regression) وليست تصنيفاً: المخرج قيمة مستمرة (السعر)
وليس فئة، ولهذا تكون دالة تفعيل طبقة المخرجات هي `linear` وليست `sigmoid`.

التشغيل:
    conda activate tf_env
    python house_price_ann.py
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Dense

# تثبيت العشوائية حتى تكون النتائج قابلة للتكرار عند كل تشغيل
SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)


# ---------------------------------------------------------------------------
# 1) تجهيز البيانات
# ---------------------------------------------------------------------------
# لا يوجد ملف بيانات خارجي، لذلك نولّد بيانات اصطناعية بعلاقة معروفة مسبقاً.
# الفائدة: نستطيع الحكم على النموذج لأننا نعرف الإجابة الصحيحة نظرياً.
#
#   السعر = 2500×المساحة + 20000×الغرف - 3000×العمر + 50000 + ضوضاء
#
# الضوضاء تحاكي الواقع: منزلان بنفس المواصفات لا يُباعان بنفس السعر بالضبط.

N_SAMPLES = 1000

BASE_PRICE = 50_000     # السعر الأساسي لأي منزل
PRICE_PER_M2 = 2_500    # قيمة المتر المربع الواحد
PRICE_PER_ROOM = 20_000 # ما تضيفه الغرفة الواحدة
DEPRECIATION = 3_000    # ما يخسره المنزل من قيمته كل سنة


def generate_dataset(n_samples=N_SAMPLES):
    """يولّد جدول بيانات منازل بعلاقة خطية معلومة مضافاً إليها ضوضاء."""
    area = np.random.uniform(60, 250, n_samples)          # المساحة بالمتر المربع
    rooms = np.random.randint(1, 7, n_samples)            # عدد الغرف (قيمة منفصلة)
    age = np.random.uniform(0, 40, n_samples)             # عمر المنزل بالسنوات

    noise = np.random.normal(0, 15_000, n_samples)        # تشويش السوق

    price = (
        PRICE_PER_M2 * area
        + PRICE_PER_ROOM * rooms
        - DEPRECIATION * age
        + BASE_PRICE
        + noise
    )

    return pd.DataFrame({
        'area': area,
        'rooms': rooms,
        'age': age,
        'price': price,
    })


df = generate_dataset()

print("=" * 60)
print("1) البيانات")
print("=" * 60)
print(df.head())
print(f"\nعدد الصفوف: {len(df)}")
print(f"مدى الأسعار: من {df['price'].min():,.0f} إلى {df['price'].max():,.0f}")


# ---------------------------------------------------------------------------
# 2) فصل المدخلات عن المخرج
# ---------------------------------------------------------------------------
X = df[['area', 'rooms', 'age']].values   # ثلاث خصائص
y = df['price'].values                    # القيمة المستهدفة

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED
)

print(f"\nبيانات التدريب : {X_train.shape[0]} صف")
print(f"بيانات الاختبار: {X_test.shape[0]} صف")


# ---------------------------------------------------------------------------
# 3) معالجة البيانات — StandardScaler
# ---------------------------------------------------------------------------
# المشكلة: المساحة بالمئات، وعدد الغرف أرقام أحادية، والعمر بالعشرات.
# الشبكة العصبية تتعامل مع الأرقام الكبيرة على أنها "أهم"، وهذا خطأ.
# الحل: توحيد المقاييس بحيث يصبح لكل خاصية متوسط = 0 وانحراف معياري = 1.
#
# مهم: نُطبّق fit على بيانات التدريب فقط، ثم transform على الاختبار.
# لو عملنا fit على البيانات كلها لتسرّبت معلومات الاختبار إلى التدريب.

scaler_X = StandardScaler()
X_train_scaled = scaler_X.fit_transform(X_train)
X_test_scaled = scaler_X.transform(X_test)

# نوحّد مقياس السعر أيضاً لأن قيمه بمئات الآلاف، وهذا يجعل التدريب أكثر استقراراً
scaler_y = StandardScaler()
y_train_scaled = scaler_y.fit_transform(y_train.reshape(-1, 1))
y_test_scaled = scaler_y.transform(y_test.reshape(-1, 1))


# ---------------------------------------------------------------------------
# 4) بناء هيكل الشبكة
# ---------------------------------------------------------------------------
#   طبقة المدخلات : 3 خصائص
#   طبقة مخفية 1  : 8 عصبونات   — ReLU
#   طبقة مخفية 2  : 4 عصبونات   — ReLU
#   طبقة المخرجات : عصبون واحد  — Linear
#
# لماذا Linear في المخرج؟ لأن السعر قيمة مستمرة غير محدودة بمدى معيّن.
# استخدام sigmoid هنا خطأ شائع: فهي تحصر المخرج بين 0 و 1.

model = Sequential([
    Input(shape=(3,)),
    Dense(8, activation='relu'),
    Dense(4, activation='relu'),
    Dense(1, activation='linear'),
])

model.compile(
    optimizer='adam',
    loss='mse',              # متوسط مربع الخطأ — المعيار القياسي للانحدار
    metrics=['mae'],         # متوسط الخطأ المطلق — أسهل في التفسير
)

print("\n" + "=" * 60)
print("2) هيكل الشبكة")
print("=" * 60)
model.summary()


# ---------------------------------------------------------------------------
# 5) التدريب
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("3) التدريب")
print("=" * 60)

history = model.fit(
    X_train_scaled, y_train_scaled,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    verbose=0,               # اجعلها 1 إن أردت متابعة كل دورة
)

print(f"عدد الدورات (Epochs): {len(history.history['loss'])}")
print(f"الخسارة النهائية على التدريب : {history.history['loss'][-1]:.4f}")
print(f"الخسارة النهائية على التحقق  : {history.history['val_loss'][-1]:.4f}")


# ---------------------------------------------------------------------------
# 6) التقييم
# ---------------------------------------------------------------------------
# نُعيد المخرجات إلى وحدتها الأصلية (العملة) حتى تكون الأرقام مفهومة
y_pred_scaled = model.predict(X_test_scaled, verbose=0)
y_pred = scaler_y.inverse_transform(y_pred_scaled).flatten()

mae = np.mean(np.abs(y_pred - y_test))
rmse = np.sqrt(np.mean((y_pred - y_test) ** 2))

# معامل التحديد R² — كم من تغيّر السعر استطاع النموذج تفسيره (1.0 = مثالي)
ss_res = np.sum((y_test - y_pred) ** 2)
ss_tot = np.sum((y_test - np.mean(y_test)) ** 2)
r2 = 1 - (ss_res / ss_tot)

print("\n" + "=" * 60)
print("4) التقييم على بيانات لم يرها النموذج")
print("=" * 60)
print(f"متوسط الخطأ المطلق  (MAE) : {mae:,.0f}")
print(f"جذر متوسط مربع الخطأ (RMSE): {rmse:,.0f}")
print(f"معامل التحديد        (R²)  : {r2:.4f}")


# ---------------------------------------------------------------------------
# 7) التوقع على منازل جديدة
# ---------------------------------------------------------------------------
# ثلاثة منازل: صغير قديم، متوسط، كبير حديث.
new_houses = pd.DataFrame({
    'area':  [80,  130, 200],
    'rooms': [2,   3,   5],
    'age':   [20,  8,   2],
})

new_scaled = scaler_X.transform(new_houses.values)
predictions = scaler_y.inverse_transform(model.predict(new_scaled, verbose=0)).flatten()

print("\n" + "=" * 60)
print("5) توقع أسعار منازل جديدة")
print("=" * 60)
for i, row in new_houses.iterrows():
    print(
        f"مساحة {row['area']:>3.0f} م² | "
        f"{row['rooms']:.0f} غرف | "
        f"عمر {row['age']:>2.0f} سنة  ->  السعر المتوقع: {predictions[i]:>10,.0f}"
    )


# ---------------------------------------------------------------------------
# 8) قراءة النتائج
# ---------------------------------------------------------------------------
# القاعدة العملية للحكم على النموذج:
#   - سعر داخل مدى أسعار بيانات التدريب  -> توقع سليم
#   - سعر سالب أو خارج المدى بشكل كبير   -> مشكلة في التدريب
#     (الأسباب المعتادة: نسينا توحيد المقاييس، أو عدد الدورات قليل جداً،
#      أو استخدمنا دالة تفعيل غير مناسبة في طبقة المخرجات)

price_min, price_max = df['price'].min(), df['price'].max()
print("\n" + "=" * 60)
print("6) فحص سلامة التوقعات")
print("=" * 60)
print(f"مدى أسعار بيانات التدريب: {price_min:,.0f} إلى {price_max:,.0f}")

for i, p in enumerate(predictions, start=1):
    if p < 0:
        verdict = "سعر سالب — مشكلة واضحة في التدريب"
    elif price_min <= p <= price_max:
        verdict = "داخل المدى — توقع سليم"
    else:
        verdict = "خارج المدى — يستحق المراجعة"
    print(f"  المنزل {i}: {p:>10,.0f}  ->  {verdict}")

print("\nتم بنجاح.")
