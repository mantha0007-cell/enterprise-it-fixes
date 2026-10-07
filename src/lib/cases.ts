export function slugify(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function facets(entries: Array<{ data: { category: string; product: string; vendor: string; tags: string[] } }>) {
  const values: Record<string, Set<string>> = { categories: new Set(), products: new Set(), vendors: new Set(), tags: new Set() };
  for (const { data } of entries) {
    values.categories.add(data.category);
    values.products.add(data.product);
    values.vendors.add(data.vendor);
    data.tags.forEach((tag) => values.tags.add(tag));
  }
  return Object.fromEntries(Object.entries(values).map(([key, set]) => [key, [...set].sort((a,b) => a.localeCompare(b))]));
}
