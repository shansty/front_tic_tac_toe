import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getToken, getIDFromToken } from '../../../utils.ts';
import "./Players.css"


type Player = {
    user_name: string;
    winner_games: number;
};

const Players: React.FC = () => {

    const token = getToken();
    const [players, setPlayers] = useState<Player[]>([]);
    const [showedPlayers, setShowedPlayers] = useState<Player[]>([]);
    const [filter, setFilter] = useState("");
    const playersEndRef = useRef<HTMLDivElement>(null);
    const user_id = getIDFromToken(token);

    const playersSocket = io(`${process.env.REACT_APP_SOCKET_HOST}/players`,
        {
            reconnectionDelayMax: Number(process.env.REACT_APP_MAX_DELAY),
            reconnection: true,
            auth: {
                token
            }
        }
    );

    useEffect(() => {
        playersSocket.emit("players_start", user_id)
        console.dir({ players })
    }, [])

    useEffect(() => {
        playersSocket.on("get_all_players", (data: Player[]) => {
            setPlayers(data)
            setShowedPlayers(data)
            console.dir({ players })
        })
        scrollToBottom();
    }, [players]);

    useEffect(() => {
        if (filter === "") {
            console.log("Empty filter")
            setShowedPlayers(players)
        } else {
            const filter_players = players.filter(player => player.user_name.includes(filter))
            setShowedPlayers(filter_players);
        }
    }, [filter])


    const scrollToBottom = () => {
        playersEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClick = (rival_username: string) => {
        playersSocket.emit("throw_down_a_challenge", user_id, rival_username)
    }


    return (
        <div>
            <div className="container">
                <p className='player_text'>Players table</p>
                <div className='filter_search'>
                    <label htmlFor="filter" className='filter_search_label' >
                        Player search:
                    </label>
                    <input
                        value={filter}
                        className='auth_fields'
                        placeholder="Please enter username"
                        type="text"
                        name="filter"
                        id="filter"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className='players-container'>
                    {showedPlayers.map((showedPlayer, index) => (
                        <div key={index} className="player-container">
                            <p className="player">{showedPlayer.user_name}</p>
                            <p className="player_score">Score: {showedPlayer.winner_games}</p>
                            <button onClick={() => handleClick(showedPlayer.user_name)}>challenge</button>
                        </div>
                    ))}
                    <div ref={playersEndRef}></div>
                </div>
            </div>
        </div>
    );
}

export default Players;
