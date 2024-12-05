import React, { useEffect, useState } from 'react';
import { TypeUserGameData } from '../../types.ts';
import { getUserGamesData } from '../../axios.ts';
import { getToken, getIDFromToken } from '../../utils.ts';
import "./UserGamesData.css";


const GamesData = () => {

    const [gamesData, setGamesData] = useState<TypeUserGameData[]>([]);

    const token = getToken();
    const user_id = getIDFromToken(token);

    useEffect(() => {
        getUserGamesData(user_id as number, token, setGamesData)
    }, [])

    return (
        <div className='game_data_container'>
            {gamesData.map((gameData, index) => (
                <div className="game_data" key={index}>
                    <p >
                        Game status with {gameData.rival_username} in position {gameData.position.toLowerCase()} is {gameData.game_status}
                    </p>
                    <div className='game_data_btn'>
                        <p>Go to the game: <a href={gameData.game_link}>{gameData.game_link}</a></p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GamesData;
