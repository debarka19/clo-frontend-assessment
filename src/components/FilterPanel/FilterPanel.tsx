import React, { useEffect, useState } from 'react';
import './FilterPanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPricing,
  setKeyword,
  setPriceRange,
  resetFilters,
  PricingType,
  PricingOption,
} from '../../redux/filtersSlice';
import { AppDispatch, RootState } from '../../redux/storeTypes';
import { resetContents, loadNextPage } from '../../redux/contentsSlice';
import useDebounce from '../../hooks/useDebounce';
import PriceSlider from '../PriceSlider/PriceSlider';
import { useSearchParams } from 'react-router-dom';

const PRICING_OPTIONS: PricingType[] = [0, 1, 2];

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);
  const [searchParams, setSearchParams] = useSearchParams();


  const initialKeyword = searchParams.get('keyword') || '';
  const initialPricing = searchParams.get('pricing')
    ? searchParams.get('pricing')!.split(',').map(Number) as PricingType[]
    : [];
  const initialMin = parseInt(searchParams.get('min') || '0', 10);
  const initialMax = parseInt(searchParams.get('max') || '999', 10);

  const [localKeyword, setLocalKeyword] = useState(initialKeyword);
  const [selected, setSelected] = useState<PricingType[]>(initialPricing);
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);

  const debouncedKeyword = useDebounce(localKeyword, 300);


  useEffect(() => {
    dispatch(setKeyword(debouncedKeyword));
    if (debouncedKeyword) {
      searchParams.set('keyword', debouncedKeyword);
    } else {
      searchParams.delete('keyword');
    }
    setSearchParams(searchParams);
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [debouncedKeyword]);


  useEffect(() => {
    dispatch(setPricing(selected));
    if (selected.length > 0) {
      searchParams.set('pricing', selected.join(','));
    } else {
      searchParams.delete('pricing');
    }
    setSearchParams(searchParams);
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [selected]);


  useEffect(() => {
    dispatch(setPriceRange([minVal, maxVal]));
    searchParams.set('min', String(minVal));
    searchParams.set('max', String(maxVal));
    setSearchParams(searchParams);
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [minVal, maxVal]);


  useEffect(() => {
    if (filters.sortBy) {
      searchParams.set('sort', filters.sortBy);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  }, [filters.sortBy]);

  const toggleOption = (option: PricingType) => {
    const updated = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    setSelected(updated);
  };

  const handleReset = () => {
    setSelected([]);
    setLocalKeyword('');
    setMinVal(0);
    setMaxVal(999);
  
    dispatch(resetFilters());
    dispatch(resetContents());
    dispatch(loadNextPage());
  
  
    searchParams.delete('keyword');
    searchParams.delete('pricing');
  

    if (minVal !== 0) searchParams.set('min', String(minVal));
  
    if (maxVal !== 999) searchParams.set('max', String(maxVal));
  

    const sortBy = filters.sortBy;
    if (sortBy !== 'Item Name') searchParams.set('sort', sortBy);
  
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="filter-panel">
        <div className="filter-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Find the items you're looking for"
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div className="filter-panel">
        <div className="filter-section">
          <div className="checkbox-group">
            <label className="filter-label">Pricing Options:</label>
            {PRICING_OPTIONS.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                />
                {option === PricingOption.PAID
                  ? 'Paid'
                  : option === PricingOption.FREE
                  ? 'Free'
                  : 'View only'}
              </label>
            ))}

            <div className="priceslider-container">
              <PriceSlider
                minVal={minVal}
                maxVal={maxVal}
                setMinVal={setMinVal}
                setMaxVal={setMaxVal}
              />
            </div>
          </div>

          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
