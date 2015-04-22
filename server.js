// Require our dependencies
var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  twitter = require('twitter'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 3000;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect(config.db);

// Create a new ntwitter instance
var twit = new twitter(config.twitter);

// Index Route
app.get('/', routes.index);

// Page Route
app.get('/page/:page/:skip', routes.page);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

var words = "OPEN,HAPPY,ALIVE,GOOD,understanding,great,playful,calm,confident,gay,courageous,peaceful,reliable,joyous,energetic,at ease,easy,lucky,liberated,comfortable,amazed,fortunate,optimistic,pleased,free,delighted,provocative,encouraged,sympathetic,overjoyed,impulsive,clever,interested,gleeful,free,surprised,satisfied,thankful,frisky,content,receptive,important,animated,quiet,accepting,festive,spirited,certain,kind,ecstatic,thrilled,relaxed,satisfied,wonderful,serene,glad,free and easy,cheerful,bright,sunny,blessed,merry,reassured,elated,jubilant,LOVE,INTERESTED,POSITIVE,STRONG,loving,concerned,eager,impulsive,considerate,affected,keen,free,affectionate,fascinated,earnest,sure,sensitive,intrigued,intent,certain,tender,absorbed,anxious,rebellious,devoted,inquisitive,inspired,unique,attracted,nosy,determined,dynamic,passionate,snoopy,excited,tenacious,admiration,engrossed,enthusiastic,hardy,warm,curious,bold,secure,touched,brave,sympathy,daring,close,challenged,loved,optimistic,comforted,re-enforced,confident,hopeful,ANGRY,DEPRESSED,CONFUSED,HELPLESS,irritated,lousy,upset,incapable,enraged,disappointed,doubtful,alone,hostile,discouraged,uncertain,paralyzed,insulting,ashamed,indecisive,fatigued,sore,powerless,perplexed,useless,annoyed,diminished,embarrassed,inferior,upset,guilty,hesitant,vulnerable,hateful,dissatisfied,shy,empty,unpleasant,miserable,stupefied,forced,offensive,detestable,disillusioned,hesitant,bitter,repugnant,unbelieving,despair,aggressive,despicable,skeptical,frustrated,resentful,disgusting,distrustful,distressed,inflamed,abominable,misgiving,woeful,provoked,terrible,lost,pathetic,incensed,in despair,unsure,tragic,infuriated,sulky,uneasy,cross,bad,pessimistic,dominated,worked up,a sense of loss,tense,boiling,fuming,indignant,INDIFFERENT,AFRAID,HURT,SAD,insensitive,fearful,crushed,tearful,dull,terrified,tormented,sorrowful,nonchalant,suspicious,deprived,pained,neutral,anxious,pained,grief,reserved,alarmed,tortured,anguish,weary,panic,dejected,desolate,bored,nervous,rejected,desperate,preoccupied,scared,injured,pessimistic,cold,worried,offended,unhappy,disinterested,frightened,afflicted,lonely,lifeless,timid,aching,grieved,shaky,victimized,mournful,restless,heartbroken,dismayed,doubtful,agonized,threatened,appalled,cowardly,humiliated,quaking,wronged,menaced,alienated,wary";
// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter',{ 'track': words }, function(stream){
  streamHandler(stream,io);
});