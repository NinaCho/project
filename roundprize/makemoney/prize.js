var rotateFn = {
	param : {
		url : "",//请求地址
		startBtn : $("#js_start"),//按钮
		rotateObj : $("#js_rotatePanel"),//旋转容器
		rotateNum : 3,//圈数
	},	
	jumpLink : "",
	showDialog : function(dom){
		var _this = this;
		GLOBAL.PopObj.openPop({
			type: 1,
			area: ['auto', 'auto'],
			page: {dom: dom},
			close : function(index){
				if(_this.jumpLink){
					window.location.href = _this.jumpLink;
				}
				else{
					layer.close(index);
				}
				return;
			}
		});
	},
	process : function(data){

		var _this = this;
		//未登录
		if(data.status == -1){
			layer.closeAll();						
			window.location.href = HTTPS_LOGIN_DOMAIN + JS_LANG + 'm-users-a-sign.htm?ref=' + window.location.href;
		}
		//正常抽奖
		else if(data.status == 1){
			_this.rotate(data);
		}
		//机会用完
		else if(data.status == 2){
			layer.closeAll();						
			_this.showDialog(".lucky-draw-result-nochance");		
		}
		else if(data.status == 3){
			layer.alert(jsLg.deBugMsg.argumentsIllegal);
		}		
	},
	rotate : function(data){
		//awards:奖项，angle:奖项对应的角度
		/*
			奖品列表：
			$2 off          =>0
			15% off        =>1
			10% off  		=>2
			$15 over $100 point        =>3
			good luck  	    =>4
			get it free     =>5						
		*/
		var _this = this;
		var rotateArray = [[0,90.7],[1,151],[2,210.9],[3,271],[4,330.7],[5,390]];
			angle = rotateArray[data.data.angle][1]; //取到角度
			angle = $.isNumeric(angle) ? angle : 0;  //容错

		//初始化停止
		_this.param.rotateObj.stopRotate();
	
		_this.param.rotateObj.rotate({
			angle:0, 
			duration: 5000, 
			animateTo: angle + (_this.param.rotateNum * 360),
			callback:function(){
				//coupon奖励
				if(data.data.angle==0 || data.data.angle==2 || data.data.angle==3 || data.data.angle==1){
					_this.showDialog(".lucky-draw-result-coupon");
					$('.lucky-draw-result-coupon .coupon').text(data.data.msg);
				}
				//point奖励
				/*else if(data.data.angle==1 ){
					_this.showDialog(".lucky-draw-result-point");
					$('.lucky-draw-result-point .point').find('strong').text(data.data.msg);
				}*/
				//get it free奖励
				else if(data.data.angle==5){
					_this.showDialog(".lucky-draw-result-free");
					$('.lucky-draw-result-free .coupon').find('strong').text(data.data.msg);
					$('.lucky-draw-result-free .link').find('a').attr("href",data.data.link);
				}
				//没中奖
				else{
					_this.showDialog(".lucky-draw-result-unlucky");
				}
			}
		});	
	},
	bindEvent : function(){
		var _this = this;		
		_this.param.startBtn.click(function(event) {	
			$.getJSON(_this.param.url,function(data) {
				_this.jumpLink = data.link;
				_this.process(data);
			});
		});
	},
	init : function(param){
		var _this = this;
		_this.param = $.extend({},_this.param,param); //参数合并
		_this.bindEvent();

	}
}