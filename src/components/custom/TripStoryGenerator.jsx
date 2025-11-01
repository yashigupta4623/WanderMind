import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Share2, Download, Copy, Sparkles, Clock, MapPin } from 'lucide-react';
import { chatSession } from '@/service/AIModel';
import { toast } from 'sonner';

const TripStoryGenerator = ({ tripData }) => {
  const [generatedStory, setGeneratedStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyStyle, setStoryStyle] = useState('adventure');

  const storyStyles = [
    { id: 'adventure', name: 'Adventure Story', icon: '🏔️', desc: 'Exciting and thrilling narrative' },
    { id: 'romantic', name: 'Romantic Journey', icon: '💕', desc: 'Perfect for couples and romantic trips' },
    { id: 'family', name: 'Family Adventure', icon: '👨‍👩‍👧‍👦', desc: 'Fun family-friendly storytelling' },
    { id: 'solo', name: 'Solo Discovery', icon: '🎒', desc: 'Personal journey and self-discovery' },
    { id: 'cultural', name: 'Cultural Exploration', icon: '🏛️', desc: 'Rich cultural and historical narrative' },
    { id: 'foodie', name: 'Culinary Journey', icon: '🍜', desc: 'Food-focused travel story' }
  ];

  const STORY_PROMPT = `
    Create an engaging travel story based on this trip data: ${JSON.stringify(tripData)}
    
    Style: {style}
    
    Write a compelling travel story that includes:
    - Engaging opening that sets the scene
    - Day-by-day narrative highlighting key experiences
    - Local interactions and cultural insights
    - Memorable moments and discoveries
    - Emotional journey and personal growth
    - Vivid descriptions of places, food, and experiences
    - Conclusion that reflects on the journey
    
    IMPORTANT FORMATTING RULES:
    - Use simple, clean text formatting
    - Use **bold** only for emphasis (sparingly)
    - Use *italic* only for emphasis (sparingly)
    - Separate paragraphs with double line breaks
    - Write in a natural, flowing narrative style
    - Avoid excessive formatting or special characters
    
    Make it shareable and inspiring for other travelers. 
    Length: 600-800 words.
    Tone: {tone}
    
    Return as JSON with:
    {
      "title": "story title",
      "subtitle": "engaging subtitle", 
      "story": "full story text with minimal formatting",
      "highlights": ["key highlight 1", "key highlight 2", "key highlight 3"],
      "tags": ["tag1", "tag2", "tag3"],
      "readTime": "estimated read time",
      "shareText": "short social media version"
    }
  `;

  const generateStory = async () => {
    if (!tripData) {
      toast.error('No trip data available to generate story');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedStyle = storyStyles.find(s => s.id === storyStyle);
      const tone = getStoryTone(storyStyle);
      
      const prompt = STORY_PROMPT
        .replace('{style}', selectedStyle.name)
        .replace('{tone}', tone);

      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();
      
      try {
        const storyData = JSON.parse(response);
        setGeneratedStory(storyData);
        toast.success('Your travel story has been generated!');
      } catch (e) {
        // Fallback if JSON parsing fails
        const fallbackStory = createFallbackStory(tripData, selectedStyle);
        setGeneratedStory(fallbackStory);
        toast.success('Travel story generated successfully!');
      }
    } catch (error) {
      console.error('Story generation error:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStoryTone = (style) => {
    const tones = {
      adventure: 'Exciting, energetic, and inspiring',
      romantic: 'Warm, intimate, and dreamy',
      family: 'Fun, heartwarming, and inclusive',
      solo: 'Reflective, personal, and empowering',
      cultural: 'Respectful, educational, and immersive',
      foodie: 'Descriptive, sensory, and appetizing'
    };
    return tones[style] || 'Engaging and inspiring';
  };

  const createFallbackStory = (data, style) => {
    const destination = data?.userSelection?.location?.label || 'Amazing Destination';
    const days = data?.userSelection?.noofDays || '3';
    
    return {
      title: `${days} Days in ${destination}: A ${style.name}`,
      subtitle: `An unforgettable journey through the heart of ${destination}`,
      story: `Our ${days}-day adventure in ${destination} was nothing short of magical. From the moment we arrived, we were captivated by the beauty and charm of this incredible destination.\n\nEach day brought new discoveries and experiences that will stay with us forever. The local culture, delicious cuisine, and breathtaking sights created memories that we'll treasure for a lifetime.\n\nThis journey reminded us why we love to travel - for the connections we make, the beauty we witness, and the stories we create along the way.`,
      highlights: [
        `Explored the best of ${destination}`,
        'Discovered hidden local gems',
        'Created unforgettable memories'
      ],
      tags: ['travel', 'adventure', destination.toLowerCase()],
      readTime: '3 min read',
      shareText: `Just had an amazing ${days}-day trip to ${destination}! ✈️ #Travel #Adventure`
    };
  };

  // Format story text by converting simple markdown to JSX
  const formatStoryText = (text) => {
    if (!text) return null;
    
    // Clean up the text first
    let cleanText = text
      // Remove excessive asterisks and formatting
      .replace(/\*{3,}/g, '') // Remove triple or more asterisks
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold italic
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
      // Clean up extra spaces and line breaks
      .replace(/\n{3,}/g, '\n\n') // Max 2 line breaks
      .trim();
    
    // Split text into paragraphs
    const paragraphs = cleanText.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Convert remaining line breaks to <br />
      const formattedText = paragraph.replace(/\n/g, '<br />');
      
      return (
        <p 
          key={index} 
          className="mb-6 text-base leading-7 text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareStory = (platform) => {
    if (!generatedStory) return;

    const shareText = generatedStory.shareText;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };

    window.open(urls[platform], '_blank');
  };

  const downloadStory = () => {
    if (!generatedStory) return;

    const content = `${generatedStory.title}\n${generatedStory.subtitle}\n\n${generatedStory.story}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedStory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            AI Trip Story Generator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform your travel itinerary into a compelling story to share with friends and family
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Story Style Selection */}
          <div>
            <h4 className="font-medium mb-3">Choose Your Story Style</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {storyStyles.map((style) => (
                <Card
                  key={style.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    storyStyle === style.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                  onClick={() => setStoryStyle(style.id)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <h5 className="font-medium text-sm">{style.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">{style.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateStory} 
            disabled={isGenerating || !tripData}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Crafting Your Story...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Generate Travel Story
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Story */}
      {generatedStory && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{generatedStory.title}</CardTitle>
                <p className="text-gray-600 mt-1">{generatedStory.subtitle}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {generatedStory.readTime}
                  </div>
                  <div className="flex gap-1">
                    {generatedStory.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedStory.story)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadStory}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Story Content */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {formatStoryText(generatedStory.story)}
              </div>
            </div>

            {/* Story Highlights */}
            {generatedStory.highlights && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Story Highlights</h4>
                <ul className="space-y-1">
                  {generatedStory.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Share Options */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Your Story
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareStory('twitter')}
                  className="flex items-center gap-2"
                >
                  🐦 Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareStory('facebook')}
                  className="flex items-center gap-2"
                >
                  📘 Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareStory('linkedin')}
                  className="flex items-center gap-2"
                >
                  💼 LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedStory.shareText)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Share Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripStoryGenerator;