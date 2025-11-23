import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Languages, Sparkles, CheckCircle } from 'lucide-react';
import { voiceAssistant } from '@/service/VoiceAssistantService';
import { toast } from 'sonner';

const VoiceFirstPlanner = ({ onPlanCreated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [micPermission, setMicPermission] = useState(null);

  const languages = [
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇬🇧' }
  ];

  const exampleCommands = {
    'hi-IN': [
      "Mujhe 3 din ka budget friendly trip chahiye Jaipur, heritage + street food",
      "5 din ke liye Goa beach trip plan karo, moderate budget",
      "Delhi mein 2 din family trip, historical places dekhne hain"
    ],
    'en-IN': [
      "I want a 3 day budget trip to Jaipur with heritage and street food",
      "Plan a 5 day beach trip to Goa, moderate budget",
      "2 day family trip in Delhi to see historical places"
    ]
  };

  const handleStartListening = async () => {
    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      setMicPermission(true);
      console.log('✅ Microphone permission granted');
    } catch (error) {
      console.error('Microphone permission error:', error);
      setMicPermission(false);
      toast.error('🎤 Microphone access denied. Please allow microphone in browser settings and try again.');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setResult(null);
    setIsListening(true);

    voiceAssistant.setLanguage(selectedLanguage);

    voiceAssistant.startListening(
      (text) => {
        console.log('✅ Final transcript received:', text);
        setTranscript(text);
        setInterimTranscript('');
        setIsListening(false);

        // Only process if we have meaningful text
        if (text && text.trim().length > 3) {
          processVoiceInput(text);
        } else {
          toast.error('Could not understand. Please speak clearly and try again.');
          setIsListening(false);
        }
      },
      (error) => {
        console.error('❌ Voice recognition error:', error);
        setIsListening(false);
        setInterimTranscript('');
        toast.error(error);
      },
      (interim) => {
        console.log('🎤 Interim transcript:', interim);
        setInterimTranscript(interim);
      }
    );

    toast.success('🎤 Listening... Speak now!', { duration: 2000 });
  };

  const handleStopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  const processVoiceInput = async (text) => {
    setProcessing(true);
    toast.loading('AI samajh raha hai...');

    try {
      const lang = selectedLanguage.split('-')[0];
      const parsed = await voiceAssistant.processVoiceCommand(text, lang);

      setResult(parsed);
      toast.dismiss();

      if (parsed.understood) {
        toast.success('Samajh gaya! ✨');

        // Speak the response
        voiceAssistant.speak(parsed.response, selectedLanguage);

        if (onPlanCreated) {
          onPlanCreated(parsed);
        }
      } else {
        toast.error('Samajh nahi aaya, phir se boliye');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast.dismiss();
      toast.error('Kuch gadbad ho gayi, phir se try karein');
    } finally {
      setProcessing(false);
    }
  };

  const handleExampleClick = (example) => {
    setTranscript(example);
    processVoiceInput(example);
  };

  const handleSpeak = (text) => {
    voiceAssistant.speak(text, selectedLanguage);
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" />
            Bolkar Plan Banao (Voice Planning)
            <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-800">
              India-First
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Apni bhasha mein boliye, AI samajh jayega! 🇮🇳
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Languages className="w-4 h-4" />
              Bhasha chuniye (Select Language)
            </label>
            <div className="flex gap-2">
              {languages.map(lang => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className="flex-1"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.nativeName}
                </Button>
              ))}
            </div>
          </div>

          {/* Voice Input Button */}
          <div className="flex flex-col items-center gap-4 py-6">
            <Button
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={processing}
              className={`w-32 h-32 rounded-full shadow-2xl ${isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/50'
                }`}
              size="lg"
            >
              {isListening ? (
                <div className="relative">
                  <Mic className="w-12 h-12" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
              ) : processing ? (
                <Sparkles className="w-12 h-12 animate-spin" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </Button>
            <div className="text-center">
              <p className="font-semibold text-lg">
                {isListening ? '🎤 Bol rahe hain...' : processing ? '🤖 Samajh raha hoon...' : '🎤 Mic dabaye aur boliye'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isListening ? 'Listening... Speak clearly' : processing ? 'Processing your request...' : 'Press mic and speak'}
              </p>
              {micPermission === false && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Microphone permission needed
                </p>
              )}
            </div>
          </div>

          {/* Interim Transcript (Live feedback) */}
          {interimTranscript && isListening && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-300">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 italic">
                    {interimTranscript}...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transcript */}
          {transcript && (
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 mt-1 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Aapne kaha:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      "{transcript}"
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(transcript)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {result && result.understood && (
            <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Samajh gaya! ✨</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Destination</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.destination}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.days} din
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Budget</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {result.budget}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Preferences</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.preferences?.join(', ') || 'General'}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Volume2 className="w-4 h-4 mt-1 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {result.response}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpeak(result.response)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Commands */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              💡 Example Commands (Click to try):
            </h4>
            <div className="space-y-2">
              {exampleCommands[selectedLanguage].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleExampleClick(example)}
                >
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    "{example}"
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              🎤 <strong>Tip:</strong> Mic button dabaye, apni bhasha mein boliye, aur AI automatically samajh jayega!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceFirstPlanner;
