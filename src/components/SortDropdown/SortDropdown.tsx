import React, { useEffect } from 'react';
import './SortDropdown.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/storeTypes';
import { setSortBy } from '../../redux/filtersSlice';
import { resetContents, loadNextPage } from '../../redux/contentsSlice';
import { useSearchParams } from 'react-router-dom';

const sortOptions = ['Item Name', 'Higher Price', 'Lower Price'] as const;
const defaultSort = 'Item Name';

const SortDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSort = useSelector((state: RootState) => state.filters.sortBy);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const urlSort = searchParams.get('sort');
    if (urlSort && sortOptions.includes(urlSort as typeof sortOptions[number])) {
      dispatch(setSortBy(urlSort as typeof sortOptions[number]));
    } else {
      dispatch(setSortBy(defaultSort));
      searchParams.delete('sort');
      setSearchParams(searchParams);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof sortOptions[number];

    dispatch(setSortBy(value));
    dispatch(resetContents());
    dispatch(loadNextPage());

    if (value === defaultSort) {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', value);
    }
    setSearchParams(searchParams);
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
