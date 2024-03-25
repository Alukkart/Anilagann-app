import { app, BrowserWindow, Tray, Menu, session, nativeImage, shell, globalShortcut } from 'electron'
import { version, author, name, homepage } from '../package.json'
import { ElectronBlocker } from '@cliqz/adblocker-electron'
import fetch from 'node-fetch'
import path from 'node:path'

export const globalPath = app.getAppPath()
export const dataPath = path.join(app.getPath('home'), '.anilagann')

let isQuiting: boolean
const appIcon = path.join(globalPath, './assets/icon.png')
const createMinesweeper: () => void = () => {
    win = new BrowserWindow({
        width: 900,
        height: 900,
        icon: appIcon,
        autoHideMenuBar: true,
    })
    win.setMenu(altmenu)
    win.loadURL('http://localhost:6694/minesweeper')
    win.focus()
}

app.on('before-quit', function () {
    isQuiting = true
})

const altmenu = Menu.buildFromTemplate([
    {
        label: 'About',
        type: 'normal',
        click: (): unknown => {
            app.setAboutPanelOptions({
                applicationName: name,
                applicationVersion: version,
                credits: author,
                authors: [author],
                website: homepage,
                iconPath: path.join(globalPath, './assets/icon.ico')
            })
            return app.showAboutPanel()
        }
    },
    {
        label: 'Github',
        type: 'normal',

        click: (): unknown => {
            return shell.openExternal('https://github.com/Alukkart/Anilagann-app')
        }
    },
    {
        label: 'Minesweeper',
        type: 'normal',

        click: (): unknown => {
            return createMinesweeper()
        }
    }
])

let win: BrowserWindow
const createWindow: () => void = () => {
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        icon: appIcon,
        autoHideMenuBar: true
    })
    win.setMenu(altmenu)
    win.loadURL('http://localhost:6694')
    win.focus()
}
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })

    app.whenReady().then(() => {
        globalShortcut.register('Control+Shift+I', () => {
            return false
        })
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

                click: (): unknown => {
                    return smoothOpening(150)
                }
            },
            { label: 'Close', type: 'normal', role: 'quit' }
        ])
        tray.setContextMenu(contextMenu)
        tray.addListener('double-click', () => {
            smoothOpening(150)
        })
        tray.setToolTip('Anilagann')

        //* app to tray event
        win.on('close', function (event) {
            if (!isQuiting) {
                event.preventDefault()
                win.hide()
            }
        })

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
        })
    })
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
