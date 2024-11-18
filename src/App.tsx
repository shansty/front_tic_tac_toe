import React from 'react';
import LoginPage from './components/authPage/LoginPage.tsx';
import MainPage from './components/mainPage/MainPage.tsx';
import Game from './components/gamePage/game/Game.tsx';
import Chat from './components/gamePage/game_chat/Chat.tsx';
import { Route, BrowserRouter, Routes} from 'react-router-dom';


function App() {
  return (
    <div className='app'>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
