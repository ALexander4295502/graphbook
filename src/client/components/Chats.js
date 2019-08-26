import React, { Component } from 'react';

const chats = [
  {
    id: 1,
    users: [
      {
        id: 1,
        avatar: '/uploads/avatar1.png',
        username: 'Test User',
      },
      {
        id: 2,
        avatar: '/uploads/avatar2.png',
        username: 'Test User2',
      },
    ],
  },
];

export default class Chats extends Component {
  usernamesToString = users => {
    return users
      .slice(1)
      .map(user => user.username)
      .join(', ');
  };

  shorten = text => {
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }
    return text;
  };

  render() {
    return (
      <div className="chats">
        {chats.map((chat, i) => (
          <div key={chat.id} className="chat">
            <div className="header">
              <div className="header">
                <img
                  alt="user-avatar"
                  src={
                    chat.users.length > 2
                      ? '/public.group.png'
                      : chat.users[1].avatar
                  }
                />
              </div>
              <h2>{this.shorten(this.usernamesToString(chat.users))}</h2>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
