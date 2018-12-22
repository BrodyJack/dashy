export let onPrevClick = (player) => {
    if (player !== null) {
        player.previousTrack();
    }
};

export let onToggleClick = (player) => {
    if (player !== null) {
        player.togglePlay();
    }
};

export let onNextClick = (player) => {
    if (player !== null) {
        player.nextTrack();
    }
};

