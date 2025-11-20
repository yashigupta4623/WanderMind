import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Volume2, Lightbulb, RefreshCw } from 'lucide-react';
import { translationService } from '@/service/TranslationService';
import { voiceAssistant } from '@/service/VoiceAssistantService';
import { toast } from 'sonner';

const MultilingualTripDisplay = ({ tripData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [showLocalTips, setShowLocalTips] = useState(true);

  const languages = translationService.getAllLanguages().slice(0, 6); // Show top 6

  const handleTranslate = async (langCode) => {
    if (langCode === selectedLanguage) return;

    setSelectedLanguage(langCode);
    setTranslating(true);
    toast.loading('Translating...');

    try {
      const translated = await translationService.translateTripPlan(tripData, langCode);
      setTranslatedData(translated);
      toast.dismiss();
      toast.success(`Translated to ${translationService.getLanguageInfo(langCode).name}!`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.dismiss();
      toast.error('Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const handleSpeak = (text) => {
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN'
    };
    voiceAssistant.speak(text, langMap[selectedLanguage] || 'en-IN');
  };

  const localTips = translationService.getLocalTips(selectedLanguage);
  const destination = tripData?.userSelection?.location?.label || 'your destination';
  const destinationTips = translationService.generateLocalTips(destination, selectedLanguage);

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-600" />
            Choose Your Language / अपनी भाषा चुनें
            <Badge variant="secondary" className="ml-auto">
              10+ Languages
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languages.map(lang => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                onClick={() => handleTranslate(lang.code)}
                disabled={translating}
                className="flex items-center justify-start gap-2"
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="text-left">
                  <div className="text-xs font-semibold">{lang.nativeName}</div>
                  <div className="text-[10px] opacity-75">{lang.name}</div>
                </div>
              </Button>
            ))}
          </div>

          {translating && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Translating your trip plan...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Local Tips - India Specific */}
      {showLocalTips && (
        <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              {selectedLanguage === 'hi' ? 'स्थानीय टिप्स' : 'Local Tips'}
              <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-800">
                India Savvy
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {Object.entries(localTips).map(([key, tip]) => (
                <div
                  key={key}
                  className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg"
                >
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {tip}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(tip)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <h5 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {selectedLanguage === 'hi' ? `${destination} के लिए खास टिप्स:` : `Special tips for ${destination}:`}
              </h5>
              <div className="space-y-2">
                {destinationTips.slice(0, 3).map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-orange-600">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Translated Trip Preview */}
      {translatedData && selectedLanguage !== 'en' && (
        <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                {selectedLanguage === 'hi' ? 'आपकी यात्रा योजना तैयार है!' : 'Your trip plan is ready!'}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectedLanguage === 'hi' 
                ? 'आपकी पूरी यात्रा योजना अब हिंदी में उपलब्ध है। सभी विवरण, गतिविधियाँ और सुझाव आपकी भाषा में हैं।'
                : `Your complete trip plan is now available in ${translationService.getLanguageInfo(selectedLanguage).name}. All details, activities, and suggestions are in your language.`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Voice Assistant Info */}
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-200 mb-1">
                {selectedLanguage === 'hi' ? '🎤 आवाज़ से सुनें' : '🎤 Listen with Voice'}
              </h5>
              <p className="text-xs text-purple-800 dark:text-purple-300">
                {selectedLanguage === 'hi'
                  ? 'किसी भी टिप या विवरण के पास स्पीकर आइकन पर क्लिक करें और सुनें!'
                  : 'Click the speaker icon next to any tip or detail to hear it aloud!'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultilingualTripDisplay;
