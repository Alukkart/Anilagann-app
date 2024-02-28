/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { progressBarUpdate, globalPath } from '../app'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'node:path'
let DBdata = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/db.json'), { encoding: 'utf8', flag: 'r' }))
let minDBdata = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/min.db.json'), { encoding: 'utf8', flag: 'r' }))
let ratingDBdata = bubbleSort(DBdata)

interface Idata {
    ids: string[]
    title: string
    rating: string | number | string[]
    votes: string | number | string[]
    epTotal: string | number | string[]
    epAired: string | number | string[]
    status: string | number | string[]
    duration: string | number | string[]
    origName: any
    type: string | number | string[]
    studios: string
    genres: string
    year: number
    next_episode: string
    description: string | number | string[]
    poster: string | number | string[]
    screen1: string
    screen2: string
    iframe: string
}

export let toplist = mainList(
    ratingDBdata.map((a: any) => ({ ...a })),
    20
)

export let mainlist = mainList(
    DBdata.map((a: any) => ({ ...a })),
    32
)

export let quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/Quotes.json'), { encoding: 'utf8', flag: 'r' }))
export var anonses = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/defaultCrousel.json'), { encoding: 'utf8', flag: 'r' }))
if (Filter({ status: 'anons' }).length != 0) {
    anonses = Filter({ status: 'anons' })
}

export function getAnimeInfo(id: string): any {
    return DBdata.find((res: any) => res['ids'].find((data) => data == id) == id)
}

function mainList(arr, BS): any {
    let finalData = []
    // let JSONdata = arr
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

// function dataCheck(value: string | number | string[], defaultVal: string[] | string): string | number | string[] {
//     if (value == (null || undefined)) {
//         return defaultVal
//     }
//     return value
// }

// function dateCheck(value: null | undefined | string, defaultVal: string): string {
//     if (value == (null || undefined)) {
//         return defaultVal
//     }
//     const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
//     let date = new Date(Date.parse(value))
//     return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
// }

// function getDataFromDB(res, finalData, miniData, titles): any {
//     for (var i of Object.keys(res)) {
//         if (titles.includes(res[i].title) == false) {
//             titles.push(res[i].title)
//             var trimData: Idata
//             if (res[i].material_data != undefined) {
//                 trimData = {
//                     ids: [res[i].id],
//                     title: res[i].title,
//                     rating: dataCheck(res[i].material_data.shikimori_rating, '0'),
//                     votes: dataCheck(res[i].material_data.shikimori_votes, '0'),
//                     epTotal: dataCheck(res[i].material_data.episodes_total, '?'),
//                     epAired: dataCheck(res[i].material_data.episodes_aired, '?'),
//                     status: dataCheck(res[i].material_data.all_status, '?'),
//                     duration: dataCheck(res[i].material_data.duration, '-'),
//                     origName: res[i].title_orig,
//                     type: dataCheck(res[i].material_data.anime_kind, '-'),
//                     studios: dataCheck(res[i].material_data.anime_studios, ['-']).join(', '),
//                     genres: dataCheck(res[i].material_data.anime_genres, ['-']).join(', '),
//                     year: res[i].year,
//                     next_episode: dateCheck(res[i].material_data.next_episode_at, '-'),
//                     description: dataCheck(dataCheck(res[i].material_data.anime_description, res[i].material_data.description), ''),
//                     poster: dataCheck(res[i].material_data.poster_url, '/poster'),
//                     screen1: res[i].screenshots[0],
//                     screen2: res[i].screenshots[1],
//                     iframe: res[i].link
//                 }
//             } else {
//                 // eslint-disable-next-line no-redeclare
//                 trimData = {
//                     ids: [res[i].id],
//                     title: res[i].title,
//                     rating: 0,
//                     votes: 0,
//                     epTotal: '?',
//                     epAired: '?',
//                     status: '?',
//                     duration: '-',
//                     origName: res[i].title_orig,
//                     type: '-',
//                     studios: '-',
//                     genres: '-',
//                     year: res[i].year,
//                     next_episode: '-',
//                     description: '',
//                     poster: '/poster',
//                     screen1: res[i].screenshots[0],
//                     screen2: res[i].screenshots[1],
//                     iframe: res[i].link
//                 }
//             }
//             finalData.push(trimData)
//             miniData.push({ id: res[i].id, title: res[i].title, entitle: res[i].title_orig })
//         } else {
//             let trimData = finalData.find((resp: any) => resp['title'] == res[i].title)
//             trimData.ids.push(res[i].id)
//         }
//     }
//     return finalData, miniData, titles
// }

// async function saveDB(url: string): Promise<any> {
//     var finalData = []
//     var miniData = []
//     var titles = []
//     var i = 0
//     while (url != null) {
//         i += 1
//         let response: any = await fetch(url)
//         response = await response.json()
//         url = response.next_page
//         getDataFromDB(response.results, finalData, miniData, titles)
//         try {
//             progressBarUpdate(response.total, i)
//         } catch (error) {
//             /* empty */
//         }
//     }
//     let data = [finalData, miniData]
//     return data
// }

// async function saveDB(url) {
//   var finalData = []
//   var miniData = []
//   var titles = []
//   for(let i = 0; i < 1; i++){
//     let response = await fetch(url);
//     response = await response.json();
//     url = response.next_page
//     getDataFromDB(response.results, finalData, miniData, titles);
//   };
//   let data = [finalData, miniData]
//   return data
// }

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
    saveDB(
        'https://kodikapi.com/list?token=684875f2ada152660b8fb3bc6be37796&limit=100&types=anime-serial,anime&camrip=false&with_episodes=false&with_material_data=true'
    ).then((data) => {
        DBdata = data[0]
        minDBdata = data[1]
        ratingDBdata = bubbleSort(DBdata)
        mainlist = mainList(
            DBdata.map((a) => ({ ...a })),
            32
        )
        toplist = mainList(
            ratingDBdata.map((a) => ({ ...a })),
            20
        )
        quotes = JSON.parse(fs.readFileSync(path.join(globalPath, '/data/Quotes.json'), { encoding: 'utf8', flag: 'r' }))
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
        fs.writeFile(path.join(globalPath, '/data/db.json'), JSON.stringify(DBdata), (err) => {
            if (err) {
                console.log(err)
            }
        })
        fs.writeFile(path.join(globalPath, '/data/min.db.json'), JSON.stringify(minDBdata), (err) => {
            if (err) {
                console.log(err)
            }
        })
        console.log('data done')
    })
}, 5400000)
