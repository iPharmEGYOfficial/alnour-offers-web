function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeSearch(value) {
  return normalizeText(value).toLowerCase();
}

export function extractCategories(items = []) {
  const map = new Map();

  for (const item of items) {
    const key = normalizeText(item.categoryName || item.category || "عام");
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: key,
        count: 1,
      });
    } else {
      map.get(key).count += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export function extractBrands(items = []) {
  const map = new Map();

  for (const item of items) {
    const key = normalizeText(item.brandName || item.brand || "عام");
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: key,
        count: 1,
      });
    } else {
      map.get(key).count += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export function filterCatalog(
  items = [],
  {
    search = "",
    category = "",
    brand = "",
    offersOnly = false,
    activeOnly = true,
  } = {},
) {
  const q = normalizeSearch(search);
  const selectedCategory = normalizeSearch(category);
  const selectedBrand = normalizeSearch(brand);

  return items.filter((item) => {
    if (activeOnly && !Boolean(item.isActive ?? true)) {
      return false;
    }

    if (
      offersOnly &&
      !String(item.productType ?? "")
        .toLowerCase()
        .includes("offer")
    ) {
      return false;
    }

    if (selectedCategory) {
      const itemCategory = normalizeSearch(item.categoryName || item.category);
      if (itemCategory !== selectedCategory) return false;
    }

    if (selectedBrand) {
      const itemBrand = normalizeSearch(item.brandName || item.brand);
      if (itemBrand !== selectedBrand) return false;
    }

    if (!q) return true;

    return [
      item.productName,
      item.name,
      item.barcode,
      item.brandName,
      item.brand,
      item.categoryName,
      item.category,
      item.productID,
    ]
      .filter(Boolean)
      .some((value) => normalizeSearch(value).includes(q));
  });
}

export default {
  extractCategories,
  extractBrands,
  filterCatalog,
};










