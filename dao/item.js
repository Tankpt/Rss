var mongodb = require('./db'); 

function RssItem (rss) {
	this.title = rss.title;
	this.summary = rss.summary;
	this.link = rss.link;
	this.guid = rss.guid;
	this.published = rss.pubdate;
	this.updated = rss.date;
	this.author = rss.author;
	this.description = rss.description;
}

module.exports = RssItem;

RssItem.prototype.save = function(callback) {
		
	var rssitem = {
		title : this.title,
		guid : this.guid,
		link : this.link,
		published : this.published,
		updated : this.updated,
		summary : this.summary,
		author : this.author,
		description : this.description
	};	
	mongodb.open(function(err,db){
		if (err) {
	      return callback(err);//错误，返回 err 信息
	    }
	    //读取 users 集合
	    db.collection('rssitems', function (err, collection) {
	      if (err) {
	        mongodb.close();
	        return callback(err);//错误，返回 err 信息
	      }
	      //将用户数据插入 users 集合
	      collection.insert(rssitem, {
	        safe: true
	      }, function (err, user) {
	        mongodb.close();
	        if (err) {
	          return callback(err);//错误，返回 err 信息
	        }
	        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
	      });
	    });
	});
};

RssItem.prototype.get = function(authorName,callback) {

	mongodb.open(function(err,db){
		if (err) {
	      return callback(err);//错误，返回 err 信息
	    }
	    //读取 users 集合
	    db.collection('rssitems', function (err, collection) {
	      if (err) {
	        mongodb.close();
	        return callback(err);//错误，返回 err 信息
	      }
	      //将用户数据插入 users 集合
	      collection.findOne({
	        author: authorName
	      }, function (err, user) {
	        mongodb.close();
	        if (err) {
	          return callback(err);//失败！返回 err 信息
	        }
	        callback(null, user);//成功！返回查询的用户信息
	      });
	    });
	});
};