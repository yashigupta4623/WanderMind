import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Sparkles, 
  Share2, 
  Download,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Wand2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

function TripStory({ trip }) {
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');

  const destination = trip?.userSelection?.location?.label || trip?.tripDetails?.destination || 'your destination';
  const days = trip?.userSelection?.noofDays || trip?.tripDetails?.duration || '3 days';
  const travelers = trip?.userSelection?.traveler || '2 people';

  // Load saved story on mount
  React.useEffect(() => {
    const savedStoryData = localStorage.getItem(`trip_story_${destination}`);
    if (savedStoryData) {
      try {
        const parsed = JSON.parse(savedStoryData);
        setStory(parsed.story);
        setGeneratedStory(parsed.story);
      } catch (error) {
        console.error('Error loading saved story:', error);
      }
    }
  }, [destination]);

  const generateAIStory = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const aiStory = `🌟 My Amazing ${days} Adventure in ${destination}! 🌟

Day 1 started with excitement as we arrived in ${destination}. The city welcomed us with open arms and vibrant energy. We explored the local markets, tasted authentic street food, and met wonderful people who shared their stories.

The highlight of Day 2 was visiting the iconic landmarks. Each place had its own unique charm and history. We captured countless memories and learned so much about the local culture and traditions.

On our final day, we discovered hidden gems that only locals know about. From cozy cafes to breathtaking viewpoints, every moment was special. The food, the people, and the experiences made this trip unforgettable.

${destination} has stolen our hearts! 💙 Already planning our next visit. This journey taught us that the best adventures are the ones shared with loved ones.

#Travel #${destination.replace(/[^a-zA-Z]/g, '')} #Adventure #Wanderlust #TravelDiaries #ExploreMore #TravelGoals #Vacation #TravelPhotography #InstaTravel`;

      setGeneratedStory(aiStory);
      setStory(aiStory);
      setIsGenerating(false);
      toast.success('Story generated! Feel free to edit it.');
    }, 2000);
  };

  const copyStory = () => {
    navigator.clipboard.writeText(story);
    toast.success('Story copied to clipboard!');
  };

  const shareToSocialMedia = (platform) => {
    const encodedStory = encodeURIComponent(story);
    const tripUrl = window.location.href;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tripUrl)}&quote=${encodedStory}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedStory}&url=${encodeURIComponent(tripUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tripUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedStory}%0A%0A${encodeURIComponent(tripUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=My Trip to ${destination}&body=${encodedStory}%0A%0A${encodeURIComponent(tripUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    toast.success(`Opening ${platform}...`);
  };

  const saveStory = () => {
    // Save to localStorage
    const storyData = {
      story: story,
      destination: destination,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`trip_story_${destination}`, JSON.stringify(storyData));
    toast.success('Story saved successfully!');
  };

  const downloadStory = () => {
    const element = document.createElement('a');
    const file = new Blob([story], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${destination.replace(/[^a-zA-Z0-9]/g, '_')}_story.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Story downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Trip Story</h2>
          <Badge variant="secondary">Share Your Journey</Badge>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Create a memorable story about your trip to share with friends and family on social media!
      </p>

      {/* AI Generate Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">AI Story Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Let AI create a beautiful story about your {days} trip to {destination} with {travelers}. You can edit it afterwards!
              </p>
              <Button
                onClick={generateAIStory}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Story with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Section */}
      {story && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Share Your Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share your amazing travel story on social media and inspire others!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => shareToSocialMedia('facebook')}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                onClick={() => shareToSocialMedia('twitter')}
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                onClick={() => shareToSocialMedia('instagram')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Instagram</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => shareToSocialMedia('whatsapp')}
              >
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => shareToSocialMedia('email')}
              >
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for a Great Story
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Include specific moments that made your trip special</li>
            <li>• Mention local food, culture, and people you met</li>
            <li>• Add relevant hashtags for better reach</li>
            <li>• Keep it authentic and personal</li>
            <li>• Include emojis to make it more engaging</li>
          </ul>
        </CardContent>
      </Card>

      {/* Story Editor - Moved to bottom and made smaller */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={`Write your story about ${destination}...\n\nTip: Include your favorite moments, places you visited, food you tried, and people you met!`}
            className="min-h-[150px] text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>{story.length} characters</span>
              {story.length > 0 && (
                <>
                  <span>•</span>
                  <span>{story.split(/\s+/).filter(w => w.length > 0).length} words</span>
                </>
              )}
            </div>

            {story && (
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={saveStory} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={copyStory}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadStory}>
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TripStory;
