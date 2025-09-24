const { app, BrowserWindow, nativeTheme } = require("electron");
const path = require("path");

let mainWindow;

const createWindow = () => {
nativeTheme.themeSource = 'light';

mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
});
  const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => (mainWindow = null));
};

// production mode
// const isDev = !app.isPackaged;

// const startUrl = isDev
//   ? "http://localhost:3000"
//   : `file://${path.join(__dirname, "out/index.html")}`;

// mainWindow.loadURL(startUrl);

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
