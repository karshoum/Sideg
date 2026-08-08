"""
التحقق من نجاح تثبيت بيئة المعمل (tf_env).
Verifies that every required library is installed and importable.

Run:  python verify_install.py
"""

import platform
import sys

REQUIRED = [
    ("numpy", "numpy"),
    ("pandas", "pandas"),
    ("matplotlib", "matplotlib"),
    ("sklearn", "scikit-learn"),
    ("tensorflow", "tensorflow"),
]


def main() -> int:
    print("=" * 58)
    print("  فحص بيئة المعمل  |  Lab environment check")
    print("=" * 58)
    print(f"Python      : {platform.python_version()}")
    print(f"Interpreter : {sys.executable}")
    print("-" * 58)

    missing = []
    for module_name, package_name in REQUIRED:
        try:
            module = __import__(module_name)
        except ImportError:
            print(f"[MISSING] {package_name}")
            missing.append(package_name)
            continue
        version = getattr(module, "__version__", "unknown")
        print(f"[  OK   ] {package_name:<14} {version}")

    print("-" * 58)

    if missing:
        print("\nناقص / Missing:", ", ".join(missing))
        print("ثبّتها بالأمر / install with:")
        print("    python -m pip install -r requirements.txt")
        return 1

    # فحص إضافي: هل يستطيع TensorFlow بناء وتشغيل عملية فعلية؟
    import tensorflow as tf

    result = tf.constant([[1.0, 2.0]]) @ tf.constant([[3.0], [4.0]])
    print(f"TensorFlow smoke test  : 1*3 + 2*4 = {float(result.numpy()[0][0]):.0f}  (expected 11)")

    gpus = tf.config.list_physical_devices("GPU")
    print(f"Detected GPUs          : {len(gpus)}  " + ("(CPU only — هذا طبيعي)" if not gpus else ""))

    print("\n✅ البيئة جاهزة تمامًا. Environment is ready.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
