import React, { useState, useEffect } from 'react';
import api from './services/api';
import PlayerItem from './components/PlayerItem/PlayerItem';
import Navbar from './components/Navbar/Navbar';
import './global.css';
import './App.css';
import './Main.css';

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function loadPlayers() {
      const res = await api.get('/players');

      setPlayers(res.data.playersRes);
    }

    loadPlayers();
  }, []);

  return (
    <>
      <Navbar title="Banana Plant Tracker" />
      <div id="app">
        <main>
          <ul>
            {players.map(player => (
              <PlayerItem key={player.p_id} player={player} />
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}

export default App;
