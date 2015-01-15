var subscribe = new ReconnectingWebSocket("ws://"+ location.host + "/subscribe");

subscribe.onmessage = function(message) {

  var data = JSON.parse(message.data);

  // Do whatever with the data to update the page
  $("#location-text").append('<p> from: ' + data.application + ' to : ' + data.message + '</p>' );

};

subscribe.onclose = function(){
    console.log('subscribe closed');
    this.subscribe = new WebSocket(subscribe.url);

};
