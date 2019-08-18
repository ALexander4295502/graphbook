/* eslint-disable func-names */
/* eslint-disable strict */
/* eslint-disable lines-around-directive */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      text: DataTypes.TEXT,
    },
    {},
  );
  Post.associate = function() {
    // associations can be defined here
  };
  return Post;
};
