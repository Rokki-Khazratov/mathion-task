#!/bin/bash

# ============================================
# Mathion Task App - API Test Script
# ============================================

BASE_URL="https://curptkobrzebusvleadw.supabase.co"
ANON_KEY="sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL"

# Pre-authenticated tokens
TOKEN_A="eyJhbGciOiJIUzI1NiIsImtpZCI6InRuTHc4MDNmZG1FVmJMYVUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2N1cnB0a29icnplYnVzdmxlYWR3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4YTg5YTMwZi1hZmEzLTRlNWYtYTQxNC02ZTEwMGRlZDQ4ZjgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0NjQ1ODQwLCJpYXQiOjE3NjQ2NDIyNDAsImVtYWlsIjoicm9ra2lraGF6cmF0b3ZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InJva2tpa2hhenJhdG92QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjhhODlhMzBmLWFmYTMtNGU1Zi1hNDE0LTZlMTAwZGVkNDhmOCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzY0NjQyMjQwfV0sInNlc3Npb25faWQiOiIzZTE3MDY2Mi1iZWM4LTQ4NzktOTE4MS00NWMzMDA2NmMwNWIiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.etNdUw0CtFIa5TnKTT6GmEYG7qfbwSdlwZd87DC1PUM"

TOKEN_B="eyJhbGciOiJIUzI1NiIsImtpZCI6InRuTHc4MDNmZG1FVmJMYVUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2N1cnB0a29icnplYnVzdmxlYWR3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0NWZhYzJmZS01MTJmLTQ0NjItODExMS03MTI2ODA5NTVhMWIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY0NjQ1ODU5LCJpYXQiOjE3NjQ2NDIyNTksImVtYWlsIjoibWFyY28xMTMxbWNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6Im1hcmNvMTEzMW1jQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjQ1ZmFjMmZlLTUxMmYtNDQ2Mi04MTExLTcxMjY4MDk1NWExYiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzY0NjQyMjU5fV0sInNlc3Npb25faWQiOiIyN2VmYWUzMS0yZTlkLTQyY2QtYjg0Mi01NDBiNjk1MzI0Y2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.4BlXIuYo_GgAj_7fSQry0lgavS7m_iEK22jOi4i4ZjA"

# User IDs extracted from tokens
USER_ID_A="8a89a30f-afa3-4e5f-a414-6e100ded48f8"
USER_ID_B="45fac2fe-512f-4462-8111-712680955a1b"

# Test results tracking
PASSED=0
FAILED=0

echo "============================================"
echo "🚀 Starting API Tests"
echo "============================================"
echo "User A ID: $USER_ID_A"
echo "User B ID: $USER_ID_B"
echo ""

# ============================================
# 1. Create Task for User A
# ============================================
echo "📝 [1] Creating task for User A..."
CREATE_TASK_A=$(curl -s -X POST "$BASE_URL/rest/v1/tasks" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"user_id\": \"$USER_ID_A\",
    \"title\": \"Task from User A\",
    \"description\": \"This is a test task from User A\",
    \"status\": \"open\",
    \"deadline\": \"2025-12-31\"
  }")

