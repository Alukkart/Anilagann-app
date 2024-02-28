import { app, BrowserWindow, Tray, Menu, session, nativeImage } from 'electron'
export const globalPath = app.getAppPath()
import { ElectronBlocker } from '@cliqz/adblocker-electron'
import path from 'node:path'
const appIcon = path.join(globalPath, './assets/icon.ico')
import fetch from 'node-fetch'

let win: BrowserWindow
const createWindow: () => void = () => {
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        icon: appIcon,
        autoHideMenuBar: true
    })
    win.loadURL('http://localhost:1488')
    win.focus()
}

function smoothOpening(delay: number): void {
    if (!win.isVisible()) {
        win.minimize()
        setTimeout(() => {
            win.show()
        }, delay)
    } else {
        win.focus()
    }
}

app.whenReady().then(() => {
    if (BrowserWindow.getAllWindows().length != 0) {
        return
    }
    //* run server
    require('./server/server.js')
    //* create app window
    createWindow()
    const tray = new Tray(nativeImage.createFromPath(appIcon))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Anilagann',
            type: 'normal',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click: () => {
                smoothOpening(150)
            }
        },
        { label: 'Close', type: 'normal', role: 'quit' }
    ])
    tray.setContextMenu(contextMenu)
    tray.addListener('double-click', () => {
        smoothOpening(150)
    })
    tray.eventNames
    tray.setToolTip('Anilagann')

    //* app to tray event
    win.on('minimize', () => {
        setTimeout(() => {
            win.hide()
        }, 200)
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

//* adblocker
ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession)
})

//* data updating progress bar
export function progressBarUpdate(total: number, curent: number): void {
    if (win.getTitle().includes(' [updating data]') == false) {
        win.setTitle(win.getTitle() + ' [updating data]')
    }
    win.setProgressBar(curent / (total / 100) / 100)
    if (curent / (total / 100) / 100 >= 1) {
        win.setTitle('Anilagann')
        win.setProgressBar(-1)
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

module.exports.progressBarUpdate = progressBarUpdate
