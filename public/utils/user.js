const moment = require("moment");

const users = [];

exports.formatMessage = (username, text) => {
  return {
    username,
    text: String(text),
    time: moment().format("h:mma"),
  };
};

exports.userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};
exports.getCurrentUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};
