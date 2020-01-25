import React from 'react';
import './PlayerItem.css';

const PlayerItem = ({ player }) => {
  return (
    <li className="player-item">
      <header>
        <img
          src={require(`../../images/ranks/${player.p_currentrank}.svg`)}
          alt=""
        />
        <div className="player-info">
          <strong>{player.p_name}</strong>
          <ul>
            <li>Level: {player.p_level}</li>
            <li>K/D Ratio: {player.kd_ratio}</li>
            <li>MMR: {player.p_currentmmr}</li>
            <li>W/L Ratio: {player.wl_ratio}</li>
          </ul>
        </div>
      </header>

      <a href={`https://r6stats.com/stats/${player.p_id}`}>R6Stats</a>
    </li>
  );
};

export default PlayerItem;
