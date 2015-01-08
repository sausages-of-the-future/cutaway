var subscribe = new ReconnectingWebSocket("ws://"+ location.host + "/subscribe");

subscribe.onmessage = function(message) {

  var data = JSON.parse(message.data);

  $("#location-text").append('<p> request from: ' + data.application + ' for service: ' + data.text + '</p>' );

};

subscribe.onclose = function(){
    console.log('subscribe closed');
    this.subscribe = new WebSocket(subscribe.url);

};
