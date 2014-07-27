var RssItem = require('../models/site.js');



/*
 * GET home page.
 */

exports.index = function(req, res){
	RssItem.prototype.get('阮一峰',function(err,rss){
		if(rss){
			console.log("rss");
			res.render('index', { title: 'Express' ,rss: rss});
			
		}else{
			console.log("not exits");
			res.render('index', { title: 'Express' });
		}
	});
  //res.render('index', { title: 'Express' });
};