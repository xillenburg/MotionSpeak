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

_**(These steps are probably automatically done on the new version (Quail4).)**_
---

##MotionSpeak File Prep

### 0. Download Git if not yet installed and 'git' commands are not recognized on your PC
```bash
https://git-scm.com/install/windows
```

### 1. Clone the repository
```bash
git clone https://github.com/xillenburg/MotionSpeak
cd MotionSpeak
```

### 2. Install dependencies
```bash
npm install
```

### 3. Computers that previously used MotionSpeak repos might experience high/critical errors whereas fresh computers do not.
### Use this to fix said errors
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

