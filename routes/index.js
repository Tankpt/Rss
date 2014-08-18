var RssItem = require('../dao/rssItem.js'),
	Rss = require('../dao/rss.js'),
	User = require('../dao/user.js'),
	rssSearch = require('../modules/rss/rssSearch.js'),
    ObjectID = require('mongodb').ObjectID;

var PAGESIZE = 5;

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

	app.get('/', checkLogin);
	app.get('/', function(req, res){

		var _query={},
			_rsses,
			_rssItems;
		//get user relation rssurl
		if(req.session.user){
			_query.userName = req.session.user.name;

			Rss.prototype.get(_query,function(err,rsses){
				_rsses = rsses;
				if(_rsses.length>0){
                    var _tmpUrl = req.query.url || rsses[0].rssUrl;
					RssItem.prototype.get({
						rssUrl : _tmpUrl
					},function(err,rssItems){
                        var _pageInfo = {};
						if(rssItems.length!=0){
							_rssItems = rssItems;
                            _pageInfo ={
                                psize : Math.ceil(rssItems.length/PAGESIZE),
                                p : req.query.p || 1 ,
                                url : _tmpUrl
                            };
                            _rssItems = _rssItems.slice((_pageInfo.p-1)*PAGESIZE,_pageInfo.p*PAGESIZE);
						}else{
							console.log("not exits");
						}

						res.render('index', { 
							title: 'Hello Rss page' ,
							user: req.session.user,
							rsses: _rsses,
                            pagePation : _pageInfo,
							rssItems : _rssItems,
							success: req.flash('success').toString(),
							error: req.flash('error').toString()
						});
					});
				}else{
					res.render('index', { 
						title: 'Hello Rss page' ,
						user: req.session.user,
						rsses: '',
						rssItems : '',
						success: req.flash('success').toString(),
						error: req.flash('error').toString()
					});
				}
				
			});
		}	
		
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
			userName : req.session.user.name,
			rssUrl : rssUrl,
			rssName : '',
			update : ''
		});
		var _query = {
			userName : newRss.userName,
			rssUrl : rssUrl
		};
		Rss.prototype.get(_query,function(err,rsses){
			if (rsses.length!=0) {
				req.flash('error', 'rss已经存在!');
	        	return res.redirect('/addRss');
			}
			newRss.save(function(err,rss){
				 if (err) {
		          req.flash('error', err);
		          return res.redirect('/reg');
		        }
		        rssSearch(rssUrl,req.session.user.name);
		        req.flash('success', '添加成功!请稍后查看');
		       	res.redirect('/addRss');
			});
		});
	});

/*********************artcle start***************************/
    app.get('/article', checkLogin);
    app.get('/article', function(req, res){

        if(req.session.user){
            var _aid =  req.query.aid;
            if(!!_aid){
                RssItem.prototype.get({
                    _id :  new ObjectID(_aid)
                },function(err,rssItems){
                    var _rssItem ;
                    if(rssItems.length!=0){
                        _rssItem = rssItems[0];
                    }else{
                        console.log("not exits");
                    }

                    res.render('article', {
                        title: 'Hello article page' ,
                        user: req.session.user,
                        rssItem : _rssItem,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                });
            }else{
                res.render('article', {
                    title: 'Hello Rss page' ,
                    user: req.session.user,
                    rssItem : "",
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            }
        }
    });

};