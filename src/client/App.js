import React, { Component } from 'react';

import { USER_AVATAR_URL_PRESET } from './utils/Constant';

const fakePosts = [
  {
    id: 1,
    text: 'Lorem ipsum',
    user: {
      username: 'Test User 1',
    },
  },
  {
    id: 2,
    text: 'Lorem ipsum',
    user: {
      username: 'Test User 2',
    },
  },
];

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      posts: fakePosts,
    };
  }

  generateAvatarIdFromUsername = username => {
    return username
      .toLowerCase()
      .split(' ')
      .join('_');
  };

  render() {
    const { posts } = this.state;

    return (
      <div className="container">
        <div className="feed">
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="header">
                <img
                  src={`${USER_AVATAR_URL_PRESET}/${this.generateAvatarIdFromUsername(
                    post.user.username,
                  )}.png`}
                  alt={post.user.username}
                />
                <h2>{post.user.username}</h2>
              </div>
              <p className="content">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
