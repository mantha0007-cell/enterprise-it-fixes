const form = document.querySelector('[data-search-form]');
const input = document.querySelector('[data-search-input]');
const output = document.querySelector('[data-search-results]');
const status = document.querySelector('[data-search-status]');
const params = new URLSearchParams(location.search);
const initial = params.get('q') || '';
if (input) input.value = initial;

function render(items, query) {
  output.replaceChildren();
  if (!query.trim()) { status.textContent = 'Enter an error, product, log file, or symptom to search verified cases.'; return; }
  if (!items.length) { status.textContent = 'No verified cases matched that search.'; return; }
  status.textContent = `${items.length} verified ${items.length === 1 ? 'case' : 'cases'} found.`;
  for (const item of items) {
    const link = document.createElement('a'); link.className = 'search-result-card'; link.href = item.url;
    const heading = document.createElement('h2'); heading.textContent = item.title;
    const summary = document.createElement('p'); summary.textContent = item.description;
    const meta = document.createElement('small'); meta.textContent = `${item.vendor} · ${item.product} · ${item.category} · Updated ${item.dateModified}`;
    link.append(heading, summary, meta); output.append(link);
  }
}

let indexPromise;
function search(query) {
  status.textContent = 'Searching verified cases…';
  indexPromise ||= fetch('/search-index.json').then((response) => {
    if (!response.ok) throw new Error('Search index unavailable');
    return response.json();
  });
  indexPromise.then((index) => {
    const terms = query.toLocaleLowerCase().match(/[\p{L}\p{N}._-]+/gu) || [];
    const results = index.map((item) => {
      const text = [item.title,item.description,item.product,item.vendor,...item.versions,item.category,...item.tags,...item.errorCodes,...item.eventIds,...item.logFiles,...item.symptoms].join(' ').toLocaleLowerCase();
      const score = terms.reduce((total, term) => total + (text.includes(term) ? (item.title.toLocaleLowerCase().includes(term) ? 3 : 1) : 0), 0);
      return { item, score };
    }).filter(({score}) => score > 0).sort((a,b) => b.score-a.score).slice(0,50).map(({item}) => item);
    render(results, query);
  }).catch(() => { status.textContent = 'Search is temporarily unavailable.'; });
}
form?.addEventListener('submit', (event) => {
  event.preventDefault(); const query = input.value.trim();
  history.replaceState(null, '', `${location.pathname}?q=${encodeURIComponent(query)}`); search(query);
});
if (initial) search(initial);
