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
		            lottery.rollloading(); 
		            click = false;
		            return false; 
			    }  
		    }); 
		}
	})
});