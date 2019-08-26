import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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
    let { openChats, textInputs } = this.state;
    openChats = openChats.slice();
    textInputs = Object.assign({}, textInputs);
    if (openChats.indexOf(id) === -1) {
      if (openChats.length > 2) {
        openChats = openChats.slice(1);
      }
      openChats.push(id);
      textInputs[id] = '';
      this.setState({ openChats });
    }
  };

  closeChat = id => {
    let { openChats, textInputs } = this.state;
    openChats = openChats.slice();
    textInputs = Object.assign({}, textInputs);
    const index = openChats.indexOf(id);
    openChats.splice(index, 1);
    delete textInputs[id];
    this.setState({ openChats });
  };

  onChangeChatInput = (event, id) => {
    event.preventDefault();
    let { textInputs } = this.state;
    textInputs = Object.assign({}, textInputs);
    textInputs[id] = event.target.value;
    this.setState({ textInputs });
  };

  handleKeyPress = (event, id, addMessage) => {
    let { textInputs } = this.state;
    textInputs = Object.assign({}, textInputs);
    if (event.key === 'Enter' && textInputs[id].length) {
      addMessage({
        variables: { message: { text: textInputs[id], chatId: id } },
      }).then(() => {
        textInputs[id] = '';
        this.setState({ textInputs });
      });
    }
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
    const { openChats, textInputs } = this.state;

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
                    <Mutation
                      update={(store, { data: { addMessage } }) => {
                        const res = store.readQuery({
                          query: GET_CHAT,
                          variables: { chatId: chat.id },
                        });
                        res.chat.messages.push(addMessage);
                        store.writeQuery({
                          query: GET_CHAT,
                          variables: { chatId: chat.id },
                          data: res,
                        });
                      }}
                      mutation={ADD_MESSAGE}
                    >
                      {addMessage => (
                        <div className="input">
                          <input
                            value={textInputs[chat.id] || ''}
                            onChange={event =>
                              this.onChangeChatInput(event, chat.id)
                            }
                            onKeyPress={event =>
                              this.handleKeyPress(event, chat.id, addMessage)
                            }
                          />
                        </div>
                      )}
                    </Mutation>
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
