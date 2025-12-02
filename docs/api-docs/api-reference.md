# Supabase API Reference - Mathion Task App

## Конфигурация

```
BASE_URL = https://curptkobrzebusvleadw.supabase.co
ANON_KEY = sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL
```

---

## Authentication Endpoints

### 1. Регистрация (Sign Up)

**POST** `{{BASE_URL}}/auth/v1/signup`

**Headers:**
```
apikey: {{ANON_KEY}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "email_confirmed_at": null,
  "confirmation_sent_at": "2025-12-02T...",
  ...
}
```

**Примечание:** После регистрации нужно подтвердить email (если включено) или использовать login endpoint.

---

### 2. Логин (Sign In)

**POST** `{{BASE_URL}}/auth/v1/token?grant_type=password`

**Headers:**
```
apikey: {{ANON_KEY}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

**Важно:** Сохрани `access_token` для всех последующих запросов!

---

### 3. Выход (Sign Out)

**POST** `{{BASE_URL}}/auth/v1/logout`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (204):** No Content

---

## Tasks Endpoints

### Базовая структура запросов

Все запросы к tasks требуют:
- `apikey: {{ANON_KEY}}` в headers
- `Authorization: Bearer {{ACCESS_TOKEN}}` в headers (после логина)

---

### 1. Получить все задачи текущего пользователя

**GET** `{{BASE_URL}}/rest/v1/tasks?select=*`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Query Parameters:**
- `select=*` - выбрать все поля
- `order=created_at.desc` - сортировка (опционально)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Task",
    "description": "Task description",
    "status": "open",
    "deadline": "2025-12-31",
    "created_at": "2025-12-02T00:00:00Z",
    "updated_at": "2025-12-02T00:00:00Z"
  }
]
```

**RLS:** Автоматически возвращает только задачи текущего пользователя.

---

### 2. Получить задачу по ID

**GET** `{{BASE_URL}}/rest/v1/tasks?id=eq.{{TASK_ID}}&select=*`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Task",
    ...
  }
]
```

**RLS:** Вернёт задачу только если она принадлежит текущему пользователю.

---

### 3. Создать задачу

**POST** `{{BASE_URL}}/rest/v1/tasks`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
Prefer: return=representation
```

**Body:**
```json
{
  "user_id": "{{USER_ID}}",
  "title": "My New Task",
  "description": "Optional description",
  "status": "open",
  "deadline": "2025-12-31"
}
```

**Обязательные поля:**
- `user_id` - должен совпадать с ID из токена (`auth.uid()`)
- `title` - обязательное
- `status` - обязательное, одно из: `"open"`, `"in_progress"`, `"done"`

**Опциональные поля:**
- `description` - текст описания
- `deadline` - дата в формате `YYYY-MM-DD`

**Response (201):**
```json
[
  {
    "id": "new-uuid",
    "user_id": "uuid",
    "title": "My New Task",
    "description": "Optional description",
    "status": "open",
    "deadline": "2025-12-31",
    "created_at": "2025-12-02T00:00:00Z",
    "updated_at": "2025-12-02T00:00:00Z"
  }
]
```

**RLS:** Автоматически проверяет что `user_id` совпадает с текущим пользователем.

---

### 4. Обновить задачу

