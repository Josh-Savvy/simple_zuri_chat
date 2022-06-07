import { openDB, deleteDB } from "https://unpkg.com/idb?module";

var socket = io();

window.onload = async function () {
  /**Username and room varibles */
  document.getElementById("typemsg").focus();
  var username = document.getElementById("username").value;
  var room = document.getElementById("room").value;

  /*************
   ***********
  Initialize DB
   *******************************************************
   ************/

  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  var dbName = username + "_chat_db";
  var version = 1;

  var db = await openDB(dbName, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("myMessages", { autoIncrement: true });
      db.createObjectStore("otherMessages", { autoIncrement: true });
    },
  });

  /**Socket funcs*/

  socket.emit("join", { username, room });

  socket.on("adminMessage", (message) => {
    const div = document.createElement("div");
    div.classList.add(
      "adminText",
      "text-center",
      "break-words",
      "mx-4",
      "my-2",
      "p-2",
      "rounded-lg"
    );
    div.innerHTML = message;
    document.querySelector("#chat-wrapper").appendChild(div);
  });

  /**
   * Initiaze and save user data to localStorage
   */

  localStorage.setItem(
    "zuriUser",
    JSON.stringify({ username: username, room: room, exp: "" })
  );
  const user = JSON.parse(localStorage.getItem("zuriUser"));
  username = user.username;
  room = user.room;

  /**
   *
   * Check previous chats
   */

  const checkMyPrevMsgs = db
    .transaction("myMessages")
    .objectStore("myMessages")
    .getAll();

  if (checkMyPrevMsgs) {
    checkMyPrevMsgs.then((result) => {
      if (result[0].room && result[0].room === room) {
        result.map((message, i) => {
          const myMsgDiv = document.createElement("div");
          myMsgDiv.classList.add(
            "myMessage",
            "bg-blue-300",
            "break-words",
            "mx-4",
            "my-2",
            "py-5",
            "px-2",
            "rounded-lg",
            "relative"
          );
          myMsgDiv.innerHTML = ` 
          <span class="text-zinc-600 text-sm absolute left-2 top-1 mb-1">Me</span>
          ${message.message}
          <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${message.time}</span> 
          `;
          document.querySelector("#chat-wrapper").appendChild(myMsgDiv);
        });
      }
    });
  }

  const checkOtherPrevMsgs = db
    .transaction("otherMessages")
    .objectStore("otherMessages")
    .getAll();

  if (checkOtherPrevMsgs) {
    checkOtherPrevMsgs.then((result) => {
      if (result[0].room && result[0].room === room) {
        result.map((message, i) => {
          const otherMsgDiv = document.createElement("div");
          otherMsgDiv.classList.add(
            "otherMessage",
            "bg-zinc-300",
            "break-words",
            "mx-4",
            "my-2",
            "py-5",
            "px-2",
            "rounded-lg",
            "relative"
          );
          otherMsgDiv.innerHTML = `<span class="text-zinc-600 text-sm absolute left-2 top-1 mb-3">${message.user}</span>
                                 <span class="pt-10">${message.message} </span>
                                 <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${message.time}</span> 

  `;
          document.querySelector("#chat-wrapper").appendChild(otherMsgDiv);
        });
      }
    });
  }

  /*************
   ***********
   B_LOGIC
   *******************************************************
   ************/

  document.getElementById("sendBtn").addEventListener("click", () => {
    var msg = document.getElementById("typemsg");
    if (msg.value !== "") {
      const newMsgValue = msg.value.replace(/(<([^>]+)>)/gi, "🙂");
      socket.emit("myMessage", newMsgValue);
      msg.value = "";
      msg.focus();
      const box = document.getElementById("chat-wrapper");
      box.scrollTop += box.scrollHeight;
    }
  });

  socket.on("sendMyMessage", (message) => {
    const { msg } = message;
    myMessageOutput(db, msg);
  });
  socket.on("otherMessage", (message) => {
    const { username, msg } = message;
    otherMessageOutput(db, username, msg);
  });
};
