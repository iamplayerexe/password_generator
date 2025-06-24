// forge.config.js
require('dotenv').config();

const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/password-generator-logo', 
    appCopyright: `Copyright © ${new Date().getFullYear()} Xutron`,
    win32metadata: {
      CompanyName: 'Xutron',
      ProductName: 'PasswordGenerator',
      FileDescription: 'A secure password generator application.',
    }
  },

  rebuildConfig: {},

  makers: [
    // Create a zip for Windows containing the .exe and support files
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    // Create a DMG for macOS
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'PasswordGenerator',
        icon: 'src/assets/password-generator-logo.icns'
      }
    },
    // Create a zip for Linux
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    }
  ],

  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};