"""
المثال الثاني: حلقة الوكيل (Agent Loop)
========================================

الفرق بين "استخدام أداة" و "وكيل" هو الحلقة.

  استخدام أداة : سؤال ← أداة واحدة ← جواب.            (خطوة واحدة)
  وكيل         : سؤال ← فكّر ← نفّذ ← لاحظ ← فكّر ...  (حتى يكتمل الهدف)

هذا النمط معروف باسم ReAct — اختصار Reasoning + Acting.
الوكيل يرى نتيجة كل خطوة قبل أن يقرّر الخطوة التالية، ولهذا يستطيع
معالجة مهام لا تُحلّ بخطوة واحدة.

التشغيل:
    python 02_simple_agent.py
"""

import re

MAX_STEPS = 6   # سقف أمان: بدونه قد يدور الوكيل إلى ما لا نهاية


# ---------------------------------------------------------------------------
# الأدوات
# ---------------------------------------------------------------------------

INVENTORY = {
    "لابتوب": {"سعر": 45000, "الكمية": 12},
    "طابعة": {"سعر": 18000, "الكمية": 5},
    "شاشة": {"سعر": 22000, "الكمية": 0},
}


def lookup_price(item: str) -> str:
    item = item.strip()
    if item not in INVENTORY:
        return f"غير موجود: {item}"
    return str(INVENTORY[item]["سعر"])


def lookup_stock(item: str) -> str:
    item = item.strip()
    if item not in INVENTORY:
        return f"غير موجود: {item}"
    return str(INVENTORY[item]["الكمية"])


def calculate(expression: str) -> str:
    if not re.fullmatch(r'[0-9+\-*/(). ]+', expression):
        return "تعبير غير صالح"
    try:
        return str(eval(expression, {"__builtins__": {}}, {}))
    except Exception as exc:
        return f"خطأ: {exc}"


TOOLS = {
    "price": lookup_price,
    "stock": lookup_stock,
    "calc": calculate,
}


# ---------------------------------------------------------------------------
# الوكيل
# ---------------------------------------------------------------------------
# `scratchpad` هو ذاكرة الوكيل: كل ما نفّذه وكل ما لاحظه حتى الآن.
# في نظام حقيقي يُمرَّر هذا السجل كاملاً إلى النموذج في كل دورة،
# فيقرأ تاريخه ويقرّر بناءً عليه. نحاكي القرار هنا بقواعد بسيطة.


def think(goal: str, scratchpad: list) -> dict:
    """يقرّر الخطوة التالية اعتماداً على الهدف وما جرى حتى الآن."""
    done = {entry["tool"] for entry in scratchpad}

    # المهمة: "اطلب 3 لابتوبات — هل الكمية تكفي وكم التكلفة؟"
    if "stock" not in done:
        return {"thought": "أولاً أتحقّق من توفّر الكمية في المخزن.",
                "tool": "stock", "input": "لابتوب"}

    available = int(scratchpad[-1]["observation"])
    if available < 3:
        return {"thought": f"الكمية المتاحة {available} لا تكفي الطلب. لا داعي لحساب التكلفة.",
                "final": f"لا يمكن تنفيذ الطلب — المتاح {available} فقط والمطلوب 3."}

    if "price" not in done:
        return {"thought": "الكمية تكفي. الآن أحتاج سعر الوحدة.",
                "tool": "price", "input": "لابتوب"}

    if "calc" not in done:
        unit_price = scratchpad[-1]["observation"]
        return {"thought": "عندي السعر والكمية. أضربهما لأحصل على التكلفة.",
                "tool": "calc", "input": f"{unit_price}*3"}

    total = scratchpad[-1]["observation"]
    return {"thought": "اكتملت كل المعلومات المطلوبة.",
            "final": f"الكمية متوفّرة، والتكلفة الإجمالية لثلاثة أجهزة: {total}"}


def run_agent(goal: str) -> str:
    print("=" * 64)
    print(f"الهدف: {goal}")
    print("=" * 64)

    scratchpad = []   # ذاكرة الوكيل

    for step in range(1, MAX_STEPS + 1):
        decision = think(goal, scratchpad)

        print(f"\nالخطوة {step}")
        print(f"  فكّر  : {decision['thought']}")

        if "final" in decision:
            print(f"  انتهى : {decision['final']}")
            return decision["final"]

        tool_name = decision["tool"]
        observation = TOOLS[tool_name](decision["input"])

        print(f"  نفّذ  : {tool_name}('{decision['input']}')")
        print(f"  لاحظ  : {observation}")

        scratchpad.append({
            "tool": tool_name,
            "input": decision["input"],
            "observation": observation,
        })

    return "توقّف الوكيل: تجاوز الحد الأقصى للخطوات."


if __name__ == "__main__":
    result = run_agent("أريد طلب 3 لابتوبات — هل الكمية تكفي وكم التكلفة الإجمالية؟")

    print("\n" + "=" * 64)
    print("النتيجة النهائية:", result)
    print("=" * 64)
    print("\nلاحظ ثلاثة أمور:")
    print("  1) كل خطوة بُنيت على نتيجة الخطوة التي قبلها.")
    print("  2) الوكيل توقّف بنفسه حين اكتمل الهدف — لم نحدّد له عدد الخطوات.")
    print("  3) سقف MAX_STEPS ضروري، وإلا دار الوكيل بلا نهاية عند أول خطأ.")
