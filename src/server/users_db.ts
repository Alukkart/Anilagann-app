/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import * as sqlite3 from 'sqlite3'
import { mkdirSync } from 'fs'
import { dataPath } from "../app";

try {
    mkdirSync(path.join(dataPath).replace('app.asar', 'app.asar.unpacked'), { recursive: true })
} catch (err){
    throw err
}
const db = new sqlite3.Database(path.join(dataPath, '.anilagann.db').replace('app.asar', 'app.asar.unpacked'))

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS lists (
        animeid TEXT UNSIGNED NOT NULL,
        list    TEXT UNSIGNED NOT NULL,
        UNIQUE (animeid))`,
        function (err) {
            if (err) {
                console.log(err)
            }
        }
    )
})

export function addToList(anime: string, list: string, callback: any): void {
    if (list == 'false') {
        db.run(`DELETE FROM lists WHERE animeid = ?`, [anime], function (err) {
            if (err) {
                console.log(err)
            } else {
                callback(true)
            }
        })
    } else {
        db.run(
            `INSERT INTO lists(animeid, list) VALUES(?, ?)
                ON CONFLICT(animeid) DO UPDATE SET list = '${list}';`,
            [anime, list],
            function (err: string) {
                if (err) {
                    console.log(err)
                } else {
                    callback(true)
                }
            }
        )
    }
}

export function getUserInfo(callback): void {
    db.all(`SELECT animeid, list FROM lists`, [], function (err, list) {
        if (err) {
            console.log(err)
        } else {
            callback(list)
        }
    })
}

export function listCheck(id: string, callback): void {
    db.all(`SELECT * FROM lists WHERE animeid = ?`, [id], function (err, row: any) {
        if (row.length != 0) {
            callback(err, row[0].list)
        } else {
            callback(err, undefined)
        }
    })
}
