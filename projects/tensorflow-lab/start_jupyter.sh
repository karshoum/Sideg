#!/usr/bin/env bash
# ============================================================
#  Activates tf_env and opens Jupyter Lab in this folder.
#  Inside Jupyter choose the kernel:  Python (TensorFlow)
# ============================================================
set -euo pipefail

ENV_NAME="tf_env"
cd "$(dirname "$0")"

if ! command -v conda >/dev/null 2>&1; then
    echo "[ERROR] 'conda' was not found. Install Anaconda first."
    exit 1
fi

CONDA_BASE="$(conda info --base)"
# shellcheck disable=SC1091
source "${CONDA_BASE}/etc/profile.d/conda.sh"

if ! conda activate "${ENV_NAME}" 2>/dev/null; then
    echo "[ERROR] Could not activate ${ENV_NAME}. Run 'bash setup_unix.sh' first."
    exit 1
fi

echo "Starting Jupyter Lab ... (press Ctrl+C to stop the server)"
jupyter lab
