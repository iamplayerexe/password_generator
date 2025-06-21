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
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "PasswordGenerator",
        setupIcon: 'src/assets/password-generator-logo.ico',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'src/assets/password-generator-logo.icns',
        name: 'PasswordGenerator'
      }
    },
    {
      name: '@electron-forge/maker-zip',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
          options: {
              maintainer: 'Xutron',
              homepage: 'https://github.com/iamplayerexe/password_generator',
              icon: 'src/assets/password-generator-logo.png',
              productName: 'PasswordGenerator',
              license: 'MIT'
          }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
          options: {
              maintainer: 'Xutron',
              homepage: 'https://github.com/iamplayerexe/password_generator',
              icon: 'src/assets/password-generator-logo.png',
              productName: 'PasswordGenerator',
              license: 'MIT'
          }
      },
    },
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

  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        // This now points to your PRIVATE repository for releases
        repository: {
          owner: 'iamplayerexe',
          name: 'password_generator_app'
        },
        // The token will be provided by the workflow environment
        authToken: process.env.GITHUB_TOKEN,
        prerelease: false,
        draft: false
      }
    }
  ]
};