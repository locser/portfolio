#!/usr/bin/env bash
# scripts/notify-discord.sh
# Gửi alert Discord cho GitLab CI (build/deploy thành công & thất bại)
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
JOB_STATUS="${CI_JOB_STATUS:-}"

# --- Trạng thái & màu tự động phát hiện ---
if [ -z "${1:-}" ] && [ ! -z "$JOB_STATUS" ]; then
  # Tự động map từ CI_JOB_STATUS (khi gọi không tham số trong after_script)
  STAGE_UPPER=$(echo "$STAGE_NAME" | tr 'a-z' 'A-Z')
  if [ "$JOB_STATUS" = "success" ]; then
    TITLE="✅ STAGE ${STAGE_UPPER} THÀNH CÔNG"
    COLOR="3066993" # Xanh lá (0x2ECC71)
    STATUS_DESC="Job [\`${JOB_NAME}\`] chạy thành công."
  elif [ "$JOB_STATUS" = "failed" ]; then
    TITLE="🚨 STAGE ${STAGE_UPPER} THẤT BẠI"
    COLOR="15158332" # Đỏ (0xE74C3C)
    STATUS_DESC="Job [\`${JOB_NAME}\`] bị lỗi."
  else
    TITLE="⚠️ STAGE ${STAGE_UPPER} BÌ HỦY"
    COLOR="16776960" # Vàng (0xF1C40F)
    STATUS_DESC="Job [\`${JOB_NAME}\`] đã bị hủy."
  fi
else
  TITLE="${1:-🚨 DEPLOY THẤT BẠI}"
  COLOR="${2:-15158332}"
  STATUS_DESC="${3:-Đã tự động rollback hệ thống}"
fi

# --- Tính toán thời gian chạy tự động từ CI_JOB_STARTED_AT ---
DURATION="${4:-}"
if [ -z "$DURATION" ] && [ ! -z "${CI_JOB_STARTED_AT:-}" ]; then
  START_TS=$(date -d "$CI_JOB_STARTED_AT" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$CI_JOB_STARTED_AT" +%s 2>/dev/null || echo "")
  if [ ! -z "$START_TS" ]; then
    NOW_TS=$(date +%s)
    DURATION=$((NOW_TS - START_TS))
  fi
fi

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

# --- Tạo danh sách fields động ---
FIELDS_JSON="[]"

add_field() {
  local name="$1"
  local value="$2"
  local inline="${3:-true}"
  
  if command -v jq >/dev/null 2>&1; then
    FIELDS_JSON=$(echo "$FIELDS_JSON" | jq --arg name "$name" --arg value "$value" --argjson inline "$inline" '. += [{"name": $name, "value": $value, "inline": $inline}]')
  else
    local comma=""
    if [ "$FIELDS_JSON" != "[]" ]; then
      comma=","
    fi
    FIELDS_JSON="${FIELDS_JSON%]}"
    if [ "$FIELDS_JSON" = "[" ]; then
      FIELDS_JSON="[{\"name\":\"$name\",\"value\":\"$value\",\"inline\":$inline}]"
    else
      FIELDS_JSON="$FIELDS_JSON,{\"name\":\"$name\",\"value\":\"$value\",\"inline\":$inline}]"
    fi
  fi
}

# Thêm các field chung
add_field "📦 Dự án" "\`${P_NAME}\`" "true"
add_field "🌿 Nhánh" "\`${P_BRANCH}\`" "true"
add_field "⏱️ Stage" "\`${P_STAGE}\`" "true"
add_field "👤 Người thực hiện" "${P_AUTHOR}" "false"
add_field "📝 Commit" "\`${P_SHA}\` — ${P_COMMIT_MSG}" "false"

# Thêm thời gian chạy nếu có
if [ ! -z "$DURATION" ]; then
  DURATION_STR=""
  if [[ "$DURATION" =~ ^[0-9]+$ ]]; then
    MIN=$((DURATION / 60))
    SEC=$((DURATION % 60))
    if [ $MIN -gt 0 ]; then
      DURATION_STR="${MIN}m ${SEC}s"
    else
      DURATION_STR="${SEC}s"
    fi
  else
    DURATION_STR="$DURATION"
  fi
  add_field "⏱️ Thời gian chạy" "\`${DURATION_STR}\`" "true"
fi

# Thêm thông tin lỗi/rollback nếu là deploy thất bại
if [[ "$TITLE" =~ "THẤT BẠI" || "$TITLE" =~ "FAIL" || "$TITLE" =~ "🚨" ]]; then
  add_field "❌ Job thất bại" "\`${P_JOB}\`" "true"
  if [ "$PREVIOUS_TAG" != "N/A" ] && [ ! -z "$PREVIOUS_TAG" ]; then
    add_field "↩️ Đã khôi phục về" "Tag: \`${P_TAG}\`" "true"
  fi
fi

# --- Build embed ---
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
    "fields": ${FIELDS_JSON},
    "footer": {
      "text": "GitLab CI • Hệ thống giám sát tự động"
    },
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }]
}
EOF
)

# --- Gửi ---
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