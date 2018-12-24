import React, { Component } from 'react';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    render() {
        const { currentRoom } = this.props;

        let noRoom = currentRoom === ""
            ? (
                <div style={ styles.outerdiv }>
                    <p>Join a room to begin chatting!</p>
                </div>
            ) : (
                <div style= { styles.outerdiv }>
                    <p>You are chatting in room: {currentRoom}</p>
                </div>
            )

        return noRoom;
    }
}

let styles = {
    outerdiv: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        minHeight: '80vh'
    }
}