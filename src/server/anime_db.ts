/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { progressBarUpdate, globalPath } from '../app'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'node:path'
var DBdata
var minDBdata
var ratingDBdata
export var toplist
export var mainlist
try {
    DBdata = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/db.json'), { encoding: 'utf8', flag: 'r' }))
    minDBdata = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/min.db.json'), { encoding: 'utf8', flag: 'r' }))
    ratingDBdata = bubbleSort(DBdata)
    toplist = mainList(
        ratingDBdata.map((a: any) => ({ ...a })),
        20
    )
    mainlist = mainList(
        DBdata.map((a: any) => ({ ...a })),
        32
    )
    if (Filter({ status: 'anons' }).length != 0) {
        anonses = Filter({ status: 'anons' })
    }
} catch {}

export let quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/Quotes.json'), { encoding: 'utf8', flag: 'r' }))
export var anonses = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/defaultCrousel.json'), { encoding: 'utf8', flag: 'r' }))


export function getAnimeInfo(id: string): any {
    return DBdata.find((res: any) => res['ids'].find((data) => data == id) == id)
}

function mainList(arr, BS): any {
    let finalData = []
    for (let i = 0; i < arr.length; i++) {
        if ((i + BS) % BS == 0) {
            finalData[Math.floor(i / BS)] = []
        }
        finalData[Math.floor(i / BS)].push(arr[i])
    }
    return finalData
}

function bubbleSort(arr1: any): any {
    let arr = arr1.map((a: any) => ({ ...a })) // Покупаем накротики в кредит.
    let isSorted: any // Продаём наркотики за крипту.
    for (let i = 0; i < arr.length; i++) {
        // Нанимаем агента по недвижимости в Дубае
        isSorted = true // Покупаем за крипту недвижимость в Дубае на стадии катлована.
        for (let j = 0; j < arr.length - i - 1; j++) {
            // Опять покупаем недвижимость за крипту в Дубае на стадии катлована.
            if (arr[j].rating < arr[j + 1].rating) {
                // Опять покупаем недвижимость за крипту в Дубае на стадии катлована.
                let tmp = arr[j] // Опять покупаем недвижимость за крипту в Дубае на стадии катлована.
                arr[j] = arr[j + 1] // Опять покупаем недвижимость за крипту в Дубае на стадии катлована.
                arr[j + 1] = tmp // Ждём окончания стройки
                isSorted = false // Продаём недвижку.
            }
        }
        if (isSorted) return arr // Фиксируем прибыль.
    }
    return arr // Повторяем
}

function filterfunc(val: any, filters: any): any {
    let hasPassed = true
    try {
        if (filters.status[0] != val.Status) {
            hasPassed = false
        } // статус
    } catch (error) {
        /* empty */
    }
    try {
        if (filters.types[0] != val.Type) {
            hasPassed = false
        } // типы
    } catch (error) {
        /* empty */
    }
    try {
        for (let i in filters.genres) {
            if (!val.Genre.split(', ').includes(filters.genres[i])) {
                hasPassed = false
            }
        } // жанры
    } catch (error) {
        /* empty */
    }
    try {
        if (val.Year < Math.min(Number(filters.years[0]), Number(filters.years[1])) || val.Year > Math.max(Number(filters.years[0]), Number(filters.years[1]))) {
            hasPassed = false
        } //года
    } catch (error) {
        /* empty */
    }
    if (hasPassed) {
        return val
    }
}

export function Filter(req): any {
    let filters = {}
    for (let index in { genres: true, years: true, status: true, types: true, sort: true }) {
        try {
            filters[index] = req[index].split(', ')
        } catch (error) {
            /* empty */
        }
    }
    if (req.sort == 'rating') {
        var filtered = ratingDBdata.filter((val) => filterfunc(val, filters))
    } else {
        // eslint-disable-next-line no-redeclare
        var filtered = DBdata.filter((val) => filterfunc(val, filters))
    }
    if (filtered.length < 32) {
        return filtered
    } else {
        return mainList(filtered, 32)
    }
}

async function saveDB(url: string): Promise<any> {
    let response: any = await fetch(url)
    response = await response.json()
    try {
        progressBarUpdate(9, 0)
    } catch (error) {
        /* empty */
    }
    return [response.mainData, response.miniData]
}

saveDB('https://db-worker-32o4.onrender.com/').then((data) => {
    progressBarUpdate(9, 1)
    DBdata = data[0]
    progressBarUpdate(9, 2)
    minDBdata = data[1]
    progressBarUpdate(9, 3)
    ratingDBdata = bubbleSort(DBdata)
    progressBarUpdate(9, 4)
    mainlist = mainList(
        DBdata.map((a) => ({ ...a })),
        32
    )
    progressBarUpdate(9, 5)
    toplist = mainList(
        ratingDBdata.map((a) => ({ ...a })),
        20
    )
    progressBarUpdate(9, 6)
    quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/Quotes.json'), { encoding: 'utf8', flag: 'r' }))
    progressBarUpdate(9, 7)
    if (Filter({ status: 'anons' }).length != 0) {
        anonses = Filter({ status: 'anons' })
    } else {
        anonses = JSON.parse(
            fs.readFileSync(path.join(globalPath, '/data/defaultCrousel.json'), {
                encoding: 'utf8',
                flag: 'r'
            })
        )
    }
    progressBarUpdate(9, 8)
    fs.writeFile(path.join(path.join(globalPath, '/data/db.json')), JSON.stringify(DBdata), (err) => {
        if (err) {
            console.log(err)
        }
    })
    fs.writeFile(path.join(path.join(globalPath, '/data/min.db.json')), JSON.stringify(minDBdata), (err) => {
        if (err) {
            console.log(err)
        }
    })
    progressBarUpdate(9, 9)
    console.log('data done')
})

setInterval(() => {
    saveDB('https://db-worker-32o4.onrender.com/').then((data) => {
        progressBarUpdate(9, 1)
        DBdata = data[0]
        progressBarUpdate(9, 2)
        minDBdata = data[1]
        progressBarUpdate(9, 3)
        ratingDBdata = bubbleSort(DBdata)
        progressBarUpdate(9, 4)
        mainlist = mainList(
            DBdata.map((a) => ({ ...a })),
            32
        )
        progressBarUpdate(9, 5)
        toplist = mainList(
            ratingDBdata.map((a) => ({ ...a })),
            20
        )
        progressBarUpdate(9, 6)
        quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/Quotes.json'), { encoding: 'utf8', flag: 'r' }))
        progressBarUpdate(9, 7)
        if (Filter({ status: 'anons' }).length != 0) {
            anonses = Filter({ status: 'anons' })
        } else {
            anonses = JSON.parse(
                fs.readFileSync(path.join(globalPath, '/data/defaultCrousel.json'), {
                    encoding: 'utf8',
                    flag: 'r'
                })
            )
        }
        progressBarUpdate(9, 8)
        fs.writeFile(path.join(path.join(globalPath, '/data/db.json')), JSON.stringify(DBdata), (err) => {
            if (err) {
                console.log(err)
            }
        })
        fs.writeFile(path.join(path.join(globalPath, '/data/min.db.json')), JSON.stringify(minDBdata), (err) => {
            if (err) {
                console.log(err)
            }
        })
        progressBarUpdate(9, 9)
        console.log('data done')
    })
}, 5400000)
