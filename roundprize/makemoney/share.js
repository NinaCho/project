/**
 * 第三方分享
 * @Author: yukai
 * @Date:   2016-07-22
 */

window.share = {
	fackbook : {
		init : function(callback){
			var _this = this;
		    $("body").append('<div id="fb-root"></div>');
		    window.fbAsyncInit = function() {
		        FB.init({
		            appId: '1592294021098637',
		            status: true,
		            cookie: true,
		            oauth: true,
		            xfbml: true,
		            version: 'v2.6'
		        });
		    };
		    (function() {
		        var e = document.createElement('script');
		        e.type = 'text/javascript';
		        e.src = 'http://connect.facebook.net/en_US/all.js';
		        e.async = true;
		        document.getElementById('fb-root').appendChild(e);
		    }());


		    if(typeof callback == 'function'){
				callback();
			}
		},
		start : function(cfg,callback){
			var _this = this;
			cfg = cfg || {};
			FB.ui({
                method: 'feed',
                display: 'popup',
                name : cfg.name,
                picture : cfg.picture,
                link : cfg.link,
                caption : cfg.caption,
                description : cfg.description
            },function(response){
                if(response && !response.error_code){ 
			        if(typeof callback == 'function'){
						callback();
					}
                }
            });	  		          
		}
	},	
	twitter : {
		init: function(callback) {
			var _this = this;
			$("body").append('<div id="twitter-root"></div>');
		    window.twttr = (function(d, s, id) {
		        var t, js, fjs = d.getElementsByTagName(s)[0];
		        if (d.getElementById(id)) return;
		        js = d.createElement(s);
		        js.id = id;
		        js.src = "https://platform.twitter.com/widgets.js";
		        fjs.parentNode.insertBefore(js, fjs);
		        return window.twttr || (t = {
		            _e: [],
		            ready: function(f) {
		                t._e.push(f)
		            }
		        });
		    }(document, "script", "twitter-wjs"));

		    if(typeof callback == 'function'){
				callback();
			}
		},
		start : function(cfg,callback){
			var _this = this;
			cfg = cfg || {};

			var iWidth=650,
            	iHeight=430,
            	iTop = (window.screen.availHeight-30-iHeight)/2,
            	iLeft = (window.screen.availWidth-10-iWidth)/2,
            	url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(cfg.text)+'&url='+encodeURIComponent(cfg.link);
            window.open(url,'', 'width='+iWidth+',height='+iHeight+',top='+iTop+',left='+iLeft); 
       
            if(typeof callback == 'function'){
				callback();
			}
		}
	},
	google :{
		init : function(callback){
			var _this = this;
			(function() {
		        var e = document.createElement('script'),
		        	fjs = document.getElementsByTagName('script')[0];
		        e.type = 'text/javascript';
		        e.src = 'https://apis.google.com/js/platform.js';
		        e.async = true;
		        fjs.parentNode.insertBefore(e, fjs);
		    }());


		    if(typeof callback == 'function'){
				callback();
			}
		},
		start : function(cfg,callback){			
			var _this = this;
			cfg = cfg || {};

			var iWidth=510,
            	iHeight=550,
            	iTop = (window.screen.availHeight-30-iHeight)/2,
            	iLeft = (window.screen.availWidth-10-iWidth)/2,
            	url = 'https://plus.google.com/share?url='+encodeURIComponent(cfg.link)+'&t='+encodeURIComponent(cfg.text);
            window.open(url,'', 'width='+iWidth+',height='+iHeight+',top='+iTop+',left='+iLeft); 
            if(typeof callback == 'function'){
				callback();
			}
		}
	},
	pinterest : {
		start : function(cfg,callback){
			var _this = this;
			cfg = cfg || {};

			var iWidth=800,
            	iHeight=650,
            	iTop = (window.screen.availHeight-30-iHeight)/2,
            	iLeft = (window.screen.availWidth-10-iWidth)/2,

            	url = 'https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(cfg.link)+'&media='+encodeURIComponent(cfg.image)+'&description='+encodeURIComponent(cfg.text);
            window.open(url,'', 'width='+iWidth+',height='+iHeight+',top='+iTop+',left='+iLeft); 
            if(typeof callback == 'function'){
				callback();
			}
		}
	}
};

window.share.fackbook.init();