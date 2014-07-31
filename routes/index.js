var RssItem = require('../dao/rssItem.js'),
	Rss = require('../dao/rss.js'),
	User = require('../dao/user.js');

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}

module.exports = function(app) {

	app.get('/', function(req, res){

		RssItem.prototype.get('阮一峰',function(err,rss){
			if(rss){
				console.log("rss");
				
			}else{
				console.log("not exits");
			}
			res.render('index', { 
				title: 'Hello Rss page' ,
				user: req.session.user,
				rss: rss,
				success: req.flash('success').toString(),
  				error: req.flash('error').toString()
			});
		});
	});

/*********************reg start***************************/
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res){
	  	res.render('reg', { 
	  		title: 'register page' ,
	  		user: req.session.user,
	  		success: req.flash('success').toString(),
      		error: req.flash('error').toString()
	  	});
	});
	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) {
	    var name = req.body.name,
	        password = req.body.password,
	        password_re = req.body['password-repeat'];
	    if (password_re != password) {
	      req.flash('error', '两次输入的密码不一致!'); 
	      return res.redirect('/reg');
	    }
	   
	    var newUser = new User({
	        name: name,
	        password: password,
	        email: req.body.email
	    });
	    newUser.get(newUser.name, function (err, user) {
	      if (user) {
	        req.flash('error', '用户已存在!');
	        return res.redirect('/reg');
	      }
	      newUser.save(function (err, user) {
	        if (err) {
	          req.flash('error', err);
	          return res.redirect('/reg');
	        }
	        req.session.user = user;
	        req.flash('success', '注册成功!');
	        res.redirect('/');
	      });
	    });
	});


/*********************login start***************************/
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res){
	  	res.render('login', { 
	  		title: 'login page' ,
	  		user: req.session.user,
	  		success: req.flash('success').toString(),
      		error: req.flash('error').toString() 
	  	});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function (req, res) {
	   	var name = req.body.name,
	        password = req.body.password;

	    User.prototype.get(name,function(err,user){
	    	if(user && user.password === password){
	    		req.session.user = user;
	    		req.flash('success', 'login成功!');
	    		res.redirect('/');
	    	}else{
	    		req.session.user = null;
	    		req.flash('error', 'login faild!');
	    		res.redirect('/login');
	    	}
	    });
	});


/*********************logout start***************************/
	app.get('/logout', checkLogin);
	app.get('/logout', function (req, res) {
	  req.session.user = null;
	  req.flash('success', '登出成功!');
	  res.redirect('/');//登出成功后跳转到主页
	});

/*********************addRss start***************************/
	app.get('/addRss', checkLogin);
	app.get('/addRss', function (req, res) {
	  	res.render('addRss', { 
			title: 'addRss page' ,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/addRss', checkLogin);
	app.post('/addRss', function (req, res) {
		var rssUrl = req.body.rssUrl;
		var newRss = new Rss({
			userId : req.session.user._id,
			rssUrl : rssUrl,
			rssName : ''
		});
		Rss.prototype.get(rssUrl,function(err,rss){
			if (rss) {
				req.flash('error', 'rss已经存在!');
	        	return res.redirect('/addRss');
			}
			newRss.save(function(err,rss){
				 if (err) {
		          req.flash('error', err);
		          return res.redirect('/reg');
		        }
		        req.flash('success', '添加成功!请稍后查看');
		       	res.redirect('/addRss');
			});
		});
	});


};