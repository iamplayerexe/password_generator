const { app, autoUpdater, dialog, shell } = require('electron');
const https = require('https');
const { initializeApp } = require('./src/js/main/app-lifecycle');
const { setupIpcHandlers } = require('./src/js/main/ipc-handlers');

// This must be called first for windows installers
if (require('electron-squirrel-startup')) {
    app.quit();
}

// --- Auto Update Setup ---
// TODO: Replace with your GitHub username and repository name
const owner = 'iamplayerexe';
const repo = 'password_generator';
const repoUrl = `https://github.com/${owner}/${repo}`;

function initializeAutoUpdater() {
    const server = 'https://update.electronjs.org';
    const feed = `${server}/${owner}/${repo}/${process.platform}-${process.arch}/${app.getVersion()}`;
    
    try {
        console.log(`Setting auto-updater feed URL to: ${feed}`);
        autoUpdater.setFeedURL({ url: feed });

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            const versionInfo = releaseName ? `Version ${releaseName}` : 'A new version';
            const dialogOpts = {
                type: 'info',
                buttons: ['Restart Now', 'Later'],
                title: 'Application Update',
                message: versionInfo,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            };
            dialog.showMessageBox(dialogOpts).then(returnValue => {
                if (returnValue.response === 0) autoUpdater.quitAndInstall();
            });
        });

        autoUpdater.on('error', (error) => {
            dialog.showErrorBox('Update Error', `Failed to check for or install updates: ${error.message}`);
        });

    } catch (error) {
        dialog.showErrorBox('Updater Initialization Error', `Could not set up automatic updates: ${error.message}`);
    }
}

function checkForUpdatesLinux() {
    console.log('Checking for updates on Linux...');
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}/releases/latest`,
        method: 'GET',
        headers: { 'User-Agent': `PasswordGenerator/${app.getVersion()}` }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                if (res.statusCode !== 200) throw new Error(`GitHub API responded with status ${res.statusCode}`);
                const latestVersion = JSON.parse(data).tag_name.replace('v', '');
                if (latestVersion > app.getVersion()) {
                    dialog.showMessageBox({
                        type: 'info',
                        buttons: ['Go to Downloads', 'Later'],
                        title: 'Update Available',
                        message: `A new version (${latestVersion}) is available.`,
                        detail: 'Please visit the releases page to download the new version.'
                    }).then(res => {
                        if (res.response === 0) shell.openExternal(`${repoUrl}/releases/latest`);
                    });
                }
            } catch (e) {
                console.error('Error parsing Linux update check:', e);
            }
        });
    }).on('error', e => console.error('Error during Linux update request:', e));
}

function checkForUpdates() {
    if (!app.isPackaged) {
        console.log('Skipping update check in development mode.');
        return;
    }
    switch (process.platform) {
        case 'win32':
        case 'darwin':
            initializeAutoUpdater();
            autoUpdater.checkForUpdates();
            break;
        case 'linux':
            checkForUpdatesLinux();
            break;
    }
}

// Set up all IPC listeners before the app is ready
setupIpcHandlers();

// Start the application lifecycle
app.whenReady().then(() => {
    initializeApp();
    // Check for updates after a short delay
    setTimeout(checkForUpdates, 5000);
});