import React, { useEffect, useState } from 'react';
import './PriceSlider.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPriceRange } from '../../redux/filtersSlice';
import { resetContents } from '../../redux/contentsSlice';

const PriceSlider: React.FC = () => {
  const dispatch = useDispatch();
  const { pricing, priceRange } = useSelector((state: RootState) => state.filters);
  const isPaidSelected = pricing.includes(0);

  const [minVal, setMinVal] = useState(priceRange[0]);
  const [maxVal, setMaxVal] = useState(priceRange[1]);

  useEffect(() => {
    // Update global state on drag stop
    dispatch(setPriceRange([minVal, maxVal]));
    dispatch(resetContents());
  }, [minVal, maxVal]);

  if (!isPaidSelected) return null;

  return (
    <div className="price-slider">
      <label className="slider-label">Price Range: ₹{minVal} - ₹{maxVal}</label>
      <div className="slider-container">
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
      </div>
    </div>
  );
};

export default PriceSlider;
