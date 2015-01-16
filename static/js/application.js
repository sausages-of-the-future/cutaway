var subscribe = new ReconnectingWebSocket("wss://"+ location.host + "/subscribe");

subscribe.onmessage = function(message) {

  var data = JSON.parse(message.data),
            origin_url = data['origin_url'],
            origin_app = data['application'],
            destination_url = data['destination_url'],
            destination_app = data['destination_app'],
            row = $('<div class="row"></div>')
            from = $('<p class="medium-6 column">' + origin_app + '<i class="fi-arrow-right"></i></p>'),
            to = $('<p class="medium-6 column">' + destination_app + '</p>'),

    from.addClass(origin_app);
    to.addClass(destination_app);
    row.append(from).append(to);
    $("#log").append(row);

};

subscribe.onclose = function(){
    console.log('subscribe closed');
    this.subscribe = new WebSocket(subscribe.url);
};
