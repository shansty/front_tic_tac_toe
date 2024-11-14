export const setupGameInfo = async (navigate:Function, gameId:string) => {
    try {
        navigate(`/game/${gameId}`)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}
