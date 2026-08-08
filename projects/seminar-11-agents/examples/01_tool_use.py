"""
المثال الأول: استخدام الأدوات (Tool Use)
=========================================

الفكرة: النموذج اللغوي لا يحسب ولا يعرف الطقس ولا يقرأ قاعدة بياناتك.
لكنه يستطيع أن يقول: "أحتاج أداة اسمها كذا، بهذه المدخلات".
البرنامج هو من ينفّذ الأداة فعلياً ويعيد له النتيجة.

هذا المثال يعمل بلا إنترنت وبلا مفتاح API — استجابة النموذج مُحاكاة
بدالة بسيطة، لأن الهدف توضيح البنية لا استدعاء نموذج حقيقي.

التشغيل:
    python 01_tool_use.py
"""

import json
import re

# ---------------------------------------------------------------------------
# 1) الأدوات المتاحة
# ---------------------------------------------------------------------------
# كل أداة دالة بايثون عادية. لا شيء سحري هنا.


def calculator(expression: str) -> str:
    """يحسب تعبيراً رياضياً بسيطاً."""
    # نسمح بالأرقام والعمليات الأساسية فقط — لا ننفّذ نصاً عشوائياً
    if not re.fullmatch(r'[0-9+\-*/(). ]+', expression):
        return "خطأ: التعبير يحتوي على رموز غير مسموح بها"
    try:
        return str(eval(expression, {"__builtins__": {}}, {}))
    except Exception as exc:
        return f"خطأ في الحساب: {exc}"


def get_exchange_rate(currency: str) -> str:
    """يعيد سعر صرف عملة مقابل الجنيه (بيانات ثابتة للتوضيح)."""
    rates = {"USD": 601.5, "EUR": 655.0, "SAR": 160.4, "AED": 163.8}
    key = currency.upper()
    if key not in rates:
        return f"العملة {key} غير معروفة. المتاح: {', '.join(rates)}"
    return f"{rates[key]}"


def word_count(text: str) -> str:
    """يعدّ كلمات نص."""
    return str(len(text.split()))


# سجلّ الأدوات: الاسم -> (الدالة، الوصف)
# الوصف مهم جداً — منه يعرف النموذج متى يستدعي كل أداة.
TOOLS = {
    "calculator": (calculator, "يحسب تعبيراً رياضياً. المدخل: تعبير مثل 8400*0.85"),
    "exchange_rate": (get_exchange_rate, "سعر صرف عملة. المدخل: رمز العملة مثل USD"),
    "word_count": (word_count, "يعدّ كلمات نص. المدخل: النص"),
}


# ---------------------------------------------------------------------------
# 2) محاكاة النموذج اللغوي
# ---------------------------------------------------------------------------
# في الواقع هذه الدالة تكون نداءً لواجهة نموذج لغوي، والنموذج يعيد JSON
# يقول فيه: إما "استدعِ هذه الأداة" أو "هذا هو الجواب النهائي".
# نحاكيها هنا بقواعد بسيطة حتى يعمل المثال بلا إنترنت.


def fake_llm(question: str) -> dict:
    """تُرجع قرار النموذج: استدعاء أداة، أو جواب نهائي."""
    q = question.lower()

    if "ضريبة" in question or "خصم" in question:
        numbers = re.findall(r'\d+\.?\d*', question)
        if len(numbers) >= 2:
            salary, tax = numbers[0], numbers[1]
            return {
                "action": "tool",
                "tool": "calculator",
                "input": f"{salary}*(1-{tax}/100)",
            }

    if "دولار" in question or "usd" in q:
        return {"action": "tool", "tool": "exchange_rate", "input": "USD"}

    if "كم كلمة" in question:
        return {"action": "tool", "tool": "word_count", "input": question}

    return {"action": "answer", "output": "لا أملك أداة مناسبة لهذا السؤال."}


# ---------------------------------------------------------------------------
# 3) الحلقة: سؤال -> قرار -> تنفيذ الأداة -> جواب
# ---------------------------------------------------------------------------


def answer(question: str) -> str:
    print(f"\nالسؤال: {question}")

    decision = fake_llm(question)
    print(f"  قرار النموذج: {json.dumps(decision, ensure_ascii=False)}")

    if decision["action"] == "answer":
        return decision["output"]

    tool_name = decision["tool"]
    if tool_name not in TOOLS:
        return f"الأداة {tool_name} غير موجودة."

    func, _description = TOOLS[tool_name]
    result = func(decision["input"])
    print(f"  نتيجة الأداة: {result}")

    # في نظام حقيقي تُعاد النتيجة إلى النموذج ليصوغ منها جملة طبيعية
    return f"الناتج: {result}"


if __name__ == "__main__":
    print("=" * 60)
    print("الأدوات المتاحة للنموذج:")
    print("=" * 60)
    for name, (_f, desc) in TOOLS.items():
        print(f"  - {name}: {desc}")

    for q in [
        "راتبي 8400 وعليه ضريبة 15 بالمئة، كم يبقى؟",
        "كم سعر الدولار اليوم؟",
        "كم كلمة في هذه الجملة القصيرة؟",
        "ما رأيك في الطقس غداً؟",
    ]:
        print("-" * 60)
        print(f"  => {answer(q)}")

    print("\n" + "=" * 60)
    print("الخلاصة: النموذج لم يحسب شيئاً بنفسه.")
    print("هو فقط اختار الأداة المناسبة، والبرنامج هو من نفّذها.")
    print("=" * 60)
