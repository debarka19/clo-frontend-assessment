import React, { useEffect, useState } from 'react';
import './PriceSlider.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/storeTypes';
import { setPriceRange } from '../../redux/filtersSlice';
import { resetContents, loadNextPage } from '../../redux/contentsSlice';

const PriceSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pricing, priceRange } = useSelector((state: RootState) => state.filters);
  const isPaidSelected = pricing.includes(0);

  const [minVal, setMinVal] = useState(priceRange[0]);
  const [maxVal, setMaxVal] = useState(priceRange[1]);

   useEffect(() => {
    setMinVal(priceRange[0]);
    setMaxVal(priceRange[1]);
  }, [priceRange]);

  useEffect(() => {
    dispatch(setPriceRange([minVal, maxVal]));
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [minVal, maxVal, dispatch]);

  if (!isPaidSelected) return null;

  return (
    <div className="price-slider">
     
      <div className="slider-container">
      
      <label className="slider-label">${minVal}</label>
        <input
          type="range"
          min="0"
          max="999"
          value={minVal}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            setMinVal(value);
          }}
        />
        <input
          type="range"
          min="0"
          max="999"
          value={maxVal}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            setMaxVal(value);
          }}
        />
        <label className="slider-label">${maxVal}</label>
      </div>
    </div>
  );
};

export default PriceSlider;
