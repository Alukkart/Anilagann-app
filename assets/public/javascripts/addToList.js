/* eslint-disable @typescript-eslint/no-unused-vars */
async function addToList() {
    const list = document.getElementById('list').value
    // var anime = document.getElementsByTagName('title')[0]
    let res = await fetch('/account/addToList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: list,
            id: window.location.pathname.slice(7)
        })
    })
    try {
        res = await res.json()
        if (res) {
            window.location.reload()
        }
    } catch {
        /* empty */
    }
}
