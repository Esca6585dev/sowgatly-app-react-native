// API resources return translated fields as { tm, ru, en }, while raw models
// (e.g. cart items) carry name_tm / name_ru / name_en columns. Handle both.
export const localize = (entity, field, lang) => {
  if (!entity) return '';
  const value = entity[field];

  if (value && typeof value === 'object') {
    return value[lang] || value.tm || value.ru || value.en || '';
  }

  return (
    entity[`${field}_${lang}`] ||
    entity[`${field}_tm`] ||
    entity[`${field}_ru`] ||
    entity[`${field}_en`] ||
    (typeof value === 'string' ? value : '')
  );
};

export const discountedPrice = (product) => {
  if (!product) return 0;
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  return Math.floor(price - (price * discount) / 100);
};
