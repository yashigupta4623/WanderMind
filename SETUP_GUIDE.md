# WanderMind Setup Guide

## 🚀 Quick Start

The app is now running with demo/fallback modes, but for full functionality, you'll need to set up API keys.

## 📋 Required API Keys

### 1. Google Cloud Console Setup
Visit: https://console.cloud.google.com/

#### Enable APIs:
- **Places API** (for location search)
- **Gemini AI API** (for trip generation)
- **OAuth 2.0** (for user authentication)

#### Get API Keys:
1. Create a new project or select existing
2. Go to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "API Key"
4. Restrict the key to specific APIs for security

### 2. Firebase Setup (Optional but Recommended)
Visit: https://console.firebase.google.com/

1. Create a new project
2. Enable Authentication (Google Sign-in)
3. Enable Firestore Database
4. Get configuration from Project Settings

## 🔧 Environment Configuration

Update your `.env` file with real API keys:

```env
# Google APIs Configuration
VITE_GOOGLE_PLACES_API_KEY=AIzaSy...your_actual_key
VITE_GOOGLE_GEMINI_AI_API_KEY=AIzaSy...your_actual_key  
VITE_GOOGLE_AUTH_CLIENT_ID=123456789-...your_actual_client_id

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🎯 Current Status

### ✅ Working Features (No API Keys Required):
- **Manual Destination Input** - Enter destinations manually
- **Travel Persona Selection** - Choose your travel style
- **Budget Prediction** - AI-powered budget estimation
- **Group Travel Planning** - Collaborative trip planning
- **Trip Story Generation** - Create shareable travel stories
- **Eco-Score Tracking** - Sustainability metrics
- **Offline Mode** - Download trips for offline access
- **Weather Monitoring** - Adaptive itinerary suggestions

### 🔑 Features Requiring API Keys:
- **Google Places Search** - Auto-complete location search
- **AI Trip Generation** - Full AI-powered itinerary creation
- **Google Authentication** - Sign in with Google
- **Real-time Data** - Live weather and place information

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🔍 Troubleshooting

### Black Screen Issues:
1. Check browser console for errors
2. Verify .env file exists and has values
3. Restart development server after .env changes
4. Clear browser cache

### API Errors:
1. Verify API keys are correct
2. Check API quotas and billing
3. Ensure APIs are enabled in Google Cloud Console
4. Check network connectivity

### Build Issues:
1. Run `npm install` to ensure dependencies
2. Check Node.js version compatibility
3. Clear node_modules and reinstall if needed

## 📱 Progressive Web App (PWA)

The app includes PWA capabilities:
- Offline functionality
- Install as mobile app
- Background sync (when implemented)

## 🌟 Next Steps

1. **Set up API keys** for full functionality
2. **Configure Firebase** for user data persistence
3. **Deploy to production** (Vercel, Netlify, etc.)
4. **Add real payment integration** for booking features
5. **Implement push notifications** for trip updates

## 🆘 Need Help?

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure internet connectivity for API calls
- Try the manual input modes as fallbacks

The app is designed to work gracefully even without API keys, providing a great user experience while you set up the full configuration!