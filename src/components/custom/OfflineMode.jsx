import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const OfflineMode = ({ tripData }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('You\'re offline. Using cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for cached trip data
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const cached = localStorage.getItem('wandermind_offline_trips');
      if (cached) {
        setOfflineData(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const downloadForOffline = async () => {
    if (!tripData) {
      toast.error('No trip data to download');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const steps = [
        { name: 'Trip itinerary', progress: 20 },
        { name: 'Hotel information', progress: 40 },
        { name: 'Place details', progress: 60 },
        { name: 'Maps data', progress: 80 },
        { name: 'Images', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDownloadProgress(step.progress);
        toast.info(`Downloading ${step.name}...`);
      }

      // Save to localStorage for offline access
      const offlineTrip = {
        id: Date.now(),
        tripData: tripData,
        downloadedAt: new Date().toISOString(),
        version: '1.0'
      };

      const existingData = JSON.parse(localStorage.getItem('wandermind_offline_trips') || '[]');
      const updatedData = [...existingData, offlineTrip];
      
      localStorage.setItem('wandermind_offline_trips', JSON.stringify(updatedData));
      setOfflineData(updatedData);

      toast.success('Trip downloaded for offline access!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download trip data');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const clearOfflineData = () => {
    localStorage.removeItem('wandermind_offline_trips');
    setOfflineData(null);
    toast.success('Offline data cleared');
  };

  const getOfflineDataSize = () => {
    const data = localStorage.getItem('wandermind_offline_trips');
    if (!data) return '0 KB';
    
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    const sizeInMB = (sizeInKB / 1024).toFixed(1);
    
    return sizeInKB > 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
  };

  const offlineFeatures = [
    {
      feature: 'View Trip Itinerary',
      available: true,
      description: 'Access your complete day-by-day itinerary'
    },
    {
      feature: 'Hotel Information',
      available: true,
      description: 'View hotel details, addresses, and contact info'
    },
    {
      feature: 'Place Details',
      available: true,
      description: 'Read about attractions and activities'
    },
    {
      feature: 'Offline Maps',
      available: false,
      description: 'Basic location info (full maps require internet)'
    },
    {
      feature: 'Real-time Updates',
      available: false,
      description: 'Weather and live information need internet'
    },
    {
      feature: 'Booking Services',
      available: false,
      description: 'Online booking requires internet connection'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={isOnline ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-orange-600" />
              )}
              <div>
                <h3 className="font-medium">
                  {isOnline ? 'Online' : 'Offline Mode'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOnline 
                    ? 'All features available' 
                    : 'Limited features - using cached data'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={isOnline ? 'default' : 'secondary'}
              className={isOnline ? 'bg-green-500' : 'bg-orange-500'}
            >
              {isOnline ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Download for Offline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Offline Access
          </CardTitle>
          <p className="text-sm text-gray-600">
            Download your trip for offline viewing when you don't have internet
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDownloading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Downloading trip data...</span>
                <span className="text-sm font-medium">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                onClick={downloadForOffline}
                disabled={!tripData || !isOnline}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Trip for Offline
              </Button>
              {offlineData && (
                <Button 
                  variant="outline" 
                  onClick={clearOfflineData}
                >
                  Clear Cache
                </Button>
              )}
            </div>
          )}

          {offlineData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Trip Available Offline
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {offlineData.length} trip(s) cached • {getOfflineDataSize()} storage used
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Features */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Features</CardTitle>
          <p className="text-sm text-gray-600">
            What you can and cannot do while offline
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offlineFeatures.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="mt-1">
                  {item.available ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${
                    item.available ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.feature}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
                <Badge 
                  variant={item.available ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.available ? 'Available' : 'Online Only'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PWA Install Prompt */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <h4 className="font-semibold text-purple-800">Install WanderMind App</h4>
              <p className="text-sm text-purple-700">
                Install our app for better offline experience and quick access to your trips
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Install App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineMode;