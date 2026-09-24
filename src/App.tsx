
import './App.css'
// import AppRoutes from './AppRoutes/AppRoutes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter } from "react-router-dom";
// import { AppFooter } from './Components/AppFooter/AppFooter';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppRouter from './AppRoutes/AppRoutes';
import Geolocation from './Components/Geolocation/Geolocation';
// import AppdesckTopHeader from './Components/AppdesktopHeader/AppdesckTopHeader';
function App() {
const queryClient = new QueryClient();
  const { i18n } = useTranslation();

  useEffect(() => {
   
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [i18n.language]);
  return (
    <QueryClientProvider client={queryClient}>
      <Geolocation/>
       <AppRouter/>
     
    </QueryClientProvider>

  )
}

export default App
