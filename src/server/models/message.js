'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'cascade',
      },
      chatId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Chats',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    {},
  );
  Message.associate = function(models) {
    Message.belongsTo(models.User);
    Message.belongsTo(models.Chat);
  };
  return Message;
};
