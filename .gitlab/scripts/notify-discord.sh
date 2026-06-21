#!/usr/bin/env bash
# scripts/notify-discord.sh
# Gửi alert Discord cho GitLab CI (build fail / deploy fail)
set -euo pipefail


: "${DISCORD_WEBHOOK_URL:?Missing DISCORD_WEBHOOK_URL}"

# --- Đọc biến GitLab (fallback an toàn) ---
PROJECT_NAME="${CI_PROJECT_NAME:-unknown}"
BRANCH="${CI_COMMIT_BRANCH:-${CI_COMMIT_REF_NAME:-unknown}}"
COMMIT_SHA="${CI_COMMIT_SHORT_SHA:-unknown}"
COMMIT_MSG="${CI_COMMIT_TITLE:-}"
COMMIT_AUTHOR="${CI_COMMIT_AUTHOR:-unknown}"
PIPELINE_URL="${CI_PIPELINE_URL:-}"
JOB_URL="${CI_JOB_URL:-}"
COMMIT_URL="${CI_COMMIT_URL:-}"
PREVIOUS_TAG="${PREVIOUS_TAG:-N/A}"
STAGE_NAME="${CI_JOB_STAGE:-build}"
JOB_NAME="${CI_JOB_NAME:-unknown}"

# --- Trạng thái & màu ---
TITLE="${1:-🚨 DEPLOY THẤT BẠI}"
COLOR="${2:-15158332}"      # 0xE74C3C đỏ
STATUS_DESC="${3:-Đã tự động rollback hệ thống}"

# --- Escape JSON an toàn ---
json_escape() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$1" | jq -R . | sed 's/^"//; s/"$//'
  elif command -v python3 >/dev/null 2>&1; then
    printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' | sed 's/^"//; s/"$//'
  else
    # Fallback an toàn dùng sed
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
  fi
}


P_NAME=$(json_escape "$PROJECT_NAME")
P_BRANCH=$(json_escape "$BRANCH")
P_AUTHOR=$(json_escape "$COMMIT_AUTHOR")
P_SHA=$(json_escape "$COMMIT_SHA")
P_TAG=$(json_escape "$PREVIOUS_TAG")
P_STAGE=$(json_escape "$STAGE_NAME")
P_JOB=$(json_escape "$JOB_NAME")
P_TITLE=$(json_escape "$TITLE")
P_DESC=$(json_escape "$STATUS_DESC")
P_COMMIT_MSG=$(json_escape "$COMMIT_MSG" | cut -c1-80)

# --- Build embed (multi-line, dễ đọc) ---
PAYLOAD=$(cat <<EOF
{
  "username": "GitLab CI",
  "avatar_url": "https://about.gitlab.com/images/press/logo/svg/gitlab-icon-rgb.svg",
  "embeds": [{
    "title": "${P_TITLE}",
    "description": "${P_DESC}\\n\\n[🔗 Pipeline](${PIPELINE_URL})  |  [📜 Job Log](${JOB_URL})  |  [📝 Commit](${COMMIT_URL})",
    "url": "${PIPELINE_URL}",
    "color": ${COLOR},
    "thumbnail": {
      "url": "https://about.gitlab.com/images/press/logo/svg/gitlab-icon-rgb.svg"
    },
    "fields": [
      {
        "name": "📦 Dự án",
        "value": "\`${P_NAME}\`",
        "inline": true
      },
      {
        "name": "🌿 Nhánh",
        "value": "\`${P_BRANCH}\`",
        "inline": true
      },
      {
        "name": "⏱️ Stage",
        "value": "\`${P_STAGE}\`",
        "inline": true
      },
      {
        "name": "👤 Người thực hiện",
        "value": "${P_AUTHOR}",
        "inline": false
      },
      {
        "name": "📝 Commit",
        "value": "\`${P_SHA}\` — ${P_COMMIT_MSG}",
        "inline": false
      },
      {
        "name": "❌ Job thất bại",
        "value": "\`${P_JOB}\`",
        "inline": true
      },
      {
        "name": "↩️ Đã khôi phục về",
        "value": "Tag: \`${P_TAG}\`",
        "inline": true
      }
    ],
    "footer": {
      "text": "GitLab CI • Hệ thống giám sát tự động"
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }]
}
EOF
)

# --- Gửi ---
# Tạo file tạm để chứa response body
RESPONSE_FILE=$(mktemp)

HTTP_CODE=$(curl -s -o "$RESPONSE_FILE" -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "${PAYLOAD}" \
  "${DISCORD_WEBHOOK_URL}")

if [[ "${HTTP_CODE}" =~ ^2 ]]; then
  echo "✅ Discord alert sent (HTTP ${HTTP_CODE})"
  rm -f "$RESPONSE_FILE"
else
  echo "❌ Discord alert failed (HTTP ${HTTP_CODE})" >&2
  echo "Chi tiết phản hồi lỗi từ Discord:" >&2
  cat "$RESPONSE_FILE" >&2
  rm -f "$RESPONSE_FILE"
  exit 1
fi