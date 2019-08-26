import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { generateAvatarIdFromUsername } from '../utils/Helpers';

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

export default class Chats extends Component {
  constructor() {
    super();
    this.state = {
      openChats: [],
      textInputs: {},
    };
  }

  openChat = id => {
    let { openChats } = this.state;
    openChats = openChats.slice();
    if (openChats.indexOf(id) === -1) {
      if (openChats.length > 2) {
        openChats = openChats.slice(1);
      }
      openChats.push(id);
      this.setState({ openChats });
    }
  };

  closeChat = id => {
    let { openChats } = this.state;
    openChats = openChats.slice();
    const index = openChats.indexOf(id);
    openChats.splice(index, 1);
    this.setState({ openChats });
  };

  usernamesToString = users => {
    return users
      .slice(1)
      .map(user => user.username)
      .join(', ');
  };

  shorten = text => {
    if (text) {
      if (text.length > 12) {
        return `${text.substring(0, text.length - 9)}...`;
      }
    }
    return text;
  };

  render() {
    const { openChats } = this.state;

    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading</p>;
              if (error) return error.message;
              const { chats } = data;
              return chats.map(chat => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={`chat${chat.id}`}
                  className="chat"
                  onClick={() => this.openChat(chat.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="header">
                    <img
                      alt="user-avatar"
                      src={
                        chat.users.length > 2
                          ? '/public.group.png'
                          : generateAvatarIdFromUsername(chat.users[1].username)
                      }
                    />
                    <div>
                      <h2>
                        {this.shorten(this.usernamesToString(chat.users))}
                      </h2>
                      <span>{this.shorten((chat.lastMessage || {}).text)}</span>
                    </div>
                  </div>
                </div>
              ));
            }}
          </Query>
        </div>
        <div className="openChats">
          {openChats.map(chatId => (
            <Query
              key={`chatWindow${chatId}`}
              query={GET_CHAT}
              variables={{ chatId }}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading</p>;
                if (error) return error.message;
                const { chat } = data;
                return (
                  <div className="chatWindow">
                    <div className="header">
                      <span>{chat.users[1].username}</span>
                      <button
                        className="close"
                        type="submit"
                        onClick={() => this.closeChat(chatId)}
                      >
                        X
                      </button>
                    </div>
                    <div className="messages">
                      {chat.messages.map(message => (
                        <div
                          key={`message${message.id}`}
                          className={`message ${
                            message.user.id > 1 ? 'left' : 'right'
                          }`}
                        >
                          {message.text}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </Query>
          ))}
        </div>
      </div>
    );
  }
}
