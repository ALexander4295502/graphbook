import logger from '../../helpers/logger';

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

const resolvers = {
  RootQuery: {
    posts() {
      logger.log({
        level: 'info',
        message: 'Fetch post success',
      });
      return fakePosts;
    },
  },

  RootMutation: {
    addPost(root, { post, user }) {
      const postObject = {
        ...post,
        user,
        id: fakePosts.length + 1,
      };
      fakePosts.push(postObject);
      return postObject;
    },
  },
};

export default function resolver() {
  return resolvers;
}
