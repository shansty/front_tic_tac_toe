import React from 'react';
import LoginPage from './components/authPage/LoginPage.tsx';
import MainPage from './components/mainPage/MainPage.tsx';
import Game from './components/gamePage/game/Game.tsx';
import { Route, BrowserRouter, Routes} from 'react-router-dom';
import { SocketProvider } from './SocketContext.tsx';  


function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/game/:id" element={<Game />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;