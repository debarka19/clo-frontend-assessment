import React from 'react';
import './ContentCard.scss';
import { ContentItem } from '../../redux/contentsSlice';

interface Props {
  content: ContentItem;
}

const ContentCard: React.FC<Props> = ({ content }) => {
  return (
    <div className="content-card">
      <div className="card-image">
        <img src={content.imagePath} alt={content.title} onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.png';
        }} />
      </div>
      <div className="card-body">
        <h3 className="title">{content.title}</h3>
        <p className="user">@{content.creator}</p>
        <p className="price">
          {content.pricingOption === 0 && content.price != null
            ? `$${content.price}`
            : content.pricingOption === 1 ? 'Free' : 'View only'}
        </p>
      </div>
    </div>
  );
};

export default ContentCard;
