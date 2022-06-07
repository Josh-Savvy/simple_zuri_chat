if (window.localStorage.getItem("zuriUser")) {
  const user = JSON.parse(window.localStorage.getItem("zuriUser"));
  if (user.username && user.room) {
    document.getElementById("username").value = user.username;
    document.getElementById("room").value = user.room;
    document.getElementById("password").value = "************";

    document.getElementById("login_btn").click();
  }
}
