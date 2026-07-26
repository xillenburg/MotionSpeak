# MotionSpeak

---

## Prerequisites

Install ff:

| Requirement | Version | Download |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| JDK (Adoptium Temurin) | 17 | https://adoptium.net/temurin/releases/?version=17 |
| Android Studio | Latest | https://developer.android.com/studio |
| Android SDK | 36 | Via Android Studio SDK Manager |

### Android Studio Setup
1. Open Android Studio → SDK Manager
2. Install **Android SDK Platform 36**
3. Install **Android SDK Build-Tools 36**
4. Install **Android Emulator** and **Platform-Tools**
5. Create a virtual device: Virtual Device Manager → Pixel 7 → API 36

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/MotionSpeak.git
cd MotionSpeak
```

### 2. Install dependencies
```bash
npm install
```

### 3. Bundle the JavaScript
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res
```

### 4. Build and run
```bash
cd android
.\gradlew clean
cd ..
npx react-native run-android --no-packager
```

### One-liner (run all steps at once)
```bash
npm install; npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res; cd android; .\gradlew clean; cd ..; npx react-native run-android --no-packager
```

---

## Project Structure
