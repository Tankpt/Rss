Rss
===

开始接触了下node，准备做一个类似订阅rss信息的小东西，现在可以想到的功能
1. 对于前端的展示，用backbone来搭建下，顺便尝试下backbone的hash的功能(估计要废除＝＝规模有点小)
2. 大致的功能：页面一开始左侧列着自己所订阅的项目，点击具体的一个就会在右侧显示出该项目下所受到的订阅信息，然后再继续点击具体的一个item，则显示抓取的rss具体条目信息
3. 后台需要好好设计下数据库，因为采用了mongodb，顺便学下非关系型数据库的东西
4. 用node来搭建这个网站，看了之前的blog还是需要实践下

--------------------------分割线--------------------------

2014.8.19 beat3
说明：样式修改了一部分＝＝暂时稍微还是可以看了点

现在实现的功能：
1. rss添加之后可以删除

待完成：
1. 需要处理下有些RSS源解析出来的结果不怎么好的问题
2. 解决下异步的逻辑


后续功能：要是可以的话。想试着做成一个可以推送到kindle的东西，应该会添加一个发送邮件的功能

--------------------------分割线--------------------------

2014.8.1 beat2
说明：终于后台部分完成一些了，前端的样式都还没修改

现在实现的功能：
1.用户注册登陆
2.已登陆的用户可以进行rss的添加
3.用户可以在首页看到自己添加的rss源的链接列表；能看到自己订阅rss源第一个的前２０条的订阅信息

待完成：
1.界面优化
2.用户可以选择制定的rss源进行阅读

后续功能：优化下后台异步的逻辑。不好管理

---------------------------------------------------------
2014.7.27 beat1
说明：这算是一个尝试的版本，大概尝试了后台抓取数据然后写到数据库中，前面再用express来展示这些数据，但是整体结构是乱的不成样子，特此mark

