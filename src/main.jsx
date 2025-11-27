import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/custom/Header.jsx';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx';
import MyTrips from './my-trips';
import Footer from './components/custom/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './components/providers/ThemeProvider.jsx';
import About from './pages/About.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Blog from './pages/Blog.jsx';
import FAQs from './pages/FAQs.jsx';
import Press from './pages/Press.jsx';
import Airlines from './pages/Airlines.jsx';
import Tips from './pages/Tips.jsx';
import AirlineFees from './pages/AirlineFees.jsx';
import BadgesCertificates from './pages/BadgesCertificates.jsx';
import TestMapsPage from './test-maps.jsx';

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/careers',
        element: <Careers />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/privacy',
        element: <Privacy />
      },
      {
        path: '/terms',
        element: <Terms />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/faqs',
        element: <FAQs />
      },
      {
        path: '/press',
        element: <Press />
      },
      {
        path: '/airlines',
        element: <Airlines />
      },
      {
        path: '/tips',
        element: <Tips />
      },
      {
        path: '/airline-fees',
        element: <AirlineFees />
      },
      {
        path: '/badges',
        element: <BadgesCertificates />
      },
      {
        path: '/test-maps',
        element: <TestMapsPage />
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="wandermind-theme">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || 'demo-client-id'}>
          <Toaster />
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);