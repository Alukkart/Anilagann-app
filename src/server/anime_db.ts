/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { progressBarUpdate, globalPath } from '../app'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'node:path'

interface Icorusel {
    ids: string
    poster: string
    title: string
    description: string
    screen1: string
}

interface Ianime {
    ids: string[]
    title: string
    rating: number
    votes: number
    epTotal: number | string
    epAired: number | string
    status: string
    duration: number | string
    origName: string
    type: string
    studios: string
    genres: string
    year: number
    next_episode: string
    description: string
    poster: string
    screen1: string
    screen2: string
    iframe: string
}

interface Iquotes {
    anime: string
    character: string
    quote: string
}

var DBdata: Ianime[]
var ratingDBdata: Ianime[]
export var toplist: Ianime[][]
export var mainlist: Ianime[][]
export let quotes: Iquotes[]
export var anonses: Icorusel[]
try {
    fs.mkdirSync(path.join(globalPath, '/data').replace('app.asar', 'app.asar.unpacked'), { recursive: true })
} catch {
    /* empty */
}

try {
    DBdata = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/db.json').replace('app.asar', 'app.asar.unpacked'), { encoding: 'utf8', flag: 'r' }))
    quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/quotes.json'), { encoding: 'utf8', flag: 'r' }))
    anonses = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/defaultCrousel.json'), { encoding: 'utf8', flag: 'r' }))
    ratingDBdata = bubbleSort(DBdata)
    toplist = mainList(
        ratingDBdata.map((a: Ianime) => ({ ...a })),
        20
    )
    mainlist = mainList(
        DBdata.map((a: Ianime) => ({ ...a })),
        32
    )

    if (Filter({ status: 'anons' }).length != 0) {
        anonses = Filter({ status: 'anons' })
    }
} catch {
    /* empty */
}

export function getAnimeInfo(id: string): Ianime | undefined {
    return DBdata.find((res: Ianime) => res['ids'].find((data) => data == id) == id)
}

function mainList(arr: Ianime[], BS: number): Ianime[][] {
    let finalData: Ianime[][] = []
    for (let i = 0; i < arr.length; i++) {
        if ((i + BS) % BS == 0) {
            finalData[Math.floor(i / BS)] = []
        }
        finalData[Math.floor(i / BS)].push(arr[i])
    }
    return finalData
}

function bubbleSort(arr1: Ianime[]): Ianime[] {
    let arr = arr1.map((a: Ianime) => ({ ...a })) // Покупаем накротики в кредит.
    let isSorted: boolean // Продаём наркотики за крипту.
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
        if (filters.status[0] != val.status) {
            hasPassed = false
        } // статус
    } catch (error) {
        /* empty */
    }
    try {
        if (filters.types[0] != val.type) {
            hasPassed = false
        } // типы
    } catch (error) {
        /* empty */
    }
    try {
        for (let i in filters.genres) {
            if (!val.genres.split(', ').includes(filters.genres[i])) {
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

export function Filter(req: any): any {
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
    return [response.mainData, response.miniData, response.quotes, response.defaultCrousel]
}

saveDB('https://db-worker-32o4.onrender.com/').then((data) => {
    progressBarUpdate(12, 1)
    DBdata = data[0]
    progressBarUpdate(12, 2)
    ratingDBdata = bubbleSort(DBdata)
    progressBarUpdate(12, 3)
    mainlist = mainList(
        DBdata.map((a) => ({ ...a })),
        32
    )
    progressBarUpdate(12, 4)
    toplist = mainList(
        ratingDBdata.map((a) => ({ ...a })),
        20
    )
    progressBarUpdate(12, 5)
    quotes = data[2]
    progressBarUpdate(12, 6)
    if (Filter({ status: 'anons' }).length != 0) {
        anonses = Filter({ status: 'anons' })
        progressBarUpdate(12, 7)
    } else {
        anonses = data[3]
        progressBarUpdate(12, 7)
    }
    progressBarUpdate(12, 8)
    fs.writeFile(path.join(path.join(globalPath, '/data/db.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[0]), (err) => {
        if (err) {
            console.log(err)
        }
    })
    progressBarUpdate(12, 9)
    fs.writeFile(path.join(path.join(globalPath, '/data/min.db.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[1]), (err) => {
        if (err) {
            console.log(err)
        }
    })
    progressBarUpdate(12, 10)
    fs.writeFile(path.join(path.join(globalPath, '/data/quotes.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[2]), (err) => {
        if (err) {
            console.log(err)
        }
    })
    progressBarUpdate(12, 11)
    fs.writeFile(path.join(path.join(globalPath, '/data/defaultCrousel.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[3]), (err) => {
        if (err) {
            console.log(err)
        }
    })
    progressBarUpdate(12, 12)
    console.log('data done')
})

setInterval(() => {
    saveDB('https://db-worker-32o4.onrender.com/').then((data) => {
        progressBarUpdate(12, 1)
        DBdata = data[0]
        progressBarUpdate(12, 2)
        ratingDBdata = bubbleSort(DBdata)
        progressBarUpdate(12, 3)
        mainlist = mainList(
            DBdata.map((a) => ({ ...a })),
            32
        )
        progressBarUpdate(12, 4)
        toplist = mainList(
            ratingDBdata.map((a) => ({ ...a })),
            20
        )
        progressBarUpdate(12, 5)
        quotes = data[2]
        progressBarUpdate(12, 6)
        if (Filter({ status: 'anons' }).length != 0) {
            anonses = Filter({ status: 'anons' })
            progressBarUpdate(12, 7)
        } else {
            anonses = data[3]
            progressBarUpdate(12, 7)
        }
        progressBarUpdate(12, 8)
        fs.writeFile(path.join(path.join(globalPath, '/data/db.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[0]), (err) => {
            if (err) {
                console.log(err)
            }
        })
        progressBarUpdate(12, 9)
        fs.writeFile(path.join(path.join(globalPath, '/data/min.db.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[1]), (err) => {
            if (err) {
                console.log(err)
            }
        })
        progressBarUpdate(12, 10)
        fs.writeFile(path.join(path.join(globalPath, '/data/quotes.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[2]), (err) => {
            if (err) {
                console.log(err)
            }
        })
        progressBarUpdate(12, 11)
        fs.writeFile(path.join(path.join(globalPath, '/data/defaultCrousel.json').replace('app.asar', 'app.asar.unpacked')), JSON.stringify(data[3]), (err) => {
            if (err) {
                console.log(err)
            }
        })
        progressBarUpdate(12, 12)
        console.log('data done')
    })
}, 5400000)
