export default function newMessage(name, text, time, align) {
  return `<div class="message ${align}">
    <span class="profileLetter"><h5>${name[0]}</h5></span>
    <div class="text">
      <sup>By ${name}</sup><br />
      <p>${text}</p>
      <br />
      <sub>${time}</sub>
    </div>
  </div>
  `;
}
