import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Map, Film } from 'lucide-react';
import InteractiveTravelMap from './InteractiveTravelMap';
import DynamicStats from './DynamicStats';

const AnimatedHeroImage = () => {
  const [animationData, setAnimationData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lottieRef, setLottieRef] = useState(null);
  const [viewMode, setViewMode] = useState('animation'); // 'animation' or 'map'

  useEffect(() => {
    // Load the animation data from the public folder
    fetch('/image.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
      });
  }, []);

  const handlePlay = () => {
    if (lottieRef) {
      lottieRef.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (lottieRef) {
      lottieRef.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (lottieRef) {
      lottieRef.goToAndPlay(0);
      setIsPlaying(true);
    }
  };

  if (!animationData) {
    // Fallback while loading
    return (
      <div className="w-full h-auto max-w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading travel animation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-auto max-w-full">
      {/* View Mode Toggle */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 flex gap-1 sm:gap-2">
        <Button
          size="sm"
          variant={viewMode === 'animation' ? 'default' : 'outline'}
          onClick={() => setViewMode('animation')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
        >
          <Film className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Animation</span>
          <span className="sm:hidden">Anim</span>
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'map' ? 'default' : 'outline'}
          onClick={() => setViewMode('map')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
        >
          <Map className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Interactive Map</span>
          <span className="sm:hidden">Map</span>
        </Button>
      </div>

      {viewMode === 'animation' ? (
        /* Lottie Animation View */
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl overflow-hidden shadow-lg">
          <Lottie
            lottieRef={setLottieRef}
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '300px',
              '@media (min-width: 640px)': {
                maxHeight: '350px'
              },
              '@media (min-width: 1024px)': {
                maxHeight: '400px'
              }
            }}
            onComplete={() => setIsPlaying(false)}
          />
          
          {/* Animation Controls Overlay */}
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={isPlaying ? handlePause : handlePlay}
              className="bg-white/80 hover:bg-white/90 text-gray-700 p-1 sm:p-2"
            >
              {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRestart}
              className="bg-white/80 hover:bg-white/90 text-gray-700 p-1 sm:p-2"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Interactive Elements Overlay - Only for Animation View */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating Travel Icons */}
            <div className="absolute top-16 left-16 animate-bounce">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                <span className="text-2xl">✈️</span>
              </div>
            </div>
            
            <div className="absolute top-20 right-20 animate-pulse">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
            
            <div className="absolute bottom-16 left-16 animate-bounce" style={{animationDelay: '1s'}}>
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                <span className="text-2xl">🎒</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Map View */
        <InteractiveTravelMap />
      )}

      {/* Dynamic Interactive Stats - Always visible */}
      <div className="absolute -bottom-16 sm:-bottom-20 lg:-bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm lg:max-w-md z-10 px-2 sm:px-0">
        <DynamicStats />
      </div>
    </div>
  );
};

export default AnimatedHeroImage;