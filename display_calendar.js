		var current_date = new Date().getDate();
		var current_month = new Date().getMonth();
		var current_year = new Date().getFullYear();
		var current_day = new Date().getDay();
		var month = new Month(current_year, current_month);
		

		$(document).on('click', '.month .next', function(){
			month = month.nextMonth();
			layoutCalendar(month, new Date());
			var user_view = $(".view_calendar_value").find(".user_view").val();
			if (user_view) {
				//alert("inside click share " + user_view);
				update_calendar_share(user_view);
			} else {
				//alert("outside click share");
				update_calendar();
			}
			
			

		});

		$(document).on('click', '.month .prev', function(){
			month = month.prevMonth();
			layoutCalendar(month, new Date());
			var user_view = $(".view_calendar_value").find(".user_view").val();
			if (user_view) {
				//alert("inside click share " + user_view);
				update_calendar_share(user_view);
			} else {
				//alert("outside click share");
				update_calendar();
			}
			
		});
		

		$(document).ready(function(){layoutCalendar(month, new Date());});
		
		function layoutCalendar(displayMonth, current_date){
			
			var firstDay = displayMonth.getDateObject(1).getDay();
			var lastDate = displayMonth.nextMonth().getDateObject(0).getDate();
			var current_year = current_date.getFullYear();
			$(".current").text(function(){
				
				var month = "";
				var year = displayMonth.getDateObject(1).getFullYear().toString();
				switch(displayMonth.getDateObject(1).getMonth()){
					case 0:
						month="January";
						break;
					case 1:
						month="February";
						break;
					case 2:
						month="March";
						break;
					case 3:
						month="April";
						break;
					case 4:
						month="May";
						break;
					case 5:
						month="June";
						break;
					case 6:
						month="July";
						break;
					case 7:
						month="August";
						break;
					case 8:
						month="September";
						break;
					case 9:
						month="October";
						break;
					case 10:
						month="November";
						break;
					case 11:
						month="December";
						break;
				}
				return month+" "+year;

			});
			$(".days").html("");
			for (i = 1; i<firstDay; i++){
				$(".days").append("<li> <br> </li>");

			}

			for (z=1; z<=lastDate; z++){
				if (z == current_date.getDate() && displayMonth.getDateObject(1).getMonth() == current_date.getMonth() && displayMonth.getDateObject(1).getFullYear()==current_date.getFullYear()){
					$(".days").append("<li class ='actual' id='"+z.toString()+"'><span class='active'>"+z.toString()+"</span><input type='hidden' class ='event_num' value='0'><p class ='event_display'><br></p></li>");
				} else {
				$(".days").append("<li class ='actual' id='"+z.toString()+"'><span>"+z.toString()+"</span><input type='hidden' class='event_num' value='0'><p class ='event_display'><br></p></li>");
				}

			}




		}