import React from 'react';

const Info = (props) => {
    const { currentRoom, handleNameChange, username } = props;
    return (
        <div>
            <p>Info Page</p>
            <p>Username: {username}</p>
            <p>Change username: {' '}
                <input type='text' value={username} onChange={(e) => handleNameChange(e.target.value)}/>
            </p>
            <p>Current room: {currentRoom} || Please visit chat or spotify to modify your room</p>
            <p>Using server with url: {process.env.REACT_APP_url}</p>
        </div>
    );
}

export default Info;