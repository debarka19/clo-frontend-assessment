import React, { useEffect, useCallback } from 'react';
import './ContentGrid.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/storeTypes';
import { fetchContents, loadNextPage, resetContents } from '../../redux/contentsSlice';
import ContentCard from './ContentCard';
import SkeletonCard from './SkeletonCard';

const ContentGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, hasMore, fullData, page } = useSelector((state: RootState) => state.contents);
  const filters = useSelector((state: RootState) => state.filters);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 20) {
      dispatch(loadNextPage());
    }
  }, [dispatch, loading, hasMore]);

  useEffect(() => {
    if (fullData.length === 0) {
      dispatch(fetchContents()).then(() => {
        dispatch(loadNextPage());
      });
    }
  }, [dispatch, fullData.length]);

  useEffect(() => {
    if (fullData.length > 0) {
      dispatch(resetContents());
      dispatch(loadNextPage());
    }
  }, [filters, dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="content-grid">
      {items.length > 0 ? (
        items.map((item, idx) => (
          <div key={item.id + '_' + idx} className="card-wrapper">
            <ContentCard content={item} />
          </div>
        ))
      ) : !loading ? (
        <div className="no-items-message">No items found.</div>
      ) : null}
  
      {loading &&
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card-wrapper">
            <SkeletonCard />
          </div>
        ))}
    </div>
  );
};

export default ContentGrid;
