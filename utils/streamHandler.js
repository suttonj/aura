var Tweet = require('../models/Tweet');
var unirest = require('unirest');

module.exports = function(stream, io){

  // When tweets get sent our way ...
  stream.on('data', function(data) {
    
    if (data.coordinates) {
      if (data.coordinates !== null){
        //If so then build up some nice json and send out to web sockets
        var outputPoint = { "lat": data.coordinates.coordinates[0], "long": data.coordinates.coordinates[1] };
        console.log(outputPoint);
        // Construct a new tweet object
        // These code snippets use an open-source library. http://unirest.io/nodejs
        unirest.get("https://loudelement-free-natural-language-processing-service.p.mashape.com/nlp-text/?text=" + data['text'])
          .header("X-Mashape-Key", "OrmnYgOBOnmsh45u5sJZ3yHJlg8ip1VFbcdjsnofKvhgivLlTm")
          .header("Accept", "application/json")
          .end(function (result) {
            console.log(result.status, result.headers, result.body);
            if (result.status != 200)
              return;
            var tweet = {
              twid: data['id'],
              active: false,
              author: data['user']['name'],
              avatar: data['user']['profile_image_url'],
              body: data['text'],
              date: data['created_at'],
              screenname: data['user']['screen_name'],
              lat: data.coordinates.coordinates[0],
              long: data.coordinates.coordinates[1],
              sentiment: result['sentiment-text'],
              score: result['sentiment-score']
            };
        
            // Create a new model instance with our object
            var tweetEntry = new Tweet(tweet);
        
            // Save 'er to the database
            tweetEntry.save(function(err) {
              if (!err) {
                // If everything is cool, socket.io emits the tweet.
                io.emit('tweet', tweet);
              }
            });
          
            //io.broadcast.emit("twitter-stream", outputPoint);
    
            //Send out to web sockets channel.
            io.emit('twitter-stream', outputPoint);
          });

        
      }
    }
  });

};