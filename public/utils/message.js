var room = document.getElementById("room");

function myMessageOutput(timestamp, message) {
  const myMsgDiv = document.createElement("div");
  myMsgDiv.classList.add(
    "myMessage",
    "bg-blue-300",
    "break-words",
    "mx-4",
    "my-2",
    "py-4",
    "px-2",
    "rounded-lg",
    "relative"
  );
  myMsgDiv.innerHTML = ` 
  <span class="text-zinc-600 text-sm absolute left-2 top-1 mb-1">Me</span>
  ${message}
  <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${timestamp}</span> 
  `;
  document.querySelector("#chat-wrapper").appendChild(myMsgDiv);
}

function otherMessageOutput(username, timestamp, otherMessage) {
  const otherMsgDiv = document.createElement("div");
  otherMsgDiv.classList.add(
    "otherMessage",
    "bg-zinc-300",
    "break-words",
    "mx-4",
    "my-2",
    "py-4",
    "px-2",
    "rounded-lg",
    "relative"
  );
  otherMsgDiv.innerHTML = `
  <span class="text-zinc-600 text-sm absolute left-2 top-1 mb-1">${username}</span>
  
  ${otherMessage} 
  <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${timestamp}</span> 

  `;
  document.querySelector("#chat-wrapper").appendChild(otherMsgDiv);
}
