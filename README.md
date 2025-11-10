# Compilation App

This mobile application is built for learning purpose using **React Native** and demonstrates a cohesive set of UI/UX patterns, navigation flows, theming options, and authentication processes. The app aims to provide a smooth onboarding experience along with modular and scalable code practices.

---

## 📌 Key Features

### 🔐 Authentication
- Login and Signup forms built using **Formik** for form state management.
- Validation layers implemented through **Yup** for a consistent user input experience.
- Uses **JWT token** generation and storage workflow to manage authenticated sessions.

### 🧭 Navigation Structure
- **Nested navigation architecture** implemented to manage user flows effectively.
- **Material Top Tabs** used for intuitive screen segmentation and swiping experiences.
- Routes structured in a maintainable and easily extendable format.

### 🎨 UI & Theming
- Dynamic **Dark Mode** support powered through React Native Appearance APIs.
- Common UI elements structured using **Flexbox** for responsive, adaptable layouts.
- **SafeAreaView** integrated to manage device notches and status bar spacing.

### 📦 User Interface Components
- **Modal boxes** integrated to display contextual interactions.
- **ScrollView** implemented for handling content overflow with smooth scrolling.
- Clean component structure to maintain readability and reuse across screens.

---


---

## 🧰 Tech Stack

| Category | Tools/Libs Used |
|---------|----------------|
| Core Framework | React Native |
| Forms | Formik |
| Validation | Yup |
| Navigation | @react-navigation/native + Material Top Tabs |
| Theming | Appearance API, Context-based theme switching |
| Auth | JWT Token Handling |
| UI Layout | Flexbox, SafeAreaView, Modal, ScrollView |

---

## ▶️ Run the Application

### 1. Install Dependencies
```bash
npm install



## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```
