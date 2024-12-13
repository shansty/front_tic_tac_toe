import React from 'react';
import LoginPage from './components/authPage/LoginPage.tsx';
import MainPage from './components/mainPage/MainPage.tsx';
import Game from './components/gamePage/game/Game.tsx';
import Header from './components/header/Header.tsx';
import GoogleAuth from './components/authPage/GoogleAuth.tsx';
import { Route, BrowserRouter, Routes} from 'react-router-dom';


const App: React.FC = () => {
  return (
    <div className='app'>
      <Header />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/auth/:token" element={<GoogleAuth />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
