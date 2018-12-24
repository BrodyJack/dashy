let createEventHandlers = (player, handleSpotifyState) => {
    player.on('initialization_error', e => { console.error(e); });
    player.on('authentication_error', e => {
        console.error(e);
        handleSpotifyState({ loggedIn: false });
    });
    player.on('account_error', e => { console.error(e); });
    player.on('playback_error', e => { console.error(e); });
    player.on('player_state_changed', state => autoUpdateState(state, handleSpotifyState));
    player.on('ready', data => {
        let { device_id } = data;
        console.log('Spotify Player Ready!');
        handleSpotifyState({ loggedIn: true, deviceId: device_id, loading: false });
    });
};

let autoUpdateState = (state, handleSpotifyState) => {
    if (state !== null) { // null state is sent when music stops
        const { current_track: currentTrack, position, duration } = state.track_window;

        const trackName = currentTrack.name;
        const albumName = currentTrack.album.name;
        const artistName = currentTrack.artists.map(artist => artist.name).join(", ");
        const playing = !state.paused;

        handleSpotifyState({
            position,
            duration,
            trackName,
            albumName,
            artistName,
            playing
        });
    }
};

export default createEventHandlers;