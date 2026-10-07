const guideSearch = document.querySelector('[data-guide-search]');
const productFilter = document.querySelector('[data-product-filter]');
const categoryFilter = document.querySelector('[data-category-filter]');
const guideRows = [...document.querySelectorAll('[data-guide-row]')];
const guideCount = document.querySelector('[data-guide-count]');
const guideEmpty = document.querySelector('[data-guide-empty]');

function filterGuides() {
  const query = guideSearch.value.trim().toLocaleLowerCase();
  const product = productFilter.value;
  const category = categoryFilter.value;
  let visible = 0;

  for (const row of guideRows) {
    const matches = (!query || row.dataset.searchText.includes(query)) &&
      (!product || row.dataset.product === product) &&
      (!category || row.dataset.category === category);
    row.hidden = !matches;
    if (matches) visible += 1;
  }

  guideCount.textContent = `${visible} ${visible === 1 ? 'guide' : 'guides'}`;
  guideEmpty.hidden = visible !== 0;
}

guideSearch.addEventListener('input', filterGuides);
productFilter.addEventListener('change', filterGuides);
categoryFilter.addEventListener('change', filterGuides);
