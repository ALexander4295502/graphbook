/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import '../../../assets/css/style.css';
import { USER_AVATAR_URL_PRESET } from '../utils/Constant';

const GET_POSTS = gql`
  {
    posts {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
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
    const { posts, postContent, addPost } = this.state;
    const newPost = {
      id: posts.length + 1,
      text: postContent,
      user: {
        username: 'Fake User',
      },
    };
    addPost({
      variables: { post: newPost },
    }).then(() => {
      this.setState({
        postContent: '',
      });
    });
  };

  render() {
    const { postContent } = this.state;
    return (
      <Query query={GET_POSTS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return error.message;
          const { posts } = data;
          return (
            <>
              <div className="postForm">
                <Mutation
                  mutation={ADD_POST}
                  update={(store, { data: { addPost } }) => {
                    const res = store.readQuery({ query: GET_POSTS });
                    res.posts.unshift(addPost);
                    store.writeQuery({ query: GET_POSTS, data: res });
                  }}
                  optimisticResponse={{
                    __typename: 'mutation',
                    addPost: {
                      __typename: 'Post',
                      text: postContent,
                      id: -1,
                      user: {
                        __typename: 'User',
                        username: 'Loading',
                        avatar: '/public/loading.gif',
                      },
                    },
                  }}
                >
                  {addPost => (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        addPost({
                          variables: {
                            post: {
                              text: postContent,
                            },
                          },
                        }).then(() => {
                          this.setState({ postContent: '' });
                        });
                      }}
                    >
                      <textarea
                        value={postContent}
                        onChange={this.handlePostContentChange}
                        placeholder="Write your custom post!"
                      />
                      <input type="submit" value="Submit" />
                    </form>
                  )}
                </Mutation>
              </div>
              <div className="feed">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className={`post ${post.id < 0 ? 'optimistic' : ''}`}
                  >
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
            </>
          );
        }}
      </Query>
    );
  }
}
