"""
أول شبكة عصبية اصطناعية (ANN) — تصنيف ثنائي Binary Classification
النسخة النصية من كود المحاضرة، تعمل من سطر الأوامر مباشرة.

Run:  python first_ann.py
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.models import Sequential

# ثبّت العشوائية حتى تتكرر نفس النتائج عند كل تشغيل
# Fixed seed so every student gets reproducible numbers.
np.random.seed(42)
tf.random.set_seed(42)


# 1) إنشاء Dataset بسيطة للتدريب
data = {
    "feature1": [0.1, 0.2, 0.3, 0.4, 0.5],
    "feature2": [0.5, 0.4, 0.3, 0.2, 0.1],
    "label": [0, 0, 1, 1, 1],
}

# تحويل البيانات إلى DataFrame
df = pd.DataFrame(data)
print("\nالبيانات / Dataset:")
print(df, "\n")

# X = المدخلات (Features)
X = df[["feature1", "feature2"]].values

# y = الإجابات الصحيحة (Labels)
y = df["label"].values


# 2) إنشاء النموذج
model = Sequential(
    [
        Input(shape=(2,)),  # لدينا 2 Features
        Dense(8, activation="relu"),  # Hidden Layer فيها 8 Neurons
        Dense(1, activation="sigmoid"),  # Output Layer للتصنيف الثنائي
    ]
)

# 3) تجهيز النموذج للتدريب
model.compile(
    loss="binary_crossentropy",
    optimizer="adam",
    metrics=["accuracy"],
)

# 4) عرض ملخص الشبكة
model.summary()

# 5) تدريب النموذج
history = model.fit(
    X,
    y,
    epochs=100,
    batch_size=1,
    verbose=1,
)

# 6) اختبار النموذج على بيانات جديدة
test_data = np.array([[0.2, 0.4]])

prediction = model.predict(test_data, verbose=0)

predicted_label = (prediction > 0.5).astype(int)

# 7) طباعة النتيجة
print("\n" + "=" * 50)
print("Prediction probability:", prediction)
print("Predicted label:", predicted_label[0][0])
print("=" * 50)
