# Mathion Task - Aufgabenverwaltungs-App

Eine moderne Task- und Projektmanagement-App, entwickelt mit **Expo (React Native)** und **Supabase**. Die Anwendung ermöglicht es Benutzern, sich zu registrieren, anzumelden und ihre eigenen Aufgaben zu verwalten.

## 📋 Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Features](#features)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Verwendung](#verwendung)
- [Architektur](#architektur)
- [API-Dokumentation](#api-dokumentation)

## 🎯 Übersicht

Diese App wurde als Testaufgabe für Mathion entwickelt. Sie ermöglicht Benutzern die vollständige Verwaltung ihrer Aufgaben mit folgenden Funktionen:

- **Authentifizierung**: Registrierung und Anmeldung per E-Mail und Passwort
- **Aufgabenverwaltung**: Erstellen, Bearbeiten, Löschen und Anzeigen von Aufgaben
- **Filterung**: Aufgaben nach Status filtern (Alle, Offen, In Arbeit, Erledigt)
- **Datenisolierung**: Jeder Benutzer sieht nur seine eigenen Aufgaben (Row Level Security)
- **Responsive Design**: Apple-inspiriertes, minimalistische UI mit Dark/Light Theme

## 🛠 Technologien

### Frontend

- **Expo** (React Native) - Cross-platform Framework
- **TypeScript** - Typensichere Programmierung
- **React Navigation** - Navigation zwischen Screens
- **NativeWind** - Tailwind CSS für React Native
- **React Context API** - State Management
- **Supabase JS Client** - Backend-Integration

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL Datenbank
  - Supabase Auth (E-Mail/Passwort)
  - Row Level Security (RLS) für Datensicherheit
  - REST API (PostgREST)

## 📁 Projektstruktur

```
Mathion-task/
├── app/                          # Expo React Native App
│   ├── src/
│   │   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   │   ├── ui/              # Basis UI-Komponenten (Button, Input, Card, etc.)
│   │   │   ├── FilterTabs.tsx   # Filter-Tabs mit Animation
│   │   │   ├── Header.tsx       # Header-Komponente
│   │   │   └── TaskCard.tsx    # Aufgabenkarte für Liste
│   │   ├── constants/           # App-Konstanten
│   │   │   └── colors.ts        # Farbpalette für Themes
│   │   ├── context/             # React Context Provider
│   │   │   ├── AuthContext.tsx  # Authentifizierungs-Context
│   │   │   └── ThemeContext.tsx # Theme-Context (Light/Dark)
│   │   ├── hooks/               # Custom React Hooks
│   │   │   ├── useAuth.ts       # Hook für Authentifizierung
│   │   │   ├── useTasks.ts      # Hook für CRUD-Operationen
│   │   │   └── useTheme.ts      # Hook für Theme-Zugriff
│   │   ├── lib/                 # Bibliotheken und Utilities
│   │   │   ├── supabase.ts      # Supabase Client Initialisierung
│   │   │   └── types.ts         # TypeScript Typen und Interfaces
│   │   ├── navigation/          # Navigation-Konfiguration
│   │   │   └── RootNavigator.tsx # Hauptnavigator (Auth/Main Tabs)
│   │   └── screens/             # App-Screens
│   │       ├── AuthScreen.tsx    # Login/Registrierung
│   │       ├── TaskListScreen.tsx # Aufgabenliste
│   │       ├── TaskDetailScreen.tsx # Aufgaben-Editor
│   │       └── ProfileScreen.tsx # Profil und Einstellungen
│   ├── App.tsx                  # Root-Komponente
│   ├── package.json             # Dependencies
│   └── tailwind.config.js       # Tailwind Konfiguration
├── backend/                     # SQL-Skripte für Supabase
│   ├── supabase-setup.sql      # Tabellen und RLS-Policies
│   ├── seed-data.sql           # Testdaten
│   └── create-users-view.sql   # Views für Benutzer
├── docs/                        # Dokumentation
│   ├── api-reference.md        # API-Dokumentation
│   └── api-docs/              # Zusätzliche API-Docs
└── README.md                   # Diese Datei
```

## ✨ Features

### Authentifizierung

- ✅ Registrierung mit E-Mail und Passwort
- ✅ Anmeldung mit bestehenden Credentials
- ✅ Automatische Session-Wiederherstellung
- ✅ Abmeldung

### Aufgabenverwaltung

- ✅ **Erstellen**: Neue Aufgaben mit Title, Description, Status, Deadline
- ✅ **Anzeigen**: Liste aller Aufgaben mit Filterung
- ✅ **Bearbeiten**: Vollständige Bearbeitung aller Felder
- ✅ **Löschen**: Aufgaben mit Bestätigung löschen
- ✅ **Status-Toggle**: Schnelles Umschalten des Status per Checkbox

### UI/UX Features

- ✅ **Dark/Light Theme**: Umschaltbares Theme mit weichen Farben
- ✅ **Filterung**: Filter nach Status (Alle, Offen, In Arbeit, Erledigt)
- ✅ **Animationen**: Flüssige Animationen für Filter und Status
- ✅ **Pull-to-Refresh**: Aktualisierung der Aufgabenliste
- ✅ **Kalender**: Apple Clock-ähnlicher Datumspicker für Deadline
- ✅ **Responsive**: Optimiert für Web (Browser)

### Datenstruktur

Jede Aufgabe enthält:

- **Title** (Pflichtfeld): Name der Aufgabe
- **Description** (Optional): Beschreibung der Aufgabe
- **Status** (Pflichtfeld): `open` | `in_progress` | `done`
- **Deadline** (Optional): Datum im Format YYYY-MM-DD
- **Timestamps**: `created_at`, `updated_at` (automatisch)

## 🚀 Installation

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- Expo CLI (wird automatisch installiert)

### Schritte

1. **Repository klonen**

```bash
git clone <repository-url>
cd Mathion-task
```

2. **Dependencies installieren**

```bash
cd app
npm install
```

3. **Umgebungsvariablen konfigurieren**
   Erstelle eine `.env` Datei im `app/` Verzeichnis:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Supabase Datenbank einrichten**

- Öffne die Supabase Dashboard
- Führe die SQL-Skripte aus `backend/supabase-setup.sql` aus
- Optional: Führe `backend/seed-data.sql` für Testdaten aus

## ⚙️ Konfiguration

### Supabase Setup

1. Erstelle ein neues Projekt in [Supabase](https://supabase.com)
2. Kopiere die **Project URL** und **anon/public key** aus den Settings
3. Füge sie in die `.env` Datei ein
4. Führe `backend/supabase-setup.sql` im SQL Editor aus

### Email-Authentifizierung

In den Supabase Auth Settings:

- Stelle sicher, dass "Email" als Provider aktiviert ist
- Optional: Deaktiviere "Confirm email" für Entwicklung

## 💻 Verwendung

### Entwicklung starten

```bash
cd app
npm run web
```

Die App öffnet sich automatisch im Browser unter `http://localhost:8081`

### Verfügbare Scripts

```bash
npm start          # Expo Development Server starten
npm run web        # Web-Version starten
npm run android    # Android Emulator starten (optional)
npm run ios        # iOS Simulator starten (optional)
```

### Erste Schritte

1. **Registrierung**: Erstelle ein neues Konto mit E-Mail und Passwort
2. **Anmeldung**: Melde dich mit deinen Credentials an
3. **Aufgabe erstellen**: Nutze den "Erstellen" Tab oder klicke auf eine Aufgabe zum Bearbeiten
4. **Aufgaben verwalten**: Filtere, bearbeite oder lösche Aufgaben nach Bedarf

## 🏗 Architektur

### State Management

Die App verwendet **React Context API** für globales State Management:

- **AuthContext**: Verwaltet Authentifizierungsstatus, Benutzerdaten und Session
- **ThemeContext**: Verwaltet Theme (Light/Dark) und stellt Farben bereit

### Datenfluss

1. **Authentifizierung**:

   ```
   AuthScreen → useAuth() → AuthContext → Supabase Auth API
   ```

2. **Aufgaben-CRUD**:

   ```
   TaskListScreen/TaskDetailScreen → useTasks() → Supabase Client → PostgreSQL
   ```

3. **Theme**:
   ```
   ProfileScreen → useThemeContext() → ThemeContext → Alle Komponenten
   ```

### Sicherheit

- **Row Level Security (RLS)**: Jeder Benutzer sieht nur seine eigenen Aufgaben
- **JWT Tokens**: Sichere Authentifizierung über Supabase Auth
- **Session Persistence**: Automatische Wiederanmeldung via AsyncStorage

## 📚 API-Dokumentation

Vollständige API-Dokumentation findest du in [`docs/api-reference.md`](docs/api-reference.md).

### Hauptendpunkte

- `POST /auth/v1/signup` - Registrierung
- `POST /auth/v1/token` - Anmeldung
- `GET /rest/v1/tasks` - Aufgaben abrufen
- `POST /rest/v1/tasks` - Aufgabe erstellen
- `PATCH /rest/v1/tasks?id=eq.{id}` - Aufgabe aktualisieren
- `DELETE /rest/v1/tasks?id=eq.{id}` - Aufgabe löschen

## 🎨 Design

Die App folgt einem **Apple-inspirierten, minimalistischen Design**:

- Große Border Radius (`rounded-2xl`)
- Weiche Schatten
- Viel Whitespace
- Große, lesbare Schriftarten
- Smooth Animationen
- Unterstützung für Light/Dark Theme

### Farben

- **Primary**: `#007AFF` (Blau)
- **Success**: `#34C759` (Grün)
- **Warning**: `#FF9500` (Orange)
- **Error**: `#FF3B30` (Rot)

## 🧪 Testing

Die Backend-API wurde mit Postman getestet. Test-Skripte findest du in `docs/api-docs/`.

### Manuelle Tests

1. **Authentifizierung**: Registrierung, Anmeldung, Abmeldung
2. **CRUD-Operationen**: Erstellen, Lesen, Aktualisieren, Löschen von Aufgaben
3. **Filterung**: Filter nach verschiedenen Status
4. **Theme**: Umschalten zwischen Light/Dark Mode
5. **Datenisolierung**: Zwei Benutzer - jeder sieht nur seine Aufgaben

## 📝 Code-Stil

- **TypeScript**: Vollständige Typisierung
- **ESLint**: Code-Qualität
- **Kommentare**: Englische Kommentare im Code
- **UI-Text**: Deutsch
- **Naming**: CamelCase für Variablen, PascalCase für Komponenten

## 🔧 Troubleshooting

### Häufige Probleme

**Problem**: Weißer Bildschirm beim Start

- **Lösung**: Stelle sicher, dass `babel-preset-expo` installiert ist: `npx expo install babel-preset-expo`

**Problem**: Authentifizierung funktioniert nicht

- **Lösung**: Überprüfe `.env` Datei und Supabase Projekt-URL/Key

**Problem**: Aufgaben werden nicht angezeigt

- **Lösung**: Überprüfe RLS-Policies in Supabase und stelle sicher, dass der Benutzer eingeloggt ist

## 📄 Lizenz

Dieses Projekt wurde als Testaufgabe für Mathion entwickelt.

## 👤 Autor

Entwickelt als Testaufgabe für Mathion.

---

**Status**: ✅ Vollständig implementiert und getestet
