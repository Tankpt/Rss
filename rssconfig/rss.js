var request = require('request')  
    , FeedParser = require('feedparser')  
    , rssSite = require('./rssSite.json')  
    , Iconv = require('iconv').Iconv;

var RssItem = require('../models/site.js');

var channels = rssSite.channel; 

/*channels.forEach(function(e,i){  
    if(e.work != false){  
        console.log("begin:"+ e.title); 
        _link = e.link;
        //fetch(e.link,e.typeId);  
    }  
});  */

var req = request("http://www.ruanyifeng.com/blog/atom.xml"), 
	  feedparser = new FeedParser();

req.on('error', function (error) {
  console.log("request on error");
});

req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});

var keep = [];
feedparser.on('error', function(error) {
 console.log("feed onerror");
});

feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this
    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    , item,
    i=0;	
  
  while (item = stream.read()) {
   keep.push(item);
  }
});

feedparser.on('end', function() {
  var _tmp = keep[0];
  var newRss = new RssItem(_tmp);
      newRss.save(function (err) {
          console.log(err);
      });
      console.log ("finish");
  });