import React from 'react';
import { Sweet } from '../types';
import Button from './Button';
import Badge from './Badge';
import { ShoppingCart } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
  isPurchasing?: boolean;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase, isPurchasing = false }) => {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="aspect-w-16 aspect-h-9 w-full h-48 bg-slate-100 relative">
        <img 
          src={sweet.imageUrl} 
          alt={sweet.name} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        <div className="absolute top-3 right-3">
          <Badge color={sweet.quantity === 0 ? 'red' : sweet.quantity < 10 ? 'yellow' : 'green'}>
            {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} left`}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-600 uppercase tracking-wider">
            {sweet.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1" title={sweet.name}>{sweet.name}</h3>
          <span className="text-lg font-bold text-brand-600">₹{sweet.price.toFixed(2)}</span>
        </div>
        
        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">
          {sweet.description}
        </p>
        
        <Button 
          onClick={() => onPurchase(sweet)} 
          disabled={isOutOfStock || isPurchasing}
          className="w-full"
          variant={isOutOfStock ? 'outline' : 'primary'}
          isLoading={isPurchasing}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Sold Out' : 'Purchase'}
        </Button>
      </div>
    </div>
  );
};

export default SweetCard;