---
name: openspec-apply-change
description: Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
---

Implement tasks from an OpenSpec change.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/opsx:apply <other>`).

2. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - `contextFiles`: artifact ID -> array of concrete file paths (varies by schema - could be proposal/specs/design/tasks or spec/tests/implementation/docs)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using openspec-continue-change
   - If `state: "all_done"`: congratulate, suggest archive
   - Otherwise: proceed to implementation

4. **Read context files**

   Read every file path listed under `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Implement tasks with Shift-Left Testing (loop until done or blocked)**

   For each pending task:

   a. **Task Scope & Time Check (2-3h limit):**
      - Đánh giá xem task này có thể hoàn thành xuất sắc trong vòng 2-3 giờ hay không.
      - Nếu task quá lớn, có nguy cơ kéo dài hơn 3 giờ, hệ thống **MUST** thảo luận với người học để chia nhỏ task đó thành các sub-tasks độc lập có phạm vi rõ ràng hơn trước khi bắt đầu.

   b. **Phân loại Task (Backend vs Frontend):**
      - **Nếu là Task Frontend:**
        - Tập trung phát triển code giao diện trực tiếp.
        - Không viết unit test tự động (để tiết kiệm chi phí bảo trì).
        - Thực hiện **Manual Visual Verification** (Tự kiểm thử trực quan trên trình duyệt) sau khi hoàn thành.
      - **Nếu là Task Backend (Quy trình TDD thực chứng bắt buộc):**
        1. **Thiết lập Kịch bản Kiểm thử Rút gọn (Short Test Scenarios):** Trước khi viết bất kỳ code logic nào, xác định 3-5 kịch bản test cốt lõi:
           - *Happy Path:* Dữ liệu chuẩn, chạy thành công.
           - *Failure Modes & Edge Cases (Quan trọng nhất):* Dữ liệu sai cấu trúc/validation fail, lỗi kết nối DB, lỗi API bên thứ ba.
        2. **Viết Unit Test trước (Test-First):**
           - Triển khai các kịch bản này thành các file unit test (sử dụng Jest và các bộ mock/testing utility của NestJS).
           - Chạy test để thấy test FAIL (đúng tinh thần Red-Green-Refactor).
           - *Quy tắc Coverage:* Tuyệt đối không cố gắng đạt 100% coverage vô nghĩa cho boilerplate code (DTOs, entities). Chỉ tập trung chứng thực business logic lõi và các trường hợp lỗi (failure paths) để tối ưu hóa thời gian và tài nguyên.
        3. **Viết Code Nghiệp vụ để pass Test:**
           - Viết code logic tối giản để các kịch bản test chuyển sang màu xanh (Green).
           - Tối ưu hóa code (Refactor) nếu cần thiết.

   c. **Execute Changes:**
      - Tiến hành các chỉnh sửa code cần thiết một cách tập trung và cô lập.
      - Đảm bảo tuân thủ nguyên tắc "Cô lập sự thay đổi" (Clean Architecture).

   d. **Mark Task Complete:**
      - Đánh dấu hoàn thành task trong file tasks: `- [ ]` -> `- [x]`.
      - Chuyển sang task tiếp theo.

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

7. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest archive
   - If paused: explain why and wait for guidance

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
