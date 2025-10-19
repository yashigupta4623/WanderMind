import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/custom/Header.jsx';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx';
import MyTrips from './my-trips';
import Footer from './components/custom/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './components/providers/ThemeProvider.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />
  },
  {
    path: '/my-trips',
    element: <MyTrips />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="wandermind-theme">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || 'demo-client-id'}>
          <Header />
          <Toaster />
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);