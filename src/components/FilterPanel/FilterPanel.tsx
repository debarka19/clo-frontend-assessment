import React, { useEffect, useState } from 'react';
import './FilterPanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPricing,
  setKeyword,
  resetFilters,
  PricingType,
  PricingOption
} from '../../redux/filtersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchContents } from '../../redux/contentsSlice';

const PRICING_OPTIONS: PricingType[] = [0,1,2];

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  const [localKeyword, setLocalKeyword] = useState(filters.keyword);
  const [selected, setSelected] = useState<PricingType[]>(filters.pricing);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setKeyword(localKeyword));
      dispatch(fetchContents());
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [localKeyword]);

  const toggleOption = (option: PricingType) => {
    let updated: PricingType[];
    if (selected.includes(option)) {
      updated = selected.filter((o) => o !== option);
    } else {
      updated = [...selected, option];
    }
    setSelected(updated);
    dispatch(setPricing(updated));
    dispatch(fetchContents());
  };

  const handleReset = () => {
    setSelected([]);
    setLocalKeyword('');
    dispatch(resetFilters());
    dispatch(fetchContents());
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <label className="filter-label">Pricing Options:</label>
        <div className="checkbox-group">
          {PRICING_OPTIONS.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option ===PricingOption.PAID ? "Paid": option ===PricingOption.FREE ?"Free": "View only" }
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Search by Keyword:</label>
        <input
          type="text"
          placeholder="e.g., Anisha"
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.target.value)}
          className="search-input"
        />
      </div>

      <button className="reset-button" onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