TASK_ID_A=$(echo $CREATE_TASK_A | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TASK_ID_A" ]; then
  echo "❌ FAILED: Could not create task"
  echo "   Response: $CREATE_TASK_A"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED: Task created"
  echo "   Task ID: $TASK_ID_A"
  PASSED=$((PASSED + 1))
fi

# ============================================
# 2. Get Tasks for User A
# ============================================
echo ""
echo "📝 [2] Getting tasks for User A..."
GET_TASKS_A=$(curl -s "$BASE_URL/rest/v1/tasks?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A")

TASK_COUNT_A=$(echo $GET_TASKS_A | grep -o '"id"' | wc -l | tr -d ' ')

if [ "$TASK_COUNT_A" -ge 1 ]; then
  echo "✅ PASSED: User A sees $TASK_COUNT_A task(s)"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: User A should see at least 1 task"
  echo "   Response: $GET_TASKS_A"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 3. Update Task for User A
# ============================================
echo ""
echo "📝 [3] Updating task for User A..."
UPDATE_TASK_A=$(curl -s -X PATCH "$BASE_URL/rest/v1/tasks?id=eq.$TASK_ID_A" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"title\": \"Updated Task from User A\",
    \"status\": \"in_progress\"
  }")

UPDATED_TITLE=$(echo $UPDATE_TASK_A | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$UPDATED_TITLE" = "Updated Task from User A" ]; then
  echo "✅ PASSED: Task updated successfully"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: Task update failed"
  echo "   Response: $UPDATE_TASK_A"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 4. RLS TEST - User B tries to see User A's tasks
# ============================================
echo ""
echo "📝 [4] RLS TEST: User B getting tasks (should be empty)..."
GET_TASKS_B=$(curl -s "$BASE_URL/rest/v1/tasks?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_B")

TASK_COUNT_B=$(echo $GET_TASKS_B | grep -o '"id"' | wc -l | tr -d ' ')

if [ "$GET_TASKS_B" = "[]" ] || [ "$TASK_COUNT_B" -eq 0 ]; then
  echo "✅ PASSED: RLS works! User B sees 0 tasks (empty array)"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: RLS broken! User B can see tasks:"
  echo "   Response: $GET_TASKS_B"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 5. RLS TEST - User B tries to delete User A's task
# ============================================
echo ""
echo "📝 [5] RLS TEST: User B trying to delete User A's task..."
DELETE_BY_B=$(curl -s -X DELETE "$BASE_URL/rest/v1/tasks?id=eq.$TASK_ID_A" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Prefer: return=representation")

# Check if task still exists (User A should still see it)
VERIFY_TASK=$(curl -s "$BASE_URL/rest/v1/tasks?id=eq.$TASK_ID_A&select=id" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A")

if echo "$VERIFY_TASK" | grep -q "$TASK_ID_A"; then
  echo "✅ PASSED: RLS works! User B cannot delete User A's task"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: RLS broken! User B deleted User A's task"
  echo "   Response: $DELETE_BY_B"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 6. Create task for User B
# ============================================
echo ""
echo "📝 [6] Creating task for User B..."
CREATE_TASK_B=$(curl -s -X POST "$BASE_URL/rest/v1/tasks" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"user_id\": \"$USER_ID_B\",
    \"title\": \"Task from User B\",
    \"description\": \"This is a test task from User B\",
    \"status\": \"done\"
  }")

TASK_ID_B=$(echo $CREATE_TASK_B | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TASK_ID_B" ]; then
  echo "❌ FAILED: Could not create task for User B"
  echo "   Response: $CREATE_TASK_B"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED: User B's task created"
  echo "   Task ID: $TASK_ID_B"
  PASSED=$((PASSED + 1))
fi

# ============================================
# 7. Verify isolation - User B sees only their task
# ============================================
echo ""
echo "📝 [7] Verifying User B sees only their task..."
GET_TASKS_B_FINAL=$(curl -s "$BASE_URL/rest/v1/tasks?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_B")

TASK_COUNT_B_FINAL=$(echo $GET_TASKS_B_FINAL | grep -o '"id"' | wc -l | tr -d ' ')

if [ "$TASK_COUNT_B_FINAL" -eq 1 ]; then
  echo "✅ PASSED: User B sees exactly 1 task (their own)"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: User B should see exactly 1 task, but sees $TASK_COUNT_B_FINAL"
  echo "   Response: $GET_TASKS_B_FINAL"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 8. Verify isolation - User A sees only their task
# ============================================
echo ""
echo "📝 [8] Verifying User A sees only their task..."
GET_TASKS_A_FINAL=$(curl -s "$BASE_URL/rest/v1/tasks?select=*" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A")

TASK_COUNT_A_FINAL=$(echo $GET_TASKS_A_FINAL | grep -o '"id"' | wc -l | tr -d ' ')

if [ "$TASK_COUNT_A_FINAL" -eq 1 ]; then
  echo "✅ PASSED: User A sees exactly 1 task (their own)"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: User A should see exactly 1 task, but sees $TASK_COUNT_A_FINAL"
  echo "   Response: $GET_TASKS_A_FINAL"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 9. Delete task for User A (cleanup)
# ============================================
echo ""
echo "📝 [9] Deleting task for User A (cleanup)..."
DELETE_TASK_A=$(curl -s -X DELETE "$BASE_URL/rest/v1/tasks?id=eq.$TASK_ID_A" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Prefer: return=representation")

if echo "$DELETE_TASK_A" | grep -q "$TASK_ID_A"; then
  echo "✅ PASSED: Task deleted successfully"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: Task deletion failed"
  echo "   Response: $DELETE_TASK_A"
  FAILED=$((FAILED + 1))
fi

# ============================================
# 10. Delete task for User B (cleanup)
# ============================================
echo ""
echo "📝 [10] Deleting task for User B (cleanup)..."
DELETE_TASK_B=$(curl -s -X DELETE "$BASE_URL/rest/v1/tasks?id=eq.$TASK_ID_B" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Prefer: return=representation")

if echo "$DELETE_TASK_B" | grep -q "$TASK_ID_B"; then
  echo "✅ PASSED: Task deleted successfully"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAILED: Task deletion failed"
  echo "   Response: $DELETE_TASK_B"
  FAILED=$((FAILED + 1))
fi

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo "📊 TEST SUMMARY"
echo "============================================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED!"
  echo ""
  echo "✅ CRUD Operations: OK"
  echo "✅ RLS (Row Level Security): OK"
  echo "✅ Data Isolation: OK"
else
  echo "⚠️  SOME TESTS FAILED"
fi

echo "============================================"
