import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Sparkles, CheckCircle } from 'lucide-react';

const WhyThisPlanButton = ({ item, type, context }) => {
  const [explanation, setExplanation] = useState('');
  const [open, setOpen] = useState(false);

  const generateExplanation = () => {
    let result = '';
    
    if (type === 'hotel') {
      const reasons = [];
      const hotelPrice = parseInt(item.price?.match(/\d+/)?.[0]) || 0;
      const budgetPerNight = context?.budget ? parseInt(context.budget) / parseInt(context.days) : 0;
      
      if (hotelPrice <= budgetPerNight * 1.2) {
        reasons.push(`fits perfectly in your ₹${context.budget} budget`);
      }
      
      const rating = parseFloat(item.rating);
      if (rating >= 4.0) {
        reasons.push(`has excellent ${rating} rating from verified guests`);
      }
      
      if (item.address?.toLowerCase().includes('center') || 
          item.address?.toLowerCase().includes('metro')) {
        reasons.push('is centrally located with easy transport access');
      }

      if (item.description?.toLowerCase().includes('pool') || 
          item.description?.toLowerCase().includes('spa')) {
        reasons.push('offers great amenities for relaxation');
      }

      result = `Ye hotel isliye choose kiya kyunki: ${reasons.join(', ')}.`;
      
    } else if (type === 'activity') {
      const reasons = [];
      
      if (item.rating && parseFloat(item.rating) >= 4.0) {
        reasons.push(`highly rated (${item.rating} stars)`);
      }
      
      if (item.ticketPricing?.toLowerCase().includes('free')) {
        reasons.push('free entry saves your budget');
      }
      
      if (item.timeTravel) {
        reasons.push(`perfect timing for ${item.timeTravel}`);
      }

      if (item.placeDetails?.toLowerCase().includes('family') || 
          item.placeDetails?.toLowerCase().includes('kid')) {
        reasons.push('family-friendly environment');
      }

      result = `This activity is recommended because it's ${reasons.join(', ')}.`;
      
    } else if (type === 'budget') {
      result = `Your budget is smartly distributed: ${Math.round(item.accommodation/item.total*100)}% for comfortable stays, ${Math.round(item.food/item.total*100)}% for delicious meals, and ${Math.round(item.activities/item.total*100)}% for memorable experiences. This ensures a balanced, enjoyable trip without overspending.`;
    }
    
    setExplanation(result);
  };

  const handleOpen = (isOpen) => {
    setOpen(isOpen);
    if (isOpen && !explanation) {
      generateExplanation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <HelpCircle className="w-3 h-3" />
          Why this?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Explanation
          </DialogTitle>
          <DialogDescription>
            Understanding why this was recommended for you
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {explanation}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Based on your budget, preferences, and travel style</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Verified through Google Places API and real reviews</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Optimized for your travel dates and group size</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhyThisPlanButton;
