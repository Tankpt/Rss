var mongodb = require('./db'); 

function Rss (rss) {
	this.userName  = rss.userName;
	this.rssUrl = rss.rssUrl;
	this.rssName = rss.rssName;
}

module.exports = Rss;

Rss.prototype.save = function(callback) {
		
	var rssInfo = {
		userName : this.userName,
		rssUrl : this.rssUrl,
		rssName : this.rssName
	};	
	mongodb.open(function(err,db){
		if (err) {
	      return callback(err);//错误，返回 err 信息
	    }
	    //读取 rssTable 集合
	    db.collection('rssTable', function (err, collection) {
	      if (err) {
	        mongodb.close();
	        return callback(err);//错误，返回 err 信息
	      }
	      //将用户数据插入 rssTable 集合
	      collection.insert(rssInfo, {
	        safe: true
	      }, function (err, rss) {
	        mongodb.close();
	        if (err) {
	          return callback(err);//错误，返回 err 信息
	        }
	        callback(null, rss[0]);//成功！err 为 null，并返回存储后的用户文档
	      });
	    });
	});
};

Rss.prototype.get = function(_query,callback) {

	mongodb.open(function(err,db){
		if (err) {
	      return callback(err);//错误，返回 err 信息
	    }
	    //读取 rssTable 集合
	    db.collection('rssTable', function (err, collection) {
	      	if (err) {
		        mongodb.close();
		        return callback(err);//错误，返回 err 信息
		    }
		    
	      	collection.find(_query).sort({
	      		userName:-1
	      	}).toArray(function (err, rsses) {
	        	mongodb.close();
	        	if (err) {
	          	return callback(err);//失败！返回 err 信息
	        	}
	        	callback(null, rsses);//成功！返回查询的用户信息
	      	});
	    });
	});
};