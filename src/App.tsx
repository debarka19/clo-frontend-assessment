import React from 'react';
import './styles/main.scss';
import FilterPanel from './components/FilterPanel/FilterPanel';
import SortDropdown from './components/SortDropdown/SortDropdown';
import ContentGrid from './components/ContentGrid/ContentGrid';

const App: React.FC = () => {
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
