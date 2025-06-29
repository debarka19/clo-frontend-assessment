import React, { useEffect } from 'react';
import './PriceSlider.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/storeTypes';
import { setPriceRange } from '../../redux/filtersSlice';
import { resetContents, loadNextPage } from '../../redux/contentsSlice';
import { useSearchParams } from 'react-router-dom';

interface PriceSliderProps {
  minVal: number;
  maxVal: number;
  setMinVal: (val: number) => void;
  setMaxVal: (val: number) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pricing } = useSelector((state: RootState) => state.filters);
  const isPaidSelected = pricing.includes(0);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!isPaidSelected) return;

    dispatch(setPriceRange([minVal, maxVal]));
    searchParams.set('min', String(minVal));
    searchParams.set('max', String(maxVal));
    setSearchParams(searchParams);
    dispatch(resetContents());
    dispatch(loadNextPage());
  }, [minVal, maxVal, dispatch, isPaidSelected]);

  if (!isPaidSelected) return null;

  return (
    <div className="price-slider">
      <label className="slider-label">${minVal}</label>
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
      <label className="slider-label">${maxVal}</label>
    </div>
  );
};

export default PriceSlider;
