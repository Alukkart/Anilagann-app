/* eslint-disable @typescript-eslint/no-unused-vars */
let nextPage = 0
let isLoading = false
let shouldLoad = true
let fetchbody = {
    page: nextPage,
    genres: new URLSearchParams(window.location.search).get('genres'),
    years: new URLSearchParams(window.location.search).get('years'),
    status: new URLSearchParams(window.location.search).get('status'),
    types: new URLSearchParams(window.location.search).get('types'),
    sort: 'date'
}

if (new URLSearchParams(window.location.search).get('genres')) {
    document.getElementById('genres').value = new URLSearchParams(window.location.search).get('genres')
}

function appendPost(postData) {
    if (!postData) return
    const main = document.getElementById('cards')
    const postNode = composePost(postData)
    main.insertAdjacentHTML('beforeend', postNode)
}

function composePost(postData) {
    if (!postData) return
    const title = postData.title
    const url = postData.ids[0]
    const img = postData.poster
    const rating = postData.rating

    const card = `
    <div id="card" class="card col m-lg-3 m-md-1 m-sm-1 p-0" style="width: 288px;">
    <a href="/anime/${url}">
    <img id="poster" src="${img}" class=" rounded-0" alt="" style="width: 286px; height: 404px">
    <div class="card-img-overlay" id="cardOverlay">
      <h4 class="card-text m-0">${rating}</h4>
      <h4 class="card-text">${title}</h4>
      <p class="card-text">${postData.epAired} из ${postData.epTotal}<br></p>
      <a class="card-text">${postData.genres}<br></a>
      <a class="card-text">${postData.year}<br></a>
    </div>
    </a>
    </div>
    `
    return card
}

//фетч
async function fetchPosts() {
    if (isLoading || !shouldLoad) return
    isLoading = true
    let res = await fetch('/getanimelist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchbody)
    })
    try {
        res = await res.json()
    } catch {
        document.getElementById('cards').innerHTML = `<div class="text-center"><h3>Ничего не найдено</h3></div>`
    }
    try {
        document.getElementById('spinner').remove()
    } catch {
        /* empty */
    }
    nextPage++
    fetchbody.page = nextPage
    try {
        res.forEach(appendPost)
    } catch {
        /* empty */
    }
    if (!nextPage) shouldLoad = false
    isLoading = false
}

//тормоза
function throttle(callee, timeout) {
    let timer = null

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

// запуск
async function checkPosition() {
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight
    const scrolled = window.scrollY
    const threshold = height - screenHeight / 3
    const position = scrolled + screenHeight

    if (position >= threshold) {
        await fetchPosts()
    }
}

;(() => {
    window.addEventListener('load', throttle(checkPosition))
    window.addEventListener('scroll', throttle(checkPosition))
    window.addEventListener('resize', throttle(checkPosition))
})()

function filterApply() {
    const url = new URLSearchParams()
    const genres = document.getElementById('genres').value
    const status = document.getElementById('status').value
    const types = document.getElementById('types').value
    const sort = document.getElementById('sort').value

    if (genres) {
        url.set('genres', genres)
    }
    if (status) {
        url.set('status', status)
    }
    if (types) {
        url.set('types', types)
    }
    if (sort) {
        url.set('sort', sort)
    }
    document.getElementById('cards').innerHTML = `
    <div class="spinner-border text-primary" id="spinner" role="status">
        <span class="visually-hidden">Загрузка</span>
    </div>`
    nextPage = 0
    fetchbody = {
        page: nextPage,
        genres: url.get('genres'),
        years: url.get('years'),
        status: url.get('status'),
        types: url.get('types'),
        sort: url.get('sort')
    }
    fetchPosts()
}
