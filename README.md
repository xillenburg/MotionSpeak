<img width="692" height="155" alt="image" src="https://github.com/user-attachments/assets/87ceb0e3-7e45-4eb2-9397-f870edc65514" /># MotionSpeak

---
# FRONTEND
## Links
### Docs for file purpose / error encounter guide::
https://docs.google.com/document/d/1OZyUMGOMk0D7W0NdEntRyqQmf7t1H73xKI6bFvG4zkY/edit?tab=t.0

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

_**(1-4 steps are probably automatically done on the new version (Quail4).)**_

6. Create a virtual device: More Actions > Virtual Device Manager > Press plus icon **"+"**> Pixel 7 > Next > API > API 36.0 > Select the one with the star > Finish
<img width="692" height="155" alt="image" src="https://github.com/user-attachments/assets/aed58057-1d7b-42df-92a6-a8cb7eee9f1e" />

---

## MotionSpeak File Prep

**0. Download Git if not yet installed and 'git' commands are not recognized on your PC**
```bash
https://git-scm.com/install/windows
```

**1. Clone the repository**
```bash
git clone https://github.com/xillenburg/MotionSpeak
cd MotionSpeak
```

**2. Install dependencies**
```bash
npm install
```

**3. Computers that previously used MotionSpeak repos might experience high/critical errors whereas fresh computers do not.
Use this to fix said errors**
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```
## Android Studio Phone Prep
**1. Click More Actions > Virtual Device Manager > [Select the device you created earlier (Pixel 7 in this case) by pressing "play" icon]**

## Opening MotionSpeak on the Android Studio Phone Pixel 7 emulator
**1. Enter this command and wait for the app to download.**
```bash
npx react-native run-android
```
**2. Since this command automatically opens Metro Bundler, after downloading, the app should start with no problem. But IF the console starts with this:**
```bash
PS C:\Users\user\Downloads\MotionSpeak> 
```
**means it ignored your React Native Metro console or it never started. Close the Metro console if it opened but got ignored. Then re-open/open it using this command on a NEW terminal separate from the terminal where "npx react-native run-android" is used:**
```bash
npx react-native start
```
