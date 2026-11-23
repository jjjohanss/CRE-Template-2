import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ListingDetail from './pages/ListingDetail';
import TeamMember from './pages/TeamMember';
import Expertise from './pages/Expertise';
import PrivacyPolicy from './pages/PrivacyPolicy';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Careers from './pages/Careers';
import ListingsByState from './pages/ListingsByState';
import ServicePage from './pages/ServicePage';
import ScrollToTop from './components/ScrollToTop';
import PageViewTracker from './components/PageViewTracker';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AppRoutes = () => {
  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/listings/:slug" element={<ListingDetail />} />
      <Route path="/expertise" element={<Expertise />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsArticle />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/listings-by-state" element={<ListingsByState />} />
      <Route path="/team/:slug" element={<TeamMember />} />
      <Route path="/services/:slug" element={<ServicePage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <PageViewTracker />
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App