import { onToggleClick, onPrevClick, onNextClick } from '../spotify/playerActions';

let setPlayerListeners = (socket, player) => {
    socket.on('client toggle music', () => {
        onToggleClick(player);
    });

    socket.on('client previous music', () => {
        onPrevClick(player);
    });

    socket.on('client next music', () => {
        onNextClick(player);
    });
};

export default setPlayerListeners;