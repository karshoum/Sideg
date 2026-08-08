#!/usr/bin/env bash
# ============================================================
#  TensorFlow Lab - Automatic setup for macOS / Linux
#  Usage:  bash setup_unix.sh
#  (Arabic step-by-step guide: see README.md)
# ============================================================
set -euo pipefail

ENV_NAME="tf_env"
PY_VERSION="3.10"

cd "$(dirname "$0")"

echo
echo "============================================================"
echo "  TensorFlow Lab setup  |  environment: ${ENV_NAME}"
echo "============================================================"
echo

# --- 1) Make sure conda is available -------------------------
if ! command -v conda >/dev/null 2>&1; then
    echo "[ERROR] 'conda' was not found."
    echo "        Install Anaconda (or Miniconda) first, then open a new"
    echo "        terminal and run this script again."
    exit 1
fi

# Make 'conda activate' usable from inside a script.
CONDA_BASE="$(conda info --base)"
# shellcheck disable=SC1091
source "${CONDA_BASE}/etc/profile.d/conda.sh"

# --- 2) Create the environment if it does not exist ----------
if conda env list | awk '{print $1}' | grep -qx "${ENV_NAME}"; then
    echo "[1/4] Environment ${ENV_NAME} already exists - skipping creation."
else
    echo "[1/4] Creating environment ${ENV_NAME} with Python ${PY_VERSION} ..."
    conda create -n "${ENV_NAME}" "python=${PY_VERSION}" -y
fi

# --- 3) Activate --------------------------------------------
echo "[2/4] Activating ${ENV_NAME} ..."
conda activate "${ENV_NAME}"

# --- 4) Install the libraries --------------------------------
echo "[3/4] Installing TensorFlow and the data libraries ..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# --- 5) Register the Jupyter kernel --------------------------
echo "[4/4] Registering the Jupyter kernel ..."
python -m ipykernel install --user --name "${ENV_NAME}" --display-name "Python (TensorFlow)"

echo
echo "------------------------------------------------------------"
echo " Verifying the installation ..."
echo "------------------------------------------------------------"
python verify_install.py

echo
echo "============================================================"
echo "  DONE. Next step: bash start_jupyter.sh"
echo "============================================================"
