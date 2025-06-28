import React, { useEffect, useRef, useCallback } from 'react';
import './ContentGrid.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchContents, incrementPage } from '../../redux/contentsSlice';
import ContentCard from './ContentCard';
import SkeletonCard from './SkeletonCard';
import { AppDispatch } from '../../redux/store';

const ContentGrid: React.FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, hasMore, page } = useSelector((state: RootState) => state.contents);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(incrementPage());
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  useEffect(() => {
    dispatch(fetchContents());
  }, [page]);

  return (
    <div className="content-grid">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div
            key={item.id}
            ref={isLast ? lastCardRef : undefined}
            className="card-wrapper"
          >
            <ContentCard content={item} />
          </div>
        );
      })}

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
