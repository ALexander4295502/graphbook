import logger from '../../helpers/logger';

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;

  const resolvers = {
    Post: {
      user(post) {
        return post.getUser();
      },
    },

    Message: {
      user(message) {
        return message.getUser();
      },
      chat(message) {
        return message.getChat();
      },
    },

    Chat: {
      messages(chat) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat) {
        return chat.getUsers();
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

      chat(root, { chatId }) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },

      chats() {
        return User.findAll().then(users => {
          if (!users.length) {
            return [];
          }

          const usersRow = users[0];
          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: { where: { userId: usersRow.id } },
              },
              {
                model: Message,
              },
            ],
          });
        });
      },
    },

    RootMutation: {
      addPost(root, { post }) {
        logger.log({
          level: 'info',
          message: 'Post was created',
        });

        return User.findAll().then(users => {
          const usersRow = users[0];
          return Post.create({
            ...post,
          }).then(newPost => {
            return Promise.all([newPost.setUser(usersRow.id)]).then(() => {
              return newPost;
            });
          });
        });
      },
    },
  };

  return resolvers;
}
