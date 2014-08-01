var request = require('request'),
    FeedParser = require('feedparser'),
    rssDefaultUrl = require('./rssSite.json'),  
    Iconv = require('iconv').Iconv;

var RssItem = require('../../dao/rssItem.js'),
    Rss = require('../../dao/rss.js');


var storeRssItemFunc = function(rssDateArray){
    RssItem.prototype.save(rssDateArray,function(err){
      if(err){
        console.log(err);
      }
    });
};

var updateRssItemFunc = function(rssUrl,rssDateArray){
   //检测该rssUrl是否已经获取过信息
    RssItem.prototype.get({
      rssUrl : rssUrl
    },function(err,_rssItemsArray){
      if(_rssItemsArray.length!=0){
        //已经存在，则需要对其原有数据进行清空
        RssItem.prototype.remove({
          rssUrl : rssUrl
        },function(err,removedItem){
          if(err){
            console.log(err);
          }else{
            storeRssItemFunc(rssDateArray);
          }
        });
      }else{
        storeRssItemFunc(rssDateArray);
      }
    });
};

module.exports = function( rssUrl,userName){

  var req = request(rssUrl || 'http://www.ruanyifeng.com/blog/atom.xml'), 
      feedparser = new FeedParser(),
      dataTmpArray = [],
      rssDateArray = [];

  req.on('error', function (error) {
    console.log("request on error");
  });

  req.on('response', function (res) {
    var stream = this;
    if (res.statusCode != 200) 
      return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    console.log("feed onerror");
  });

  feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this,
        meta = this.meta,// **NOTE** the "meta" is always available in the context of the feedparser instance
        item,
        i=0;  
    
    while (item = stream.read()) {
      dataTmpArray.push(item);
    }
  });

  feedparser.on('end', function() {
    var _tmp = dataTmpArray[0].meta;
    
    console.log("begin the store");
    //console.log(dataTmpArray[0].meta);
    if(dataTmpArray.length!=0){
      var _meta = dataTmpArray[0].meta,
          _rssDate = _meta.date,
          _rssDateName = _meta.title;

      dataTmpArray.forEach(function(_item,_index){
        rssDateArray.push({
          rssUrl : rssUrl,
          title : _item.title,
          guid : _item.guid,
          link : _item.link,
          published : _item.pubdate,
          updated : _item.date,
          summary : _item.summary,
          author : _item.author,
          description : _item.description
        });
      });

      Rss.prototype.get({
        rssUrl : rssUrl,
        userName : userName
      },function(err,rsses){
        if(!!rsses[0] && !rsses[0].rssName){
          Rss.prototype.update({
            rssUrl : rssUrl,
            userName : rsses[0].userName
          },{
            rssName : _rssDateName,
            update : _rssDate
          },function(err,rsses){
            if(err){
              console.log(err);
            }
            updateRssItemFunc(rssUrl,rssDateArray);
          });
        }else{
          updateRssItemFunc(rssUrl,rssDateArray);
        }
      });
      console.log ("finish store the rss");
    }else{
      console.log("date is empty");
    }
    
  });
};