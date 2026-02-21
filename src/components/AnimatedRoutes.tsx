import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import FloatingSupportButton from "./FloatingSupportButton";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Gallery from "@/pages/Gallery";
import Templates from "@/pages/Templates";
import Products from "@/pages/Products";
import Pricing from "@/pages/Pricing";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Documentation from "@/pages/Documentation";
import DocumentationDetail from "@/pages/DocumentationDetail";
import Tutorials from "@/pages/Tutorials";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import DonationSuccess from "@/pages/DonationSuccess";
import Mastering from "@/pages/Mastering";
import DesignSystemGenerator from "@/pages/DesignSystemGenerator";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  // Hide support button on admin and auth pages
  const hideFloatingButton = location.pathname.startsWith('/admin') ||
    location.pathname === '/auth' ||
    location.pathname === '/reset-password';

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/templates" element={<PageTransition><Templates /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/documentation" element={<PageTransition><Documentation /></PageTransition>} />
          <Route path="/documentation/:slug" element={<PageTransition><DocumentationDetail /></PageTransition>} />
          <Route path="/tutorials" element={<PageTransition><Tutorials /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/donation-success" element={<PageTransition><DonationSuccess /></PageTransition>} />
          <Route path="/mastering" element={<PageTransition><Mastering /></PageTransition>} />

          {/* Design System Generator - Nested Routes */}
          <Route path="/design-system-generator/*" element={<DesignSystemGenerator />} />

          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {/* Global floating support button */}
      {!hideFloatingButton && <FloatingSupportButton />}
    </>
  );
};

export default AnimatedRoutes;
