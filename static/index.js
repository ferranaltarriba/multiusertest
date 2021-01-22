function load() {
  alert("evento load detectado!");
}
window.onload = load;

(function() {
  const sendBtn = document.querySelector('#send');
  const messages = document.querySelector('#messages');
  const messageBox = document.querySelector('#messageBox');

  let ws;

  function showMessage(message) {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
  }

  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    HOST = location.origin.replace(/^http/, 'ws')
	ws = new WebSocket(HOST);
    ws.onopen = () => {
      console.log('Connection opened!');
    }
    ws.onmessage = ({ data }) => showMessage(data);
    ws.onclose = function() {
      ws = null;
    }
  }

  sendBtn.onclick = function() {
    if (!ws) {
      showMessage("No WebSocket connection :(");
      return ;
    }

    ws.send(messageBox.value);
    showMessage(messageBox.value);
  }

  init();
})();