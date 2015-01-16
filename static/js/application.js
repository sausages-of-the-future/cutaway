// var subscribe = new ReconnectingWebSocket("wss://"+ location.host + "/subscribe");
// make connectin in index page for moment so we can have ws or wss
// connections made based on env variabl

var extractAppName = function(url){
    var appname = url.split('//')[1].split('.')[0]; // ouch
    if (appname.search('-gov') == -1){
        appname += '-gov'
    }
    return appname;
};

subscribe.onmessage = function(message) {

  var data = JSON.parse(message.data),
            origin_url = data['origin_url'],
            destination_url = data['destination_url'],
            origin_app = extractAppName(origin_url),
            destination_app = extractAppName(destination_url),
            row = $('<div class="row"></div>')
            from = $('<p class="medium-6 column">' + origin_app + '<i class="fi-arrow-right"></i></p>'),
            to = $('<p class="medium-6 column">' + destination_app + '</p>');

    from.addClass(origin_app);
    to.addClass(destination_app);
    row.append(from).append(to);
    $("#log").append(row);

};

subscribe.onclose = function(){
    console.log('subscribe closed');
    this.subscribe = new WebSocket(subscribe.url);
};
