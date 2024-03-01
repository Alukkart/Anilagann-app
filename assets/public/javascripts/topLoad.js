let nextPage = 0
let isLoading = false
let shouldLoad = true

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
    if (nextPage < 5) {
        let res = await fetch('/getanimelist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page: nextPage, sort: 'rating' })
        })
        res = await res.json()
        nextPage++
        res.forEach(appendPost)
        if (!nextPage) shouldLoad = false
        isLoading = false
    }
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
    const threshold = height - screenHeight / 4
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
