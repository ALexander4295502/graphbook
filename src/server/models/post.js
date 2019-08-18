/* eslint-disable func-names */
/* eslint-disable strict */
/* eslint-disable lines-around-directive */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Post.associate = function(models) {
    Post.belongTo(models.User);
  };
  return Post;
};
