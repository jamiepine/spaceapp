// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  shell,
  protocol,
  ipcMain
} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const { fork } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isQuitting;

const icon = path.join(__dirname, 'assets', 'images', 'icon.ico');

app.on('before-quit', function () {
  isQuitting = true;
});

app.on('ready', async () => {
  // allow electron to load local assets in renderer process
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = request.url.replace('file:///', '');
    callback(pathname);
  });
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1824,
    height: 928,
    minWidth: 800,
    minHeight: 750,
    backgroundColor: '#2C2C34',
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      devTools: isDev,
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,

      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenuBarVisibility(true); ////THIS REMOVES THE HEADER MENU

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../bundle', 'index.html'));
  }

  const webContents = mainWindow.webContents;

  //Open the DevTools.
  if (isDev) {
    webContents.openDevTools();
  }

  if (process.platform === 'win32') {
    const trayIcon = nativeImage.createFromPath(icon);

    const appIcon = new Tray(trayIcon);

    appIcon.on('click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: function () {
          mainWindow.show();
        }
      },
      {
        label: 'Quit',
        click: function () {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    appIcon.setContextMenu(contextMenu);

    mainWindow.on('show', function () {
      appIcon.setHighlightMode('selection');
    });
  }

  webContents.on('new-window', (_, url) => {
    // _.preventDefault();
    const protocol = require('url').parse(url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(url);
    }
  });

  mainWindow.on('close', function (event) {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

const child = fork(path.join(__dirname, 'scan.js'), ['hello'], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

ipcMain.on('scan-files', (e, data) => {
  data.app_data_path = app.getAppPath();

  child.send(data);

  child.on('error', (err) => {
    console.log('ERROR: spawn failed! (' + err + ')');
  });

  child.stderr.on('data', function (data) {
    // console.log('stdout: ' + data);
  });

  child.on('message', (data) => {
    if (typeof data === 'string') e.sender.send('load-file', data);
    else e.sender.send('ingest-file', data);
  });

  child.on('exit', function (code, signal) {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });
});
