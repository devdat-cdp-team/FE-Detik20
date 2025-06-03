import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import './index.css';
import Layout from './Layout.jsx';
import Login from './Login.jsx';
import Dashboard from '../src/Pages/Dashboard.jsx';
import global from './global.jsx';
import VideoAnalyticsPage from '../src/Pages/VideoAnalyticsPage.jsx';
import AttributeSearchPage from '../src/Pages/AttributeSearchPage.jsx';
import Result from './components/AttributeSearchPage/Result.jsx';

const msalInstance = new PublicClientApplication(msalConfig);

export const ProfileContext = createContext();
export const LanguageContext = createContext();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <Main />
    </MsalProvider>
  </React.StrictMode>,
)

function Main() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {

        // var userLang = (navigator.language || navigator.userLanguage)?.split("-")[0] ; 
        // var offset = new Date().getTimezoneOffset();
        // console.log("The language is: " + userLang, Language[userLang], Intl.DateTimeFormat().resolvedOptions().timeZone, offset/60);

        // if (Language[userLang]) {
        //   setLanguage(Language[userLang]);
        // } else {
        //   setLanguage(Language[defaultLang])
        // }

  }, [])

  useEffect(() => {
    console.log("main profile: ", profile)
  }, [profile])

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={global.google_client_id}>
        <ProfileContext.Provider value={{profile, setProfile}}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />}/>
              <Route path='/' element={<Layout />}>
                <Route path='/' element={<Dashboard />} />
                <Route path='/video-analysis' element={<VideoAnalyticsPage />} />
                <Route path='/attribute-search' element={<AttributeSearchPage />} />
                <Route path='/result' element={<Result />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfileContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}