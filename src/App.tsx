import React, { useEffect } from 'react';
import './styles/main.scss';
import FilterPanel from './components/FilterPanel/FilterPanel';
import SortDropdown from './components/SortDropdown/SortDropdown';
import ContentGrid from './components/ContentGrid/ContentGrid';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setKeyword, setPricing, setSortBy, setPriceRange } from './redux/filtersSlice';
import { resetContents, loadNextPage } from './redux/contentsSlice';
import { AppDispatch } from './redux/storeTypes';
import { PricingType } from './redux/filtersSlice';
import { parseQueryParams } from './utils/queryUtils';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { keyword, pricing, sortBy, priceMin, priceMax } = parseQueryParams(location.search);

    dispatch(setKeyword(keyword));
    dispatch(setPricing(pricing as PricingType[]));

    if (['Item Name', 'Higher Price', 'Lower Price'].includes(sortBy)) {
      dispatch(setSortBy(sortBy as 'Item Name' | 'Higher Price' | 'Lower Price'));
    }

    dispatch(setPriceRange([priceMin, priceMax]));
    dispatch(resetContents());
    dispatch(loadNextPage());

    const params = new URLSearchParams(location.search);
    let shouldUpdate = false;

    if (!params.has('min')) {
      params.set('min', '0');
      shouldUpdate = true;
    }
    if (!params.has('max')) {
      params.set('max', '999');
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      navigate({ search: params.toString() }, { replace: true });
    }

  }, [location.search]);

  return (
    <div className="app-container">
      <header className="header-head">
        <h1 className="title">CONNECT</h1>
      </header>
      <div className="body-rest">
        <div className="sidebar-panel">
          <FilterPanel />
          <SortDropdown />
        </div>
        <ContentGrid />
      </div>
    </div>
  );
};

export default App;
