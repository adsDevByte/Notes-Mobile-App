# 📝 Notes App — React Native + Expo

A polished, production-quality Notes application built with React Native and Expo. Features two complete UI screens: a Notes Listing screen and a Note Editor screen, with full dark/light mode support and responsive layouts.

---

## 📱 Screens

### View 1 — Notes Listing Screen
- `FlatList` for scrollable, performant note rendering
- Note cards with title, preview snippet, date/timestamp, and tag badge
- `TextInput` search bar to filter notes by title, content, or tag
- Horizontal filter chip row (All, Personal, Work, Reading, etc.)
- Pinned notes displayed first with accent marker
- Dark/Light mode `Switch` toggle in the header
- Floating Action Button (FAB) to create new notes
- Empty state for no results / no notes
- Responsive: 2-column grid on tablets (width > 900px)

### View 2 — Note Editor Screen
- `ImageBackground` header with dark overlay and decorative blobs
- `TextInput` for note title with large, readable typography
- Multiline `TextInput` for note body/content
- `KeyboardAvoidingView` to prevent keyboard overlap (iOS: `padding`, Android: `height`)
- Formatting toolbar (B, I, U, H1, H2, List, Task)
- Back button with unsaved-changes alert
- Save button with visual feedback (turns green with ✓ on save)
- Word and character counter bar at the bottom
- Unsaved changes indicator badge

---

## ✅ Requirements Checklist

| Requirement | Implementation |
|---|---|
| `FlatList` | Notes list + filter chips (both use FlatList) |
| Note cards with title, preview, date | ✅ `NoteCard` component |
| `TextInput` for search | ✅ Header search bar |
| `Pressable` on cards | ✅ Each NoteCard wrapped in Pressable |
| Dark/Light toggle (`Switch`) | ✅ In list screen header |
| `useColorScheme()` | ✅ App.js — auto detects system theme |
| `useWindowDimensions()` | ✅ Both screens — tablet/phone responsive |
| `StyleSheet.create()` | ✅ All styles |
| `StyleSheet.compose()` | ✅ Search input style in NotesListScreen |
| `StyleSheet.flatten()` | ✅ Card style + nav button styles in editor |
| `KeyboardAvoidingView` | ✅ NoteEditorScreen |
| `ImageBackground` in editor header | ✅ NoteEditorScreen |
| Save and Back buttons as `Pressable` | ✅ Both in editor nav row |
| `TextInput` for title + multiline body | ✅ NoteEditorScreen |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS or Android)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Or target a specific platform
npm run ios
npm run android
npm run web
```

Scan the QR code with Expo Go to see the app on your device.

---

## 📁 Project Structure

```
NotesApp/
├── App.js                          
├── app.json                        
├── package.json
├── babel.config.js
└── src/
    ├── screens/
    │   ├── NotesListScreen.js      
    │   └── NoteEditorScreen.js    
    ├── theme/
    │   └── colors.js             
    └── data/
        └── mockNotes.js            
```

---

## 🎨 Design Decisions

### Theme System
Two complete theme objects (`LIGHT_THEME` / `DARK_THEME`) in `colors.js` cover every color token used across the app. Switching themes is a single prop change.

### Typography
- Display: system serif (elegant, distinct from body)
- Body: system font (legible, performant)
- A full type scale from `xs` (11px) to `xxxl` (34px)

### Responsive Layout
`useWindowDimensions()` drives:
- 2-column note grid on tablets > 900px wide
- Larger header and font sizes on tablets
- Adjusted padding and max-width for wide screens
- Landscape-aware header height in the editor

### StyleSheet APIs Used
- `StyleSheet.create()` — all style definitions
- `StyleSheet.flatten()` — composing multiple style arrays with dynamic values (NoteCard, editor nav buttons)
- `StyleSheet.compose()` — combining base search input style with dynamic background

---
## 🪝 Hooks Used

| Hook | Purpose |
|---|---|
| `useState` | Local state — search query, active filter, pressed state, title, content, saved state |
| `useMemo` | Memoized filtered + sorted notes list for performance |
| `useCallback` | Memoized render functions to avoid unnecessary re-renders |
| `useColorScheme` | Auto detects system dark/light mode preference |
| `useWindowDimensions` | Responsive layouts for phones and tablets |

---
## 🧩 React Native Components Used

| Component | Where Used |
|---|---|
| `FlatList` | Notes grid, filter chips list |
| `ScrollView` | Filter chips row, editor screen |
| `TextInput` | Search bar, note title, note body |
| `Pressable` | Note cards, FAB, save/back buttons, filter chips |
| `Switch` | Dark/light mode toggle |
| `ImageBackground` | Editor screen header |
| `KeyboardAvoidingView` | Editor screen — prevents keyboard overlap |
| `SafeAreaView` | Both screens — safe area handling |
| `StatusBar` | Both screens — dynamic bar style |
| `View` | Layout containers throughout |
| `Text` | All text rendering |

---
## 🛠 Tech Stack

- **React Native** 0.74
- **Expo** ~51
- No third-party UI libraries — pure React Native core components
---
## Screenshots

<div align="center">
  <img width="200" src="https://github.com/user-attachments/assets/e18829fb-83aa-4088-8448-89632d179dc1" />
  <img width="200" src="https://github.com/user-attachments/assets/e53229e1-e682-49f7-aa65-c287c08d968a" />
  <img width="200" src="https://github.com/user-attachments/assets/d6a6f641-0850-4caa-b2ad-0cb9e82b0cc5" />
  <img width="200" src="https://github.com/user-attachments/assets/4e976637-6edf-416f-8f8a-faf155a900cf" />
</div>

---
