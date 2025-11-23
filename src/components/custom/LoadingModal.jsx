import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Plane, Hotel, Map, Camera, Coffee, AlertCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOADING_MESSAGES = [
    { text: "Charting your course...", icon: <Map className="w-5 h-5" /> },
    { text: "Finding the best hotels...", icon: <Hotel className="w-5 h-5" /> },
    { text: "Discovering hidden gems...", icon: <Camera className="w-5 h-5" /> },
    { text: "Curating local experiences...", icon: <Coffee className="w-5 h-5" /> },
    { text: "Finalizing your itinerary...", icon: <Plane className="w-5 h-5" /> }
];

const DESTINATION_FACTS = {
    'Goa': {
        fact: "Did you know? Goa has the highest forest density in India!",
        why: "Famous for its pristine beaches, Portuguese heritage, and vibrant nightlife.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80"
    },
    'Mumbai': {
        fact: "Mumbai was originally an archipelago of seven islands.",
        why: "The City of Dreams, known for Bollywood, colonial architecture, and street food.",
        image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80"
    },
    'Delhi': {
        fact: "Delhi is one of the oldest continuously inhabited cities in the world.",
        why: "A blend of ancient history and modern chaos, home to the Red Fort and India Gate.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80"
    },
    'Jaipur': {
        fact: "Jaipur was the first planned city of India.",
        why: "The Pink City, famous for its royal palaces, forts, and vibrant bazaars.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80"
    },
    'Kerala': {
        fact: "Kerala is known as 'God's Own Country' and has the highest literacy rate in India.",
        why: "Famous for its backwaters, houseboats, and lush green tea plantations.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80"
    },
    'Manali': {
        fact: "Manali is named after the Sanatan Hindu lawgiver Manu.",
        why: "A backpacker's paradise, offering snow-capped mountains and adventure sports.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80"
    },
    'Paris': {
        fact: "The Eiffel Tower was originally intended to be a temporary structure.",
        why: "The City of Light, known for art, fashion, gastronomy, and culture.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
    }
};

const LoadingModal = ({ open, destination, error, onRetry, onClose }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!open) {
            setProgress(0);
            setCurrentMessageIndex(0);
            return;
        }

        if (error) return; // Stop animation on error

        // Cycle through messages
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2500);

        // Simulated progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 92) return prev; // Hold at 92% until complete
                // Slower progress as it gets higher
                const increment = prev > 70 ? 0.5 : prev > 40 ? 1 : 2;
                return Math.min(prev + increment, 92);
            });
        }, 150);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, [open, error]);

    if (!open) return null;

    // Find facts or use generic fallback
    const destKey = Object.keys(DESTINATION_FACTS).find(k => destination?.includes(k));
    const destData = destKey ? DESTINATION_FACTS[destKey] : {
        fact: "Travel opens your heart, broadens your mind, and fills your life with stories to tell.",
        why: "Get ready for an unforgettable adventure tailored just for you.",
        image: `https://source.unsplash.com/800x600/?${encodeURIComponent(destination || 'travel')}`
    };

    const currentMessage = LOADING_MESSAGES[currentMessageIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-500">
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

            {/* Popup Card */}
            <div className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-300">

                {/* Header Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={destData.image}
                        alt={destination}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-6 text-white">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {error ? 'Trip Generation Failed' : `Planning: ${destination}`}
                        </h2>
                        {!error && (
                            <p className="text-sm text-gray-200 font-medium opacity-90">
                                {destData.why}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                    {error ? (
                        // Error State
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Oops! Something went wrong.
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                                {error}
                            </p>
                            <div className="flex gap-3 justify-center mt-4">
                                <Button variant="outline" onClick={onClose} className="w-32">
                                    <X className="w-4 h-4 mr-2" />
                                    Close
                                </Button>
                                <Button onClick={onRetry} className="w-32 bg-red-600 hover:bg-red-700 text-white">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Loading State
                        <div className="space-y-6">
                            {/* Fact Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <div className="flex gap-3">
                                    <span className="text-xl">💡</span>
                                    <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                                        "{destData.fact}"
                                    </p>
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end px-1">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                                        {currentMessage.icon}
                                        <span className="text-sm">{currentMessage.text}</span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold">
                                        {Math.round(progress)}%
                                    </span>
                                </div>

                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
