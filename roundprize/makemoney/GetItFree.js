/**
 * [Get It Free活动]
 * @date 2016-07-22
 * @author yukai
 */
var getItFreeFn = {
    url : {
        save : '/fun/?act=save_boutique_shareid',
        get : '/fun/?act=get_boutique_shareid',
        luckyUrl : DOMAIN_USER + 'm-promotion-active-99.html'
    },
    goodsInfo : {},
    /**
     * [showDialog 再封装layer,方便使用]
     * @param  {[String]}  dom [弹出层元素的类名或ID]
     * @param  {Function} callback [关闭时的回调]
     */
    showDialog : function(dom,callback){
        GLOBAL.PopObj.openPop({
            area : ['auto','auto'],
            page :{dom : dom},
            close : function(index){
                layer.close(index);
                if(typeof callback == 'function'){
                    callback();
                }
            }
        });
    },    
    /**
     * [updatePop 更新弹窗商品信息]
     * @param  {[Object]} obj [当前被点击的按钮,jQuery对象]
     * @param  {[String]} sid [sid]
     */
    updatePop : function(obj,sid){
        var _this = this,
            ele = obj,            
            $content = $('.makemoney_pop');            

        //将商品信息存入公共对象
        _this.goodsInfo.seid = sid;
        _this.goodsInfo.url = ele.data('share_link') + '?seid=' + sid;
        _this.goodsInfo.goods_id = ele.data('goods_id');
        _this.goodsInfo.goods_sn = ele.data('goods_sn');
        _this.goodsInfo.img = ele.data('goods_img');
        _this.goodsInfo.title = ele.data('goods_title');
        _this.goodsInfo.price = ele.data('goods_price');

        //设置弹窗商品信息
        $content.data({"seid":sid, "goods_id": _this.goodsInfo['goods_id'], "goods_sn": _this.goodsInfo['goods_sn']});//绑定ID
        $content.find('.share-link').text(_this.goodsInfo['url']);//链接
        $content.find('.goods-img a').attr("href",_this.goodsInfo['url']);//商品链接
        $content.find('.goods-img img').attr("src",_this.goodsInfo['img']);//商品图片
        $content.find('.goods-title').text(_this.goodsInfo['title']);//商品标题
        $content.find('.my_shop_price').attr("orgp",_this.goodsInfo['price']);//商品价格

        //更新货币
        GLOBAL.currency.change_houbi();
    },
    /**
     * [createSharePop 创建弹窗元素]
     * @param  {[Object]} obj [当前被点击的按钮,jQuery对象]
     */
    createSharePop : function(obj){
        var _this = this,
            ele = obj,
            gid = ele.data('goods_id');

        $.ajax({
            url : _this.url.get,
            type : "POST",
            dataType:"json",
            data:{
                goods_id:gid
            },                 
            success:function(data){
                //未达到分享上限
                //if(data.shares < 3){
                    var sid = data.seid;    
                    
                    //更新弹窗内容           
                    _this.updatePop(ele,sid);

                    //弹窗（关闭后同时关闭分享成功弹窗）
                    _this.showDialog('.makemoney_pop',function(){
                        $('.share_pop').hide();
                    });

                    //复制
                    _this.createCopy(sid,gid);
                //}
                //达到分享上限
                //else{
                //    _this.createShareLimitPop(ele);
                //}
            }
        });
    },
    /**
     * [createSharePop 创建分享限制提示层]
     * @param  {[Object]} obj [当前被点击的按钮,jQuery对象]
     */
    createShareLimitPop : function(obj){
        var ele = obj,
            tpl = $('<p class="share-limit-tips">Sorry, everyone can share <br> <b>3 different items</b> per day.</p>'),

            posY = ele.offset().top - 75,
            posX = ele.offset().left,
            tip = $('.share-limit-tips'),
            Timer = null;

        if(Timer){window.clearTimeout(Timer)}
        
        tip.length && tip.remove();
        $("body").append(tpl);

        tpl.css({
            "left": posX,
            "top": posY
        });

        Timer = window.setTimeout(function() {
            $('.share-limit-tips').remove();
            window.clearTimeout(Timer);
        },2500);        
    },
    /**
     * [createCopy 创建复制按钮]
     * @param  {[type]} sid [description]
     * @param  {[type]} gid [description]
     * @return {[type]}     [description]
     */
    createCopy : function(sid,gid){
        var _this =this,
            $content = $('.makemoney_pop'),
            client = new ZeroClipboard($content.find('.js_copy'));

        client.on( "ready", function( readyEvent ) {
            client.on("copy",function (event){
                var text = _this.goodsInfo['url'];
                event.clipboardData.setData("text/plain",text);
            });
            client.on( "aftercopy", function( event ) {
                $.getJSON(_this.url.save,{seid:sid,goods_id:gid,shareChannel:'copy'});
                $content.find('.copytip').show();
                setTimeout(function(){
                    $content.find('.copytip').fadeOut();
                },5000);

            });
        });
    },
    //显示分享成功后的弹窗
    showSuccessPop : function(data,sid,goods_sn){
        var _this = this,
            sharePopObj = $('.share_pop'),
            url = _this.url.luckyUrl + '?seid='+ sid + '&goods_sn=' + goods_sn

        //已经抽过奖(隐藏抽奖按钮)
        if(data.is_played == 1){
            sharePopObj.find('h6').css('padding-top','20px')
            .end().find('.lucky-draw-entrance').hide();
        }
        else{
            sharePopObj.find('h6').css('padding-top','0')
            .end().find('.lucky-draw-entrance').show()
            .find('a').attr('href',url);
        }

        sharePopObj.show().find(".close").on("click",function(){
            sharePopObj.hide();
        });
    },
    /**
     * [sendEmail 邮件分享]
     * @param  {[type]} form [表单元素 jQuery对象]
     */
    sendEmail : function(form){
        var _this = this;
        form.validate({
            ingore : false,
            rules : {
                to_email : {
                    required: true,
                    email: true
                }
            },
            messages : {
                to_email : {
                    required: jsLg.email_require,
                    email: jsLg.email_require
                }
            },
            submitHandler : function(form){
                var data = $(form).serialize() + '&link='+_this.goodsInfo['url'] + '&seid='+_this.goodsInfo['seid'] + '&goods_sn='+_this.goodsInfo['goods_sn'],
                    action = form.action;
                $.ajax({
                    url : action,
                    type : "GET",
                    data : data,
                    dataType : "jsonp",
                    beforeSend : function(){
                        window.emailLoadingIndex = layer.load(jsLg.loading,3);
                    },
                    success : function(data){
                        if(data.status == 1){
                            _this.shareCallBack();                            
                        }
                        layer.close(emailLoadingIndex);
                        layer.close(emailDialogIndex);
                    }                    
                });
            }
        });
    },
    /**
     * [processShare 处理分享]
     * @param  {[Object]} obj [当前被点击的分享按钮,jQuery对象]
     * @param  {[Object]} e   [event对象]
     */
    processShare : function(obj,e){
        var _this =this,
            ele = obj,
            className = e.target.className.split(" ")[0],
            shareText = "For Boutique Fashion Lovers Only: Designer Collection·New Arrival Daily· Chic for Every Occasion",
            sharePrefix = 'Join Dezzal, Get $100-Worth-Coupon Gift',
            twitterText = sharePrefix;



        //根据class名区分点击的分享按钮
        switch (className){
            //facebook分享
            case "share-facebook":

            window.share.fackbook.start({
                picture : _this.goodsInfo['img'],
                name : sharePrefix, //+ _this.goodsInfo['title'], 
                link : _this.goodsInfo['url'],
                caption : "Dezzal.com",
                description : shareText
            },function(){
                _this.shareCallBack('facebook');
            });
            break;

            //twitter
            case "share-twitter":
            window.share.twitter.start({
                link : _this.goodsInfo['url'],
                text: twitterText //分享文字
            },function(){
                _this.shareCallBack('twiter');
            });
            break;

            //google
            case "share-google":
            window.share.google.start({
                link : _this.goodsInfo['url'],
                text: sharePrefix + _this.goodsInfo['title'] + shareText //分享文字
            },function(){
                _this.shareCallBack('google');
            });
            break;

            //pinterest
            case "share-pinterest":
            window.share.pinterest.start({
                link : _this.goodsInfo['url'],
                image : _this.goodsInfo['img'],
                text: sharePrefix + _this.goodsInfo['title'] + shareText //分享文字
            },function(){
                _this.shareCallBack('printerest');
            });
            break;

            //邮件分享
            case "share-email":
            var obj = $('.email-share-dialog').find(".default-content"),
                oldText = obj.html();
            obj.html(oldText.replace(/here/g, _this.goodsInfo['url']));
            window.emailDialogIndex = GLOBAL.PopObj.openPop({                
                area : ['auto','auto'],
                page :{dom : '.email-share-dialog'},
                border : [0],
                closeBtn : false
            });
                //email 分享 单独拿出来统计
                var $content = $('.makemoney_pop'),
                    sid =  $content.data('seid'),
                    goods_id = $content.data('goods_id'),
                    goods_sn = $content.data('goods_sn');
                $.ajax({
                    url:_this.url.save,
                    type:"POST",
                    dataType:"json",
                    data:{
                        seid:sid,
                        goods_id:goods_id,
                        shareChannel:'email'
                    },
                    success:function(data){
                    }
                });

            break;            
        }
    },
    //分享成功回调  @param
    shareCallBack : function(typeName){
        var _this = this,
            $content = $('.makemoney_pop'),
            sid =  $content.data('seid'),
            goods_id = $content.data('goods_id'),
            goods_sn = $content.data('goods_sn'),
            shareChannel = typeName;


        $.ajax({
            url:_this.url.save,
            type:"POST",
            dataType:"json",
            data:{
                seid:sid,
                goods_id:goods_id,
                shareChannel:shareChannel
            },                
            success:function(data){
                //0:失败 1:成功 2:已分享过
                if(data.status!=0){
                    _this.showSuccessPop(data,sid,goods_sn);
                }
            }
        });
    },
    //绑定事件
    bindEvent : function(){
        var _this = this;
        //点击GET IT FREE弹出层
        $('body').on('click','.js-getItFree',function(){
            var $this = $(this);
            GLOBAL.login.info_check(1, function(data){ 
                //未登录(去登录)
                if(data.is_login == 0){   
                    location.href = HTTPS_LOGIN_DOMAIN + 'sign-up.html?ref=' + window.location.href;
                }
                //已登录(弹出分享窗口)
                else{
                    _this.createSharePop($this);
                }
            });
        });

        //分享按钮操作
        $('.js-shareBtn a').on('click',function(e){
            var $this = $(this);               
            _this.processShare($this,e);  
        }); 

        //邮件分享
        _this.sendEmail($('.js-emailShareForm'));
    }
}