**PATCH** `{{BASE_URL}}/rest/v1/tasks?id=eq.{{TASK_ID}}`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
Prefer: return=representation
```

**Body (можно обновить только нужные поля):**
```json
{
  "title": "Updated Title",
  "status": "in_progress",
  "description": "Updated description",
  "deadline": "2026-01-15"
}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Updated Title",
    "status": "in_progress",
    ...
  }
]
```

**RLS:** Можно обновить только свои задачи.

---

### 5. Удалить задачу

**DELETE** `{{BASE_URL}}/rest/v1/tasks?id=eq.{{TASK_ID}}`

**Headers:**
```
apikey: {{ANON_KEY}}
Authorization: Bearer {{ACCESS_TOKEN}}
Prefer: return=representation
```

**Response (204):** No Content (или 200 с пустым массивом если используется `Prefer: return=representation`)

**RLS:** Можно удалить только свои задачи.

---

## Data Models

### Task

```typescript
interface Task {
  id: string;                    // UUID, primary key
  user_id: string;               // UUID, foreign key → auth.users(id)
  title: string;                 // Required, text
  description: string | null;    // Optional, text
  status: 'open' | 'in_progress' | 'done';  // Required, enum
  deadline: string | null;       // Optional, date (YYYY-MM-DD)
  created_at: string;            // Timestamp, auto-generated
  updated_at: string;            // Timestamp, auto-updated on change
}
```

### User (from Auth)

```typescript
interface User {
  id: string;                    // UUID
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## Row Level Security (RLS)

Все политики RLS автоматически применяются:

1. **SELECT:** Пользователь видит только свои задачи (`auth.uid() = user_id`)
2. **INSERT:** Пользователь может создать задачу только для себя (`auth.uid() = user_id`)
3. **UPDATE:** Пользователь может обновить только свои задачи (`auth.uid() = user_id`)
4. **DELETE:** Пользователь может удалить только свои задачи (`auth.uid() = user_id`)

**Важно:** Даже если в запросе указать чужой `user_id`, RLS автоматически отфильтрует или отклонит запрос.

---

## Error Handling

### Типичные ошибки:

**401 Unauthorized:**
```json
{
  "message": "JWT expired",
  "code": "PGRST301"
}
```
→ Нужно обновить токен через refresh_token или залогиниться заново.

**400 Bad Request:**
```json
{
  "message": "new row violates row-level security policy",
  "code": "42501"
}
```
→ Попытка создать/изменить задачу с неправильным `user_id`.

**404 Not Found:**
→ Задача не существует или не принадлежит текущему пользователю.

---

## Примеры использования (JavaScript/TypeScript)

### Инициализация Supabase клиента

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://curptkobrzebusvleadw.supabase.co';
const supabaseAnonKey = 'sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Регистрация

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

### Логин

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

const accessToken = data.session?.access_token;
```

### Получить все задачи

```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .order('created_at', { ascending: false });
```

### Создать задачу

```typescript
const { data: { user } } = await supabase.auth.getUser();

const { data, error } = await supabase
  .from('tasks')
  .insert({
    user_id: user.id,
    title: 'My Task',
    description: 'Description',
    status: 'open',
    deadline: '2025-12-31',
  })
  .select()
  .single();
```

### Обновить задачу

```typescript
const { data, error } = await supabase
  .from('tasks')
  .update({
    title: 'Updated Title',
    status: 'in_progress',
    updated_at: new Date().toISOString(),
  })
  .eq('id', taskId)
  .select()
  .single();
```

### Удалить задачу

```typescript
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId);
```

### Получить текущего пользователя

```typescript
const { data: { user } } = await supabase.auth.getUser();
const userId = user?.id;
```

### Проверить сессию

```typescript
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  // Пользователь залогинен
} else {
  // Нужно залогиниться
}
```

### Слушать изменения авторизации

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Пользователь залогинился
  } else if (event === 'SIGNED_OUT') {
    // Пользователь вышел
  }
});
```

---

## Postman Collection

### Environment Variables

Создай Environment в Postman:

| Variable | Value |
|----------|-------|
| `BASE_URL` | `https://curptkobrzebusvleadw.supabase.co` |
| `ANON_KEY` | `sb_publishable_xws3x_j4EOoJQ_MbCdAVVw_jhf_kztL` |
| `ACCESS_TOKEN` | (заполнить после логина) |
| `USER_ID` | (заполнить после логина) |
| `TASK_ID` | (заполнить после создания задачи) |

### Примеры запросов

**1. Login:**
```
POST {{BASE_URL}}/auth/v1/token?grant_type=password
Headers: apikey: {{ANON_KEY}}
Body: { "email": "...", "password": "..." }
```

**2. Get Tasks:**
```
GET {{BASE_URL}}/rest/v1/tasks?select=*
Headers: 
  apikey: {{ANON_KEY}}
  Authorization: Bearer {{ACCESS_TOKEN}}
```

**3. Create Task:**
```
POST {{BASE_URL}}/rest/v1/tasks
Headers:
  apikey: {{ANON_KEY}}
  Authorization: Bearer {{ACCESS_TOKEN}}
  Prefer: return=representation
Body: { "user_id": "{{USER_ID}}", "title": "...", "status": "open" }
```

---

## Тестирование RLS

### Сценарий 1: Изоляция данных

1. Создай User A, залогинься, создай задачу
2. Создай User B, залогинься
3. User B запрашивает задачи → должен получить пустой массив `[]`

### Сценарий 2: Защита от удаления

1. User A создаёт задачу (Task ID: `xxx`)
2. User B пытается удалить задачу `xxx` → не удаляется
3. User A проверяет свою задачу → она всё ещё существует

### Сценарий 3: Защита от изменения

1. User A создаёт задачу
2. User B пытается обновить задачу User A → не обновляется
3. User A проверяет задачу → она не изменилась

---

## Полезные ссылки

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [PostgREST API Docs](https://postgrest.org/en/stable/api.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Changelog

- **2025-12-02:** Initial API documentation
- **2025-12-02:** RLS policies tested and verified
- **2025-12-02:** CRUD operations tested and working

