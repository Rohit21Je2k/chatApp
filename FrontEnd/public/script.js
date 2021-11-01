import chatRoom from "./views/chatRoom.js";
import newMessage from "./views/message.js";
import loading from "./views/loading.js";
import error from "./views/error.js";

const backEndDomain = "chatappweb-92e7e.herokuapp.com";
const roomForm = document.querySelector("#roomForm");

// handling room Form submit
roomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // form inputs
  const formDisplayName = event.target.displayName;
  const formRoomID = event.target.roomID;

  // form input values
  const name = formDisplayName.value;
  const roomID = formRoomID.value;

  // reseting form values
  formDisplayName.value = "";
  formRoomID.value = "";

  // handling form submitter
  const submitter = event.submitter.name;

  renderLoading();
  if (submitter === "createRoom") {
    createRoom(name);
  } else {
    joinRoom(name, roomID);
  }
});

function renderChatRoom(name, roomID) {
  const chatRoomHTML = chatRoom(name, roomID);
  const body = document.querySelector("body");
  body.innerHTML = chatRoomHTML;
}

function renderNewMessage(name, text, time, align) {
  const messageBox = document.querySelector(".messages");
  const newMessageString = newMessage(name, text, time, align);
  const div = document.createElement("div");
  div.innerHTML = newMessageString;
  messageBox.append(div);
}

function renderLoading() {
  const body = document.querySelector("body");
  body.innerHTML = loading();
  document.getElementsByName("homeButton")[0].onclick = () => {
    location.replace("./index.html");
  };
}

function renderError() {
  const errorHtml = error();
  const body = document.querySelector("body");
  const div = document.createElement("div");
  div.setAttribute("id", "error");
  div.innerHTML = errorHtml;
  body.append(div);
  document.getElementsByName("errorHome")[0].onclick = () => {
    location.replace("./index.html");
  };
  document.getElementsByName("errorClose")[0].onclick = () => {
    document.querySelector("#error").remove();
  };
}

// handling join Room
function joinRoom(name, roomID) {
  console.log("joinRoom");
  const socket = new WebSocket(`wss://${backEndDomain}/join/${roomID}`);

  socket.onopen = (event) => {
    renderChatRoom(name, roomID);
    handleNewMessageForm(name, socket);
    closeSocket(socket, roomID);
  };

  socket.onerror = (event) => {
    renderError();
  };

  socket.onmessage = (event) => {
    const { senderName, text, time } = JSON.parse(event.data);
    const align = senderName === name ? "right" : "left";
    renderNewMessage(senderName, text, time, align);
    const message = document.querySelector(".messages").lastChild;
    message.scrollIntoView(true);
  };

  socket.onclose = (event) => {
    console.log("Connection is closed");
  };
}

// handling create Room
function createRoom(name) {
  fetch(`https://${backEndDomain}/create`)
    .then((response) => response.json())
    .then((data) => {
      const roomID = data;
      joinRoom(name, roomID);
    });
}

function handleNewMessageForm(name, socket) {
  const newMessageForm = document.querySelector("#inputText");

  newMessageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formMessageText = event.target.inputMessage;

    const text = formMessageText.value;

    formMessageText.value = "";
    const time = getTimeAndDate();

    const data = {
      senderName: name,
      text,
      time,
    };
    socket.send(JSON.stringify(data));
  });
}

function closeSocket(socket, roomID) {
  const btn = document.querySelector("#exitRoom");
  btn.onclick = () => {
    let path = "/join/" + roomID;
    path = encodeURI(path);
    socket.close(1000, path);
    location.replace("./index.html");
  };
}

function getTimeAndDate() {
  const date = new Date().toLocaleDateString();
  const hours = new Date().getHours();
  const mins = new Date().getMinutes();

  const newTimeAndDate = hours + ":" + mins + " " + date;
  return newTimeAndDate;
}
