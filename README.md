<div align="center">

# Password Generator & Vault 🔑

</div>

<p align="center">
  <!-- Tech Stack Badges -->
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS"></a>
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-28.0.0-%2347848F.svg?style=for-the-badge&logo=electron&logoColor=white" alt="Electron"></a>
  <a href="https://www.electronforge.io/"><img src="https://img.shields.io/badge/Electron%20Forge-7.4.0-%239B59B6.svg?style=for-the-badge&logo=electron&logoColor=white" alt="Electron Forge"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"><img src="https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

> A secure, **offline-first** desktop application built with Electron that generates strong, deterministic passwords and stores them in an encrypted local vault. Part of the **XutronCore** application suite.

---

## ⚠️ Important: Requires XutronCore Launcher

This application is now managed exclusively through the **[XutronCore Launcher](https://github.com/iamplayerexe/xutroncore/releases/latest)**.

The launcher handles the installation, updates, and launching of this app and all other official XutronCore tools. This ensures you always have the latest, most secure version without needing to manually download files.

---

## 🚀 Getting Started

Downloading this app is now simpler than ever.

1.  **Download the Launcher:** Go to the **[XutronCore Launcher Releases Page](https://github.com/iamplayerexe/xutroncore/releases/latest)** and download the installer for your operating system (Windows, macOS, or Linux).

2.  **Install & Run the Launcher:** Run the installer and open the XutronCore Launcher application.

3.  **Install Password Generator:** Find "Password Generator" in the list of available apps within the launcher and click **Install**. That's it! You can now launch it directly from the launcher.

---

## 🖼️ Preview

**(👇 Click to expand!)**

<details>
  <summary><strong>✨ Main Interface & Vault Demo</strong></summary>
  <br/>
  <p align="center">
    <em>The main two-column layout for generating passwords and managing the vault:</em><br/>
    <!-- TODO: Replace with a screenshot of your application -->
    <img src="URL_TO_YOUR_SCREENSHOT_1.png" alt="Main Interface" width="750">
    <br/><br/>
    <em>The settings modal for changing your master password:</em><br/>
    <!-- TODO: Replace with a screenshot of your settings modal -->
    <img src="URL_TO_YOUR_SCREENSHOT_2.png" alt="Settings Modal" width="450">
  </p>
</details>

---

## ✨ Features Checklist

-   [x] 🔐 **Deterministic Password Generation:** Creates consistent, strong passwords from a secret sentence and app name.
-   [x] 🗄️ **Secure Encrypted Vault:** All saved passwords are encrypted using AES-256-GCM.
-   [x] 🔑 **Master Password Protection:** The vault is locked and can only be accessed with your master password.
-   [x] 🖥️ **Cross-Platform:** Available for Windows, macOS, and Linux via the launcher.
-   [x] 🎨 **Light & Dark Modes:** Automatically syncs with your system theme for your comfort.
-   [x] 🔄 **Seamless Updates:** The XutronCore Launcher handles all updates automatically.
-   [x] 📦 **Data Management:**
    -   Export selected or all passwords to an encrypted `.dat` file.
    -   Import from an encrypted `.dat` file.
    -   Generate a printable PDF of your passwords.
-   [x] 🌐 **Offline First:** Your data is stored securely and only on your local machine. No cloud, no servers.

---

## 📊 By the Numbers

| Stat                  | Value                                         |
| --------------------- | --------------------------------------------- |
| **Encryption**        | AES-256-GCM                                   |
| **Data Storage**      | 100% Local (Offline)                          |
| **Supported Platforms** | Windows, macOS, Linux (via Launcher)          |
| **Updates**           | Automatic via XutronCore Launcher             |
| **License**           | Open Source (MIT)                             |
| **Cost**              | Free                                          |

---

## 🆚 Comparison

| Feature                         | Password Generator App | Manual Method (e.g., Text File) |
| ------------------------------- | :--------------------: | :-----------------------------: |
| **Encrypted Vault**             |           ✅           |                ❌               |
| **One-Click Copy**              |           ✅           |                ❌               |
| **Search & Filter**             |           ✅           |                ❌               |
| **Centralized Updates**         |           ✅           |                ❌               |
| **Secure Backup/Export**        |           ✅           |                ❌               |
| **Offline Access**              |           ✅           |                ✅               |

---

## 📖 How to Use

1.  **First Launch:** The app will prompt you to create a **Master Password**. This password encrypts your vault and is required to unlock it. *If you forget it, your data is not recoverable.*
2.  **Generate a Password:**
    *   Fill in the "App/Website Name", "Username / Email", and "Your Secret Sentence".
    *   Click **"Generate Password"**.
3.  **Save to Vault:**
    *   Once a password is generated, click **"Save to Vault"**.
4.  **Manage Vault:**
    *   **Unlock:** Click the lock icon and enter your Master Password.
    *   **Search:** Use the search bar to filter your saved passwords.
    *   **Actions:** Use the buttons to Copy, Delete, Export, or create a PDF.
5.  **Settings:**
    *   Click the gear icon to open settings.
    *   You can change your master password here (the vault must be unlocked).

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the repository's **[Issues Page](https://github.com/iamplayerexe/password_generator/issues)**.

If you'd like to contribute code (requires Node.js & npm):

1.  **Fork** the repository.
2.  **Clone** your fork locally (`git clone ...`).
3.  **Install Dependencies** (`npm install`).
4.  **Create a Branch** (`git checkout -b feature/YourAmazingFeature`).
5.  **Make your changes**.
6.  **Test Locally** (`npm start`).
7.  **Commit your changes** (`git commit -m 'feat: Add some amazing feature'`).
8.  **Push to the branch** (`git push origin feature/YourAmazingFeature`).
9.  **Open a Pull Request** back to the original repository.

---

## 📜 License

This project is distributed under the **MIT License**. See the `LICENSE` file for more information.