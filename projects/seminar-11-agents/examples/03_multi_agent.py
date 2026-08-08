"""
المثال الثالث: الأنظمة متعددة الوكلاء (Multi-Agent Systems)
============================================================

بدل وكيل واحد يحاول أن يفعل كل شيء، نوزّع العمل على وكلاء متخصّصين،
ويتولّى وكيل منسّق (Orchestrator) تمرير العمل بينهم.

المهمة في هذا المثال: إعداد تقرير قصير عن مبيعات فرع.

  الباحث  (Researcher) : يجمع البيانات الخام.
  المحلّل  (Analyst)    : يحسب المؤشرات ويستخرج الدلالة.
  الكاتب  (Writer)     : يصوغ التقرير النهائي بلغة مفهومة.
  المراجع (Reviewer)   : يفحص المخرَج ويطلب التصحيح إن لزم.

لماذا نفعل هذا؟ لأن كل وكيل يحمل تعليمات وأدوات أضيق وأوضح،
فتقلّ أخطاؤه — وهو المبدأ نفسه الذي يجعل الفريق البشري المتخصّص
أفضل من شخص واحد يحاول إتقان كل المهن.

التشغيل:
    python 03_multi_agent.py
"""

# ---------------------------------------------------------------------------
# البيانات الخام (تمثّل قاعدة بيانات أو ملفاً)
# ---------------------------------------------------------------------------

SALES_DATA = {
    "الفرع": "فرع الخرطوم",
    "الشهر": "يونيو",
    "المبيعات": [
        {"المنتج": "لابتوب", "العدد": 34, "سعر الوحدة": 45000},
        {"المنتج": "طابعة", "العدد": 18, "سعر الوحدة": 18000},
        {"المنتج": "شاشة", "العدد": 52, "سعر الوحدة": 22000},
    ],
    "مبيعات الشهر السابق": 2_450_000,
}


# ---------------------------------------------------------------------------
# الوكلاء
# ---------------------------------------------------------------------------


class Agent:
    """وكيل بدور محدّد. في نظام حقيقي يكون `role` هو تعليمات النظام للنموذج."""

    def __init__(self, name, role):
        self.name = name
        self.role = role

    def log(self, message):
        print(f"  [{self.name}] {message}")


class Researcher(Agent):
    def __init__(self):
        super().__init__("الباحث", "يجمع البيانات الخام من المصادر المتاحة")

    def run(self, _task):
        self.log("أجمع بيانات المبيعات من قاعدة البيانات...")
        self.log(f"وجدت {len(SALES_DATA['المبيعات'])} منتجات في {SALES_DATA['الفرع']}")
        return SALES_DATA


class Analyst(Agent):
    def __init__(self):
        super().__init__("المحلّل", "يحسب المؤشرات ويستخرج الدلالة من الأرقام")

    def run(self, data):
        self.log("أحسب الإيراد لكل منتج...")

        per_product = {}
        for row in data["المبيعات"]:
            per_product[row["المنتج"]] = row["العدد"] * row["سعر الوحدة"]

        total = sum(per_product.values())
        previous = data["مبيعات الشهر السابق"]
        growth = ((total - previous) / previous) * 100

        best = max(per_product, key=per_product.get)

        self.log(f"الإجمالي: {total:,} — النمو: {growth:+.1f}%")

        return {
            "الفرع": data["الفرع"],
            "الشهر": data["الشهر"],
            "لكل منتج": per_product,
            "الإجمالي": total,
            "النمو": growth,
            "الأعلى": best,
        }


class Writer(Agent):
    def __init__(self):
        super().__init__("الكاتب", "يصوغ التقرير النهائي بلغة مفهومة")

    def run(self, analysis):
        self.log("أصوغ التقرير...")

        direction = "ارتفاعاً" if analysis["النمو"] > 0 else "انخفاضاً"

        lines = [
            f"تقرير مبيعات {analysis['الفرع']} — شهر {analysis['الشهر']}",
            "",
            f"بلغ إجمالي المبيعات {analysis['الإجمالي']:,} وحدة نقدية، "
            f"مسجّلاً {direction} بنسبة {abs(analysis['النمو']):.1f}٪ عن الشهر السابق.",
            "",
            f"تصدّر منتج «{analysis['الأعلى']}» قائمة المبيعات. التفصيل:",
        ]
        for product, revenue in sorted(analysis["لكل منتج"].items(),
                                       key=lambda kv: kv[1], reverse=True):
            share = (revenue / analysis["الإجمالي"]) * 100
            lines.append(f"  - {product}: {revenue:,}  ({share:.1f}٪ من الإجمالي)")

        return "\n".join(lines)


class Reviewer(Agent):
    def __init__(self):
        super().__init__("المراجع", "يفحص المخرَج ويقبله أو يطلب التصحيح")

    def run(self, report):
        self.log("أراجع التقرير...")

        problems = []
        if len(report) < 100:
            problems.append("التقرير قصير جداً")
        if "٪" not in report and "%" not in report:
            problems.append("لا توجد نسب مئوية")
        if "تقرير" not in report:
            problems.append("لا يوجد عنوان واضح")

        if problems:
            self.log("مشاكل: " + " · ".join(problems))
            return {"مقبول": False, "الملاحظات": problems}

        self.log("التقرير مقبول.")
        return {"مقبول": True, "الملاحظات": []}


# ---------------------------------------------------------------------------
# المنسّق
# ---------------------------------------------------------------------------


def orchestrate(task):
    print("=" * 66)
    print(f"المهمة: {task}")
    print("=" * 66)

    researcher, analyst, writer, reviewer = Researcher(), Analyst(), Writer(), Reviewer()

    print("\n--- المرحلة 1: جمع البيانات ---")
    raw = researcher.run(task)

    print("\n--- المرحلة 2: التحليل ---")
    analysis = analyst.run(raw)

    print("\n--- المرحلة 3: الصياغة ---")
    report = writer.run(analysis)

    print("\n--- المرحلة 4: المراجعة ---")
    verdict = reviewer.run(report)

    if not verdict["مقبول"]:
        print("\n(في نظام حقيقي تُعاد المهمة إلى الكاتب مع الملاحظات)")

    return report


if __name__ == "__main__":
    final_report = orchestrate("أعدّ تقريراً عن مبيعات الفرع لهذا الشهر")

    print("\n" + "=" * 66)
    print("التقرير النهائي")
    print("=" * 66)
    print(final_report)

    print("\n" + "=" * 66)
    print("ملاحظات على النمط:")
    print("  1) كل وكيل يعرف مهمة واحدة فقط — تعليماته أوضح فتقلّ أخطاؤه.")
    print("  2) المنسّق يمرّر مخرَج كل وكيل مدخلاً للذي بعده.")
    print("  3) وكيل المراجعة يمسك الأخطاء قبل أن تصل للمستخدم.")
    print("  4) العيب: كل وكيل نداء إضافي — تكلفة أعلى ووقت أطول.")
    print("=" * 66)
