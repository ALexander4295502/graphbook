import logger from '../../helpers/logger';

const { db } = this;
const { Post } = db.models;

const resolvers = {
  Post: {
    user(post) {
      return post.getUser();
    },
  },

  RootQuery: {
    posts() {
      logger.log({
        level: 'info',
        message: 'Fetch post success',
      });
      return Post.findAll({
        order: [['createdAt', 'DESC']],
      });
    },
  },

  RootMutation: {
    addPost(root, { post, user }) {
      logger.log({
        level: 'info',
        message: 'Create post success',
      });
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
