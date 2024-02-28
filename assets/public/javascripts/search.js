async function getMinList() {
  let response = await fetch('/data/min.db.json')
  let res =  await response.json()
  return res
}
var data = getMinList()

const search = document.getElementById('search');
const results = document.getElementById('results');
let search_term = '';

search.addEventListener('input', (event) => {
  if(event.target.value.length > 2 && !event.target.value.includes('sep')){
    search_term = event.target.value.toLowerCase();
    showList();
  }else{
    results.innerHTML = '';
  }
});

const showList = () => {
  results.innerHTML = '';
  data.then((JSONdata) => {
    console.log(JSONdata)
    JSONdata.filter((item) => {
      return (
        item.title.toLowerCase().includes(search_term)
        ||
        item.entitle.toLowerCase().includes(search_term)
      );
    }).forEach((e) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href='/anime/${e.id}'><h5>${e.title}</h5><p>${e.entitle}</p><hr class="border border-primary opacity-5"></a>`;
      results.appendChild(li);
    });
  })
};