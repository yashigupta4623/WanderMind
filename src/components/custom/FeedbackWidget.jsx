import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  Star, 
  Send, 
  ThumbsUp, 
  Heart,
  X,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { feedbackService } from '@/service/FeedbackService';

const FeedbackWidget = ({ isOpen, onClose, onFeedbackSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'features', name: 'Features', icon: '⚡' },
    { id: 'ui', name: 'User Interface', icon: '🎨' },
    { id: 'performance', name: 'Performance', icon: '🚀' },
    { id: 'suggestion', name: 'Suggestion', icon: '💡' }
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        rating,
        comment: comment.trim(),
        category,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const newFeedback = feedbackService.addFeedback(feedbackData);
      
      if (onFeedbackSubmit) {
        onFeedbackSubmit(newFeedback);
      }

      toast.success('Thank you for your feedback! 🎉');
      
      // Reset form
      setRating(0);
      setComment('');
      setCategory('general');
      
      // Close widget after a delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-in zoom-in-95">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Share Your Feedback
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Help us improve WanderMind with your valuable feedback
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              How would you rate your experience?
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Feedback Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat.id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRating(5);
                setCategory('general');
                setComment('Love the AI-powered trip planning! 🚀');
              }}
              className="flex-1 text-xs"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Quick Positive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRating(4);
                setCategory('suggestion');
                setComment('');
              }}
              className="flex-1 text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Suggestion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackWidget;