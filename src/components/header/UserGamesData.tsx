import React, { useEffect, useState } from 'react';
import { TypeUserGameData } from '../../types.ts';
import { getUserGamesData } from '../../axios.ts';
import { getToken, checkTokenExparation, getIDFromToken } from '../../utils.ts';
import "./UserGamesData.css";


const GamesData:React.FC = () => {

    const [gamesData, setGamesData] = useState<TypeUserGameData[]>([]);

    const token = getToken() as string;
    const user_id = getIDFromToken(token);

    useEffect(() => {
        getUserGamesData(user_id as number, token, setGamesData)
    }, [])

    useEffect(() => {
            checkTokenExparation(token)
        }, [token])

    return (
        <div className='data_container'>
            {gamesData.map((gameData, index) => (
                <div className="data" key={index}>
                    <p >
                        Game status with {gameData.rival_username} in position {gameData.position.toLowerCase()} is {gameData.game_status}
                    </p>
                    <p>Go to the game:
                        <br />
                        <a href={gameData.game_link} className='game_link'>{gameData.game_link}</a>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default GamesData;
