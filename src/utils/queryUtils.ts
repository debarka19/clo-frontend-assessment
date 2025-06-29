import { PricingType } from '../redux/filtersSlice';

export const parseQueryParams = (search: string) => {
  const params = new URLSearchParams(search);

  const keyword = params.get('keyword') || '';

  const pricingRaw = params.get('pricing');
  const pricing: PricingType[] = pricingRaw
    ? pricingRaw.split(',').map(Number).filter((n): n is PricingType => [0, 1, 2].includes(n))
    : [];

  const sortBy = params.get('sort') || '';

  const priceMin = parseInt(params.get('priceMin') || '0', 10);
  const priceMax = parseInt(params.get('priceMax') || '999', 10);

  return {
    keyword,
    pricing,
    sortBy,
    priceMin,
    priceMax,
  };
};

export const buildQueryParams = (filters: {
  keyword: string;
  pricing: PricingType[];
  sortBy: string;
  priceRange: number[];
}) => {
  const params = new URLSearchParams();

  if (filters.keyword.trim()) {
    params.set('keyword', filters.keyword.trim());
  }

  if (filters.pricing.length > 0) {
    params.set('pricing', filters.pricing.join(','));
  }

  if (filters.sortBy) {
    params.set('sort', filters.sortBy); 
  }

  params.set('priceMin', String(filters.priceRange[0]));
  params.set('priceMax', String(filters.priceRange[1]));

  return params.toString();
};
