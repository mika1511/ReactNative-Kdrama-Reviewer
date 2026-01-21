# K-Drama Reviewer App

A modern React Native app built with Expo Router and Firebase for discovering K-Dramas, writing reviews, and discussing episodes. Users browse dramas, post overall reviews, track personal thoughts, and share episode-specific feedback in real-time. [reddit](https://www.reddit.com/r/reactnative/comments/18wjtaf/project_structure_for_expo_router/)

## Features

- Splash screen leading to home feed of popular K-Dramas
- Real-time review counts and global reviews per drama
- Episode lists (16 episodes per drama) with individual review counts
- Episode-specific review boards with real-time updates
- Personal review tracking for each drama
- Beautiful gradient headers with drama-themed colors
- Firebase Firestore for scalable, real-time data sync [geeksforgeeks](https://www.geeksforgeeks.org/reactjs/how-to-integrate-firebase-in-react-native-apps/)

## Project Structure

```
KDRAMA_REVIEWER/
├── app/
│   ├── index.tsx                 # Splash screen
│   ├── home.tsx                  # Main drama feed
│   ├── layout.tsx                # Root Stack navigator
│   ├── details/
│   │   └── [id].tsx              # Drama details & reviews
│   ├── episodes/
│   │   └── [id].tsx              # Episode list & counts
│   ├── episode-reviewer/
│   │   └── [dramaId]/[episodeId].tsx  # Episode reviews
│   └── my-review/
│       └── [id].tsx              # Personal review view
├── src/
│   ├── lib/
│   │   └── firebase.ts           # Firebase config & exports
│   └── data/
│       ├── drama.ts              # DRAMA_DATA array
│       └── my-reviews.ts         # MY_REVIEWS_DATA (static)
├── assets/                       # Images, icons
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── ...
```
Follows Expo Router file-based routing with dynamic segments like `[id]`. Groups screens logically under `app/`. [docs.expo](https://docs.expo.dev/router/basics/core-concepts/)


## 🚀 Live Screenshots

### 1. **Splash Screen** 
Elegant animated entry point with app branding 

<img width="356" height="795" alt="Screenshot 2026-01-21 114832" src="https://github.com/user-attachments/assets/fefd1395-414a-4052-9070-9c59c2b5b04a" />

### 2. **Home Feed** 
Beautiful drama cards with live review counts and colorful left borders  
**Featured:** Real-time Firebase sync showing 💬 review numbers 

<img width="354" height="788" alt="Screenshot 2026-01-21 114845" src="https://github.com/user-attachments/assets/fff0fc8b-6677-44fe-bd67-766ad7989c7b" />

###3. **Drama Details**
Rich drama header with gradient + Reviews can be posted:


<img width="352" height="790" alt="Screenshot 2026-01-21 114856" src="https://github.com/user-attachments/assets/0f86d0ac-e809-43e6-adb6-b5fc00b0907e" />


💭 "My Review" - Navigate to personal thoughts

<img width="353" height="791" alt="Screenshot 2026-01-21 114908" src="https://github.com/user-attachments/assets/2d023e3e-707d-48ad-9480-a4913a77b74c" />

​

###4. **Episodes List**
List of episodes per drama with live review counts per episode
Tap any episode → Episode-specific review board
Shows: Total reviews for each episode in real-time


<img width="351" height="787" alt="Screenshot 2026-01-21 114918" src="https://github.com/user-attachments/assets/eb419f2d-5c49-4656-8249-134a1c2fdf8d" />
​

###5. **Episode Review**
Episode-focused discussion boards
✅ Write review → Click POST → Live update for all users

<img width="352" height="787" alt="Screenshot 2026-01-21 114932" src="https://github.com/user-attachments/assets/5a313074-434c-46ac-9b41-c49aae92b9c9" />

Perfect for: Episode-specific thoughts, best scenes, plot twists


<img width="343" height="778" alt="Screenshot 2026-01-21 115003" src="https://github.com/user-attachments/assets/413f8692-0dbd-487a-9325-723e0a9e3114" />



## ✨ Core Features

```
🏠 Home → Drama List (w/ live review counts)
  ↓
📱 Drama Details → Post overall review + 2 buttons:
  ├── 💭 My Review (personal notes)
  └── 📺 Episodes → 16 episodes w/ individual counts
        ↓
🎬 Episode X → Episode-specific reviews
```


## Tech Stack

- **React Native** with Expo SDK
- **Expo Router** v3+ for file-based navigation
- **Firebase Firestore** for real-time reviews (`reviews`, `episode_reviews` collections)
- **TypeScript** for type safety
- **Development**: VS Code, Android Studio emulator

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio with AVD (emulator) or physical device
- Firebase project with Firestore enabled (rules: allow read/write for testing)
- VS Code with React Native Tools extension [geeksforgeeks](https://www.geeksforgeeks.org/reactjs/how-to-integrate-firebase-in-react-native-apps/)

## Setup & Installation

1. **Clone/Fork Repository**
   ```
   git clone <your-repo-url>
   cd KDRAMA_REVIEWER
   ```

2. **Install Dependencies**
   ```
   npm install
   # or yarn install
   ```

3. **Firebase Setup**
   - Create Firebase project at console.firebase.google.com
   - Enable Firestore Database
   - Add Android app (com.yourapp.kdramareviewer)
   - Download `google-services.json` to `android/app/`
   - Update `src/lib/firebase.ts` with your config:
     ```ts
     import { initializeApp } from 'firebase/app';
     import { getFirestore } from 'firebase/firestore';
     
     const firebaseConfig = {
       apiKey: "your-api-key",
       // ... your config
     };
     
     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     ```
   - Install Firebase: `expo install firebase`

4. **Update Data (Optional)**
   - Edit `src/data/drama.ts` to add/modify K-Drama entries
   - Each drama needs: `id`, `title`, `summary`, `color`

5. **Run the App**
   ```
   npx expo start --clear
   ```
   - Press `a` for Android emulator
   - Scan QR code for Expo Go (limited Firebase support)
   - For full Firebase: `expo run:android` (builds dev client)

## Firestore Collections

- **reviews**: `{ drama_id, content, createdAt }`
- **episode_reviews**: `{ drama_id, episode_num, content, createdAt, drama_title }`

**Test Rules** (update in Firebase Console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Set to authenticated users for production. [geeksforgeeks](https://www.geeksforgeeks.org/reactjs/how-to-integrate-firebase-in-react-native-apps/)

## Navigation Flow

1. `index.tsx` → Splash → `home.tsx`
2. Home card → `details/[id].tsx` (reviews + buttons)
3. "My Review" → `my-review/[id].tsx`
4. "Episodes" → `episodes/[id].tsx` → `episode-reviewer/[dramaId]/[episodeId].tsx`

Uses `useRouter().push()` with dynamic params. [youtube](https://www.youtube.com/watch?v=Yh6Qlg2CYwQ)

## Customization

- Add dramas: Extend `DRAMA_DATA` array
- Episode count: Modify `Array.from({ length: 16 })` in episodes screen
- Styling: Update StyleSheet objects (gradient headers use drama `color`)
- Auth: Add Firebase Auth + user-specific reviews

## Troubleshooting

- **Firebase errors**: Check rules, config, internet
- **Routing issues**: Ensure `expo-router` in deps, `main: "expo-router/entry"` in app.json
- **Emulator**: Android Studio → AVD Manager → Create device
- **Hot reload**: Shake device → Enable Fast Refresh

Built with ❤️ for K-Drama fans. Contributions welcome! [github](https://github.com/grandeD/kdrama-review-app/blob/main/README.md)


