import React from 'react';
import './styles/main.scss';

import FilterPanel from './components/FilterPanel/FilterPanel';
import PriceSlider from './components/PriceSlider/PriceSlider';
import SortDropdown from './components/SortDropdown/SortDropdown';
import ContentGrid from './components/ContentGrid/ContentGrid';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1 className="title">CLO-SET CONNECT Store</h1>

      <div className="sidebar-panel">
        <FilterPanel />
        <PriceSlider />
        <SortDropdown />
      </div>

      <ContentGrid />
    </div>
  );
};

export default App;
