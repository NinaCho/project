var lottery = { 
        index: 0, //当前转动到哪个位置，起点位置 
        count: 0, //总共有多少个位置 
        timer: 0, //setTimeout的ID，用clearTimeout清除 
        speed: 20, //初始转动速度 
        times: 2, //转动次数 
        cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节 
        prize: 0, //中奖位置 
        init: function(id) { 
            if ($("#" + id).find(".lottery-unit").length > 0) { 
                $lottery = $("#" + id); 
                $units = $lottery.find(".lottery-unit"); 
                this.obj = $lottery; 
                this.count = $units.length; 
                $lottery.find(".lottery-unit-" + this.index).addClass("active"); 
            } 
        }, 
        roll: function() {
            var index = this.index; 
            var count = this.count; 
            var lottery = this.obj; 
            $(lottery).find(".lottery-unit-" + index).removeClass("active"); 
            index += 1; 
            if (index > count - 1) { 
                index = 0; 
            } 
            $(lottery).find(".lottery-unit-" + index).addClass("active"); 
            this.index = index; 
            return false; 
        }, 
        stop: function(index) { 
            this.prize = index; 
            return false; 
        } 
};
