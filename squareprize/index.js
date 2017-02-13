
function roll(){
	lottery.times += 1;
	lottery.roll();
	if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
		clearTimeout(lottery.timer);
		lottery.prize=-1;
		lottery.times=0;
		click=false;
	}else{
		if (lottery.times<lottery.cycle) {
			lottery.speed -= 10;

		}else if(lottery.times==lottery.cycle) {
			var index = $("#lottery").attr("prize_id")|0;
			lottery.prize = index;		
		}else{
			if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
				lottery.speed += 110;
			}else{
				lottery.speed += 20;
			}
		}
		if (lottery.speed<40) {
			lottery.speed=40;
		};
		//console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
		lottery.timer = setTimeout(roll,lottery.speed);
	}
	return false;
}

$(function() { 
	var click = false;
    lottery.init('lottery'); 
    $("#lottery a").click(function() { 
    	if (click) {
			return false;
		}else{
			click = true;
	        lottery.speed = 100; 
			$.ajax({
			    type: "get",
			    dataType: "json",
			    data: {uid: 1},
			    url: "data.json",
			    success: function(data){
		            $("#lottery").attr("prize_site", data.data.prize_site); 
		            $("#lottery").attr("prize_id", data.data.prize_id); 
		            $("#lottery").attr("prize_name", data.data.prize_name); 
		            roll(); 
		            click = false;
		            return false; 
			    }  
		    }); 
		}
	})
});