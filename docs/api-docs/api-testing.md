# API Testing Guide (Postman/curl)

## Конфигурация

```
BASE_URL = https://curptkobrzebusvleadw.supabase.co
ANON_KEY = sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL
```

---

## 1. Регистрация User A

**POST** `{{BASE_URL}}/auth/v1/signup`

Headers:

```
apikey: {{ANON_KEY}}
Content-Type: application/json
```

Body:

```json
{
  "email": "usera@test.com",
  "password": "password123"
}
```

**Сохрани из ответа:**

- `access_token` → `TOKEN_A`
- `user.id` → `USER_ID_A`

---

## 2. Регистрация User B

**POST** `{{BASE_URL}}/auth/v1/signup`

Body:

```json
{
  "email": "userb@test.com",
  "password": "password123"
}
```

**Сохрани из ответа:**

- `access_token` → `TOKEN_B`
- `user.id` → `USER_ID_B`

---

## 3. User A создаёт задачу

**POST** `{{BASE_URL}}/rest/v1/tasks`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_A}}
Content-Type: application/json
Prefer: return=representation
```

Body:

```json
{
  "user_id": "{{USER_ID_A}}",
  "title": "Task from User A",
  "status": "open"
}
```

**Ожидаемый результат:** 201 Created, задача создана

---

## 4. User A получает свои задачи

**GET** `{{BASE_URL}}/rest/v1/tasks?select=*`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_A}}
```

**Ожидаемый результат:** массив с 1 задачей ("Task from User A")

---

## 5. User B получает свои задачи (ТЕСТ RLS!)

**GET** `{{BASE_URL}}/rest/v1/tasks?select=*`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_B}}
```

**Ожидаемый результат:** `[]` (пустой массив!)

User B НЕ видит задачи User A — RLS работает! ✅

---

## 6. User B создаёт свою задачу

**POST** `{{BASE_URL}}/rest/v1/tasks`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_B}}
Content-Type: application/json
Prefer: return=representation
```

Body:

```json
{
  "user_id": "{{USER_ID_B}}",
  "title": "Task from User B",
  "status": "in_progress"
}
```

---

## 7. User B получает свои задачи

**GET** `{{BASE_URL}}/rest/v1/tasks?select=*`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_B}}
```

**Ожидаемый результат:** массив с 1 задачей ("Task from User B")

---

## 8. User B пытается удалить задачу User A (ТЕСТ RLS!)

**DELETE** `{{BASE_URL}}/rest/v1/tasks?id=eq.{{TASK_ID_A}}`

Headers:

```
apikey: {{ANON_KEY}}
Authorization: Bearer {{TOKEN_B}}
```

**Ожидаемый результат:** 0 строк удалено (RLS блокирует!)

---

## Curl примеры

### Регистрация:

```bash
curl -X POST "https://curptkobrzebusvleadw.supabase.co/auth/v1/signup" \
  -H "apikey: sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL" \
  -H "Content-Type: application/json" \
  -d '{"email": "usera@test.com", "password": "password123"}'
```

### Логин (если уже зарегистрирован):

```bash
curl -X POST "https://curptkobrzebusvleadw.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL" \
  -H "Content-Type: application/json" \
  -d '{"email": "usera@test.com", "password": "password123"}'
```

### Получить задачи:

```bash
curl "https://curptkobrzebusvleadw.supabase.co/rest/v1/tasks?select=*" \
  -H "apikey: sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Создать задачу:

```bash
curl -X POST "https://curptkobrzebusvleadw.supabase.co/rest/v1/tasks" \
  -H "apikey: sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"user_id": "YOUR_USER_ID", "title": "My Task", "status": "open"}'
```

---

## Чеклист тестирования

- [ ] User A зарегистрировался
- [ ] User B зарегистрировался
- [ ] User A создал задачу
- [ ] User A видит свою задачу
- [ ] User B видит пустой список (RLS!)
- [ ] User B создал свою задачу
- [ ] User B видит только свою задачу
- [ ] User B не может удалить задачу User A (RLS!)
