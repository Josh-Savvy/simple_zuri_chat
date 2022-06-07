let db = new Localbase("db");

var dbCollection = "chat-messages";
var currentDate = new Date().toLocaleString([], {
  hour: "2-digit",
  minute: "2-digit",
});

function addMessageToDb(user, message) {
  db.collection(dbCollection).add({
    id: user === "Me" ? 1 : 2,
    user: user,
    message: message,
    timestamp: currentDate,
  });
}

function getAllMessages() {
  db.collection(dbCollection).get();
}

function deleteAllMessages() {
  //
}

window.addEventListener("DOMContentLoaded", () => {
  if (getAllMessages) {
    db.collection(dbCollection)
      .orderBy("timestamp")
      .get()
      .then((result) => {
        result.map((msg, i) =>
          msg.id === 1
            ? myMessageOutput(msg.timestamp, msg.message)
            : otherMessageOutput(msg.user, msg.timestamp, msg.message)
        );
      });
  }
});
