<div align="center">

# Password Generator & Vault 🔑

</div>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS"></a>
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-28.0.0-%2347848F.svg?style=for-the-badge&logo=electron&logoColor=white" alt="Electron"></a>
  <a href="https://www.electronforge.io/"><img src="https://img.shields.io/badge/Electron%20Forge-7.4.0-%239B59B6.svg?style=for-the-badge&logo=electron&logoColor=white" alt="Electron Forge"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"><img src="https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://github.com/iamplayerexe/password_generator/releases"><img src="https://img.shields.io/github/v/release/iamplayerexe/password_generator?style=for-the-badge" alt="Latest Release"></a>
</p>

> A secure, **offline-first** desktop application built with Electron that generates strong, deterministic passwords from a secret sentence and stores them in an encrypted local vault. Designed for **Windows, Linux and Mac**.

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
    <br/><br/>
    <em>A demonstration of the light and dark themes:</em><br/>
    <!-- TODO: Replace with a side-by-side screenshot of both themes -->
    <img src="URL_TO_YOUR_SCREENSHOT_3.png" alt="Light and Dark Themes" width="750">
  </p>
</details>

---

## ✨ Features Checklist

-   [x] 🔐 **Deterministic Password Generation:** Creates consistent, strong passwords from a secret sentence and app name.
-   [x] 🗄️ **Secure Encrypted Vault:** All saved passwords are encrypted using AES-256-GCM.
-   [x] 🔑 **Master Password Protection:** The vault is locked and can only be accessed with your master password.
-   [x] 🖥️ **Cross-Platform:** Native installers for Windows, macOS, and Linux.
-   [x] 🎨 **Light & Dark Modes:** Switch between themes for your comfort.
-   [x] 📦 **Data Management:**
    -   Export selected or all passwords to an encrypted `.dat` file.
    -   Import from an encrypted `.dat` file.
    -   Generate a printable PDF of your passwords.
-   [x] 🔄 **Smart Auto-Updates:** Seamless auto-updates for Windows & macOS; update notifications for Linux.
-   [x] 🌐 **Offline First:** Your data is stored securely and only on your local machine. No cloud, no servers.

---

## 🎯 Why Choose This Password Generator?

> Secure, Simple, and Private Password Management.

*   ✅ **Security & Privacy:** Your data never leaves your computer. The vault is encrypted with a key derived from your master password, ensuring only you can access it.
*   ⚡ **Simplicity:** A clean, intuitive two-column interface makes generating and managing passwords straightforward.
*   🔌 **Offline Access:** Fully functional without an internet connection.
*   📦 **Portable & Backup-Friendly:** Easily back up your entire vault with the encrypted export feature.

---

## 🚀 Getting Started

1.  Go to the **[Releases Page](https://github.com/iamplayerexe/password_generator/releases)**.
2.  Download the correct installer for your operating system from the **Assets** section.

<details>
  <summary><strong>🪟 Windows Installation</strong></summary>
  <br/>
  <ol>
    <li>Download the file ending in <code>-Setup.exe</code>.</li>
    <li>Run the installer.</li>
    <li>⚠️ <strong>Windows SmartScreen:</strong> If a warning appears, click "More info" → "Run anyway". This is because the application is not from a registered publisher.</li>
    <li>Launch the application! It will check for updates automatically.</li>
  </ol>
</details>

<details>
  <summary><strong>🍎 macOS Installation</strong></summary>
  <br/>
  <ol>
    <li>Download the file ending in <code>.zip</code>.</li>
    <li>Unzip the file to get <code>PasswordGenerator.app</code>.</li>
    <li>Drag <code>PasswordGenerator.app</code> into your <strong>/Applications</strong> folder.</li>
    <li>⚠️ <strong>First Launch:</strong> You may need to <strong>right-click</strong> the app icon and select <strong>"Open"</strong>. If a warning appears, click the "Open" button on the dialog to proceed. You only need to do this once.</li>
    <li>Launch the app normally from then on! It will update automatically.</li>
  </ol>
</details>

<details>
  <summary><strong>🐧 Linux Installation</strong></summary>
  <br/>
  <ol>
    <li>Download the appropriate package for your distribution:
        <ul>
            <li><code>.deb</code> for Debian, Ubuntu, Mint, etc.</li>
            <li><code>.rpm</code> for Fedora, CentOS, etc.</li>
        </ul>
    </li>
    <li><strong>To Install (GUI):</strong> Double-click the downloaded file to open it with your system's software installer.</li>
    <li><strong>To Install (Terminal):</strong>
        <ul>
            <li>For <code>.deb</code>: <code>sudo dpkg -i file-name.deb</code> (then <code>sudo apt-get install -f</code> if needed).</li>
            <li>For <code>.rpm</code>: <code>sudo dnf install file-name.rpm</code>.</li>
        </ul>
    </li>
    <li>Launch the app. It will notify you when a new version is available for manual download.</li>
  </ol>
</details>

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