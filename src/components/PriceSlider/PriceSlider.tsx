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
    dispatch(setPriceRange([minVal, maxVal]));
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [minVal, maxVal, dispatch]);

  if (!isPaidSelected) return null;

  return (
    <div className="price-slider">
      <label className="slider-label">
       ${minVal}
      </label>
      <div className="slider-wrapper">
      
        <div className="slider-track" />
        <div
          className="slider-range"
          style={{
            left: `${(minVal / 999) * 100}%`,
            width: `${((maxVal - minVal) / 999) * 100}%`,
          }}
        />
        
        <input
          type="range"
          min="0"
          max="999"
          value={minVal}
          onChange={(e) =>
            setMinVal(Math.min(Number(e.target.value), maxVal - 1))
          }
          className="thumb thumb-left"
        />
        <input
          type="range"
          min="0"
          max="999"
          value={maxVal}
          onChange={(e) =>
            setMaxVal(Math.max(Number(e.target.value), minVal + 1))
          }
          className="thumb thumb-right"
        />
        
      </div>
      <label className="slider-label">
        ${maxVal}
      </label>
    </div>
  );
};

export default PriceSlider;
