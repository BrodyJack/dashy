import io from 'socket.io-client';

let setupIO = (stateHandler) => {
    let socket = io.connect(`${process.env.REACT_APP_url}`);
    setupPingListeners(socket, stateHandler);
    return socket;
};

let setupPingListeners = (socket, stateHandler) => {
    socket.on('client ping', data => {
        stateHandler({ pinged: data });
        setTimeout(() => stateHandler({ pinged: false }), 3000);
    });

    socket.on('client room ping', data => {
        stateHandler({ pinged: data });
        setTimeout(() => stateHandler({ pinged: false }), 3000);
    });
};

export default setupIO;