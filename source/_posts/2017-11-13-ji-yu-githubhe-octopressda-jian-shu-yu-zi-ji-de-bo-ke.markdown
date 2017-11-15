---
layout: post
title: "基于Github和Octopress搭建属于自己的博客"
date: 2017-11-13 17:53:39 +0800
comments: true
tags: [Github, Octopress]
description: "我的第一篇Octopress博客"
categories: Octopress
---
#前言
首先感谢[程哥](http://msching.github.io/)的支持，我大致也是看到他的博客才萌生搭Blog的想法，再则希望通过技术博客的书写能理清技术的始末，为每个课题形成一个技术闭环，刚毕业技术积累不是很成熟，不部分时间都是在利用为知笔记、有道笔记的工具来记录工作中所积累的知识，对此我也进行了一些尝试，但最终因为国内的一些博客站点糟糕的排版、设计、代码高亮等等各种原因而放弃了。本着开源分享的心态我想把几年的心得与技术积累已文字的形式展示出来，经过一番Google之后我发现现在的程序猿们都偏向于[Octopress](http://octopress.org/)这个开源的框架加上[Github Pages](https://pages.github.com/)服务来搭建Blog，看上非常的高大上，排版、代码高亮都做得非常棒，以[Markdown](http://zh.wikipedia.org/zh/Markdown)，主要是[Mou](http://25.io/mou/)作者不再更新软件了

<!--more-->


#安装Octopress
[这里](http://octopress.org/docs/setup/)是Octopress的官方指南，各位可以按照其中的步骤进行安装，下面的文字只是记录了我个人的安装过程，可以为大家提供一些参考

由于Octopress的使用需要Ruby，于是搭环境就这条路上的第一只拦路虎。Ruby版本繁多并且版本之间向下兼容做的不好，所以基于Ruby所做的框架大多要求特定版本的Ruby才能正常运行

Octopress最低要求的是Ruby1.9.3（最低，已经不需要去强制去下载1.9.3），MacOSX自带的Ruby版本是2.x的，其实用现阶段的Ruby就ok了。Octopress的官方指南推荐使用的是RVM和rbenv，可以根据需要选择使用需要的工具

###安装rbenv

我最近才第一次安装octopress（我的是OSX 10.12.5）的过程中我首先使用了RVM，但碰到了一些莫名的问题无法解决，最后还是使用了rbenv

这里我使用[Homebrew](http://brew.sh/)来安装rbenv，如果你没有Homebrew，打开终端，使用以下命令安装吧

```Javascript
$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

有了Homebrew就可以安装rbenv了

```Javascript
$ brew update
$ brew install rbenv
$ brew install ruby-build
```

###用rbenv安装Ruby
如果想尝试安装与管理其他版本的Ruby，可是使用如下的方式进行管理与切换：

```javascript
$ rbenv install --list     # 列出所有 ruby 版本
$ rbenv install 2.0.0-p247 # 安装需要的ruby版本
$ rbenv versions           # 所有已安装的ruby版本
$ rbenv global 1.8.7-p352  # 设置全局ruby版本
$ rbenv local 1.9.7        # 设置当前文件夹ruby版本
$ rbenv rehash
$ rbenv uninstall 2.00     #卸载指定ruby版本
```

###安装RVM

在第二次安装octopress（OSX 10.11时代）的过程中依照之前的经验使用rbenv，但却怎么也安不上需要的ruby版本，最后换回了RVM

安装octopress官方提供的安装方法

```
$ curl -L https://get.rvm.io | bash -s stable --ruby
```

###用RVM安装Ruby
同上如果使用rvm安装ruby，我依照之前的经验安装1.9.3-p125的版本，但在编译时出现了一些错误，继而尝试了评论中[@lance_lan]()提到得1.9.3-p551版本才安装成功

```
$ rvm install ruby-1.9.3-p551 --with-gcc=clang
$ rvm use 1.9.3-p551
$ rvm rubygems latest
$ ruby --version #ruby 1.9.3p551 (2014-11-13 revision 48407)
```

###安装Octopress
安装Ruby完成后就按照官方指南安装Octpress

```java
#clone octopress
$ git clone git://github.com/imathis/octopress.git octopress
$ cd octopress

#安装依赖
$ gem install bundler
$ rbenv rehash  # 如果你刚才用了rbenv
$ bundle install

#安装octopress默认主题
$ rake install
```

#部署
接下来需要把Blog部署到github上去，第一步要做的是去[github](https://github.com/new)创建一个`username.github.io`的repo，比如我的就叫`huakucha.github.io`

然后运行以下命令，并依照提示完成github和Octopress的关联，关联的是你工程的全路径

```java
$ rake setup_github_pages
```

#创建博客

###生成博客
```java
$ rake generate
$ rake deploy
```

把生成后的代码上传到github

```
$ git add .
$ git commit -m 'create blog'
$ git push origin source
```
完成后等待一段时间后就能访问`http://username.github.io`看到自己的博客了


###修改配置
配置文件路径为`~/octopress/_config.yml`，这个文件其实就是octopress的配置文件，里面内置了一些现有的模块，你也可以新增全局的配置属性

```java
url:                # For rewriting urls for RSS, etc
title:              # Used in the header and title tags
subtitle:           # A description used in the header
author:             # Your name, for RSS, Copyright, Metadata
simple_search:      # Search engine for simple site search
description:        # A default meta description for your site
date_format:        # Format dates using Ruby's date strftime syntax
subscribe_rss:      # Url for your blog's feed, defauts to /atom.xml
subscribe_email:    # Url to subscribe by email (service required)
category_feeds:     # Enable per category RSS feeds (defaults to false in 2.1)
email:              # Email address for the RSS feed if you want it.
```
编辑完成后

```
$ rake generate

$ git add .
$ git commit -m "settings" 
$ git push origin source

$ rake deploy
```

###安装第三方主题
Octopress有许多第三方主题可以选择，首先在[这里Github](https://github.com/imathis/octopress/wiki/3rd-Party-Octopress-Themes)上寻找喜欢的主题，点击进入对应主题的git，一般在readme上都会有安装流程，我使用的是`classic-martinb`

```
$ cd octopress
$ git submodule add git://github.com/martinbjeldbak/classic-martinb.git .themes/classic-martinb
$ rake install['classic-martinb']
$ rake generate

$ git add .
$ git commit -m "theme" 
$ git push origin source

$ rake deploy
```

###定制第三方主题

使用第三方主题也并非是一个“拎包入住”的过程，其中必然会有一些需要定制的地方。定制的过程中会涉及一些web相关的知识，但对于各位来说应该都并非难事。

例如刚安装完greyshade之后我们会发现左边navigation上的**About me**是指向作者的个人主页，我们需要把这个文字连接定向到自己的个人主页上。

这个aboutme对应的html为`/source/_includes/custom/navigation.html`

``` 
<li><a href="{{ root_url }}/">Blog</a></li>
<li><a href="http://about.me/shashankmehta">About</a></li>
<li><a href="{{ root_url }}/blog/archives">Archives</a></li>
```
把其中的`http://about.me/shashankmehta`替换成需要的url，替换完之后

```
$ rake generate

$ git add .
$ git commit -m "theme" 
$ git push origin source

$ rake deploy
```

###支持中文标签
目前版本的Octopress会在`/source/blog/categories`下创建一个`index.markdown`来作为分类的首页，但这个首页在标签有中文时会出现无法跳转的情况，原因是因为在出现中文标签时Octopress会把文件的路径中的中文转换成拼音，而在Category跳转时是直接写了中文路径，结果自然是404。解决方法是自己实现一个分类首页并处理中文。

首先按照[这里](https://kaworu.ch/blog/2013/09/23/categories-page-with-octopress/)的方法实现`index.html`

将`plugins/category_list_tag.rb`中的

```
category_url = File.join(category_dir, category.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase)
```

替换成

```
category_url = File.join(category_dir, category.to_url.downcase)
```
这样你的博客就可以支持中文标签的跳转了。

---------

#写博客

经过上面几部后，博客已经成功搭建，现在就可以开始写博文了。

###创建博文
```
#如果用的是终端
$ rake new_post['title']

#如果用的是ZSH
$ rake "new_post[title]"
#或者
$ rake new_post\['title'\]
```
生成的文件在`~/source/_posts`目录下


###编辑博文

```java
#markdown写博文

$ rake preview #localhost:4000

$ rake generate

$ git add .
$ git commit -m "comment" 
$ git push origin source

$ rake deploy
```

#后记：解决Octopress博客访问慢的问题
由于国内环境的原因造成了访问博客速度“惊人”，所以对Octopress进行相关改造成了必须的步骤（如果你能接受手机端打开时间超过20秒），好了废话不多讲
##清理没用的服务
修改`_config.yml`，由于`Octopress`预设了一些像`Disqus`评论、`Github`仓库、`Twitter`等访问较慢的一些网站，这个相关服务在国内访问相对较慢，这里你只要把这些不需要的服务注释掉就好了

###去除Disqus评论
```java
1 #Disqus Comments
2 #disqus_short_name: androidyue
3 #disqus_show_comment_count: true
```
###去掉Github仓库展示
```java
#Github repositories
#github_user: androidyue
#github_repo_count: 11
#github_show_profile_link: true
#github_skip_forks: true
```
###Twitter按钮
```java
#Twitter
#twitter_user:
#twitter_tweet_button: true
```
###Facebook Like
```java
#Facebook Like
#facebook_like: true
```

###去除Google+相关
```java
#Google +1
#google_plus_one: true
#google_plus_one_size: medium
 
#Google Plus Profile
#Hidden: No visible button, just add author information to search results
#googleplus_user:
#googleplus_hidden: false
```

##替换快速的请求资源
其实，真正解决加速的重要环节可能是这里，因为Octopress很多依赖于Google的库和资源
###解决Google Analytics巨慢的问题
[这里](http://droidyue.com/)给出的方案是自己在七牛上存放`ga.js`(主要是`Google Analytics`的相关方法)，但是我这边遇到了HTTPS访问HTTP的问题我就直接在自己的工程目录下存放了`ga.js`，参考如下，修改`source/_includes/google_analytics.html`

```javascript
$ <script>
$ 	...
$ 	_gaq.push(['_trackPageview']);
$
$ 	(function() {
$ 		var ga = document.createElement('script'); 
$ 		ga.type = 'text/javascript'; 
$ 		ga.async = true;
$ 		ga.src='http://xxxx.com/ga.js';//自己工程目录或者CDN
$		var s = document.getElementsByTagName('script')[0]; 	
$ 		s.parentNode.insertBefore(ga, s);
$ 	})();
$ </script>
```
###解决fonts.googleapis.comm问题
问了节省大家时间，我给你们找了一个[国内外优秀前端 CDN 加速服务](http://blog.csdn.net/maxsky/article/details/51980438)，去找一些你们自己认为信得过的CDN服务商(例如：不要选360了因为已经不再维护了)

修改文件`/source/_includes/custom/head.html`

```javascript
$ <link href="https://fonts.cat.net/css?family=PT+Serif:regular,italic,bold,bolditalic" rel="stylesheet" type="text/css">
$ <link href="https://fonts.cat.net/css?family=PT+Sans:regular,italic,bold,bolditalic" rel="stylesheet" type="text/css">
```


###解决ajax.googleapis.comm问题
修改`source/_includes/head.html`，还是利用上面的CDN替换`jquery.min.js`


```javascript
$ <link rel="canonical" href="{{ canonical }}">
$ <link href="{{ root_url }}/favicon.png" rel="icon">
$ <link href="{{ root_url }}/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css">
$ <link href="{{ site.subscribe_rss }}" rel="alternate" title="{{site.title}}" type="application/atom+xml">
$ <script src="{{ root_url }}/javascripts/modernizr-2.0.js"></script>
$ <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
$ <script>!window.jQuery && document.write(unescape('%3Cscript src="./javascripts/libs/jquery.min.js"%3E%3C/script%3E'))</script>
$ <script src="{{ root_url }}/javascripts/octopress.js" type="text/javascript"></script>

```
#参考资料

* http://octopress.org/
* http://msching.github.io/
* http://biaobiaoqi.me/blog/2013/03/21/building-octopress-in-github-mac/
* http://biaobiaoqi.me/blog/2013/07/10/decorate-octopress/
* http://droidyue.com/blog/2014/06/22/fix-octopress-slow-loading-speed-issue-in-china-mainland/index.html
