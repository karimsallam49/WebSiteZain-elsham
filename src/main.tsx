import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
import './i18n';
// import { MenuProvider } from './context/MenuContext.tsx';
// import { LanguageProvider } from './context/LanguageContext/LanguageContext.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store/store.ts';
import persistor from './store/store.ts';
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>



       {/* <LanguageProvider> */}

   {/* <MenuProvider> */}
      <App /> 
         {/* </MenuProvider> */}
             {/* </LanguageProvider> */}
    </PersistGate>
    </Provider>

)
