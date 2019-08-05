import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import '../../assets/css/style.css';
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
      postContent: '',
    };
  }

  generateAvatarIdFromUsername = username => {
    return username
      .toLowerCase()
      .split(' ')
      .join('_');
  };

  handlePostContentChange = event => {
    this.setState({ postContent: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { posts, postContent } = this.state;
    const newPost = {
      id: posts.length + 1,
      text: postContent,
      user: {
        username: 'Fake User',
      },
    };
    this.setState(prevState => ({
      posts: [newPost, ...prevState.posts],
      postContent: '',
    }));
  };

  render() {
    const { posts, postContent } = this.state;

    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="description"
            content="Newsfeed of all your friends on Graphbook"
          />
        </Helmet>
        <div className="postForm">
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={postContent}
              onChange={this.handlePostContentChange}
              placeholder="Write your custom post!"
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
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
