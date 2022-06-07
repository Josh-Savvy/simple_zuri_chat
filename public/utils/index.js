console.log("UTils loaded");

var socket = io();

var currentDate = new Date().toLocaleString([], {
  hour: "2-digit",
  minute: "2-digit",
});

window.onload = async function () {
  /**Username and room varibles */
  document.getElementById("typemsg").focus();
  var username = document.getElementById("username").value;
  console.log(username);
  var room = document.getElementById("room").value;

  /***
   * ************************************F
   */

  /**Socket funcs*/

  socket.emit("join", { username, room });

  socket.on("roomUsers", ({ room, users }) => {
    const userList = document.getElementById("roomUsers");
    userList.innerHTML = users.length;
  });

  socket.on("adminMessage", (message) => {
    const div = document.createElement("div");
    div.classList.add(
      "adminText",
      "justify-center",
      "flex",
      "grid",
      "text-center",
      "break-words",
      "mx-4",
      "my-2",
      "p-2",
      "rounded-lg"
    );
    div.innerHTML = `<span class="font-semibold">${message}</span> `;
    document.querySelector("#chat-wrapper").appendChild(div);
  });

  /**
   * *****************************************
   */

  window.localStorage.setItem(
    "zuriUser",
    JSON.stringify({ username: username, room: room, exp: "" })
  );

  const user = JSON.parse(window.localStorage.getItem("zuriUser"));
  username = user.username;
  room = user.room;
  /**
   *
   *
   * *****************************************
   *
   */

  document.getElementById("sendBtn").addEventListener("click", () => {
    var msg = document.getElementById("typemsg");
    if (msg.value !== "") {
      const newMsgValue = msg.value.replace(/(<([^>]+)>)/gi, "🙂");
      addMessageToDb("Me", newMsgValue);
      socket.emit("myMessage", newMsgValue);
      msg.value = "";
      msg.focus();
      const box = document.body;
      box.scrollTop = box.scrollHeight;
    }
  });

  socket.on("sendMyMessage", (message) => {
    const { msg } = message;
    myMessageOutput(currentDate, msg);
  });
  socket.on("otherMessage", (message) => {
    const { username, msg } = message;
    addMessageToDb(username, msg);
    otherMessageOutput(username, currentDate, msg);
  });
};
