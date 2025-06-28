import React from 'react';
import './SortDropdown.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setSortBy } from '../../redux/filtersSlice';
import { fetchContents } from '../../redux/contentsSlice';

const sortOptions = ['Item Name', 'Higher Price', 'Lower Price'] as const;

const SortDropdown: React.FC = () => {
  const dispatch =useDispatch<AppDispatch>();
  const selectedSort = useSelector((state: RootState) => state.filters.sortBy);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof sortOptions[number];
    dispatch(setSortBy(value));
    dispatch(fetchContents()); 
  };

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort" className="sort-label">
        Sort By:
      </label>
      <select id="sort" value={selectedSort} onChange={handleChange}>
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
