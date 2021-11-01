export default function chatRoom(name, roomID) {
  return `<div id="chatRoom">
    <header>
      <h2>Your Name: ${name}</h2>
      <div>
      <h2>Room ID: ${roomID}</h2>
      <button id="exitRoom">Exit Room</button>
      </div> 
    </header>
    <div class="messages">
    </div>
    <form id="inputText">
      <input
        type="text"
        name="inputMessage"
        placeholder="type your message"
        required
      />
      <button type="submit">➡</button>
    </form>
  </div>
  `;
}
