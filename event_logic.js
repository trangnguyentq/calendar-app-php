		function addEvent(){
			$(".header").html("<span>Title: </span><input type='text' class='title'><br><input type='date' class='date'><input type ='text' class ='time' placeholder='00:00'><select name='tag' id ='tag'><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select><button type='button' onclick='server_addEvent()'>Add</button><br><div class = 'message'></div><button type='button' onclick='main_display()'>Back</button>");

		}
		
		function shareCalendar() {
			$(".header").html("<span>Share calendar with: </span><input type='text' class='share_calendar'><button type='button' onclick='server_shareCalendar()'>Share</button><br><div class = 'message'></div><button type='button' onclick='main_display()'>Back</button>");

		}
		
		
		function server_shareCalendar() {
			var share_user = $(".share_calendar").val();
			var token = $(".token").val();
			var dataString = "share_user=" + encodeURIComponent(share_user) + "&token=" + encodeURIComponent(token) ;
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","server_shareCalendar.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				
				if (jsonData.success){
					$(".message").text("");
					$(".message").text(jsonData.message);
				} else {
					$(".message").text(jsonData.message);
				}

			},false);
			xmlHttp.send(dataString);
		}
		
		function server_addEvent(){
			var date = $(".date").val();
			var time = $(".time").val();
			var title = $(".title").val();
			var tag = $("#tag option:selected").val();
			var token = $(".token").val();
			//alert(token);
			var dataString = "date=" + encodeURIComponent(date) + "&time=" + encodeURIComponent(time) + "&title=" +encodeURIComponent(title) + "&tag=" + encodeURIComponent(tag) + "&token=" + encodeURIComponent(token);
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","server_addEvent.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				
				if (jsonData.success){
					$(".message").text("");
					$(".message").text(jsonData.message);
					update_calendar();
				} else {
					$(".message").text(jsonData.message);
				}

			},false);
			xmlHttp.send(dataString);

		}

		function main_display(){
			$(".header").html("<button type ='button' onclick ='addEvent()'>Add Event</button>");
			$(".header").append("<button type ='button' onclick ='shareCalendar()'>Share Calendar</button>");
			
		}
		
		function back_to_calendar() {
			update_calendar();
			$(".view_calendar_message").html("");
			$(".view_calendar_value").html("");
			$(".date_events").text("");
			$(".date_events_list").html("");
		}
		
		function view_sharedCalendar() {
			var user_view = $(".view_calendar").find(".share_user").val();
			//alert(user_view);
			var token = $(".token").val();
			var xmlHttp = new XMLHttpRequest();
			var dataString = "user_view=" + encodeURIComponent(user_view)  + "&token=" + encodeURIComponent(token);
			
			xmlHttp.open("POST","get_share_calendar.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.success){
					//alert("success");
					$(".view_calendar_value").html("<button type='button' onclick='back_to_calendar()'>Back to my calendar</button><input type='hidden' class='user_view' value ='"+user_view+"'>");
					$(".view_calendar_message").text(user_view + "'s calendar: ");
					update_calendar_share(user_view);
					$(".date_events").text("");
					$(".date_events_list").html("");
					
				} else {
					//alert("blah");
					$(".view_calendar_message").text(jsonData.message);
				}
			},false);
			xmlHttp.send(dataString);
			
		}
		
		
		function update_calendar_share(user){
			var q_first = month.getDateObject(1).getDate();
			var q_last = month.nextMonth().getDateObject(0).getDate();
			var q_month = month.getDateObject(1).getMonth();
			//alert(q_month);
			var q_year = month.getDateObject(1).getFullYear();
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET","month_events_share.php"+"?month="+encodeURIComponent(q_month)+"&year="+encodeURIComponent(q_year)+"&first="+encodeURIComponent(q_first)+"&last="+encodeURIComponent(q_last) + "&user_share="+ encodeURIComponent(user),true);
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.success){
					var lis = $(".days").children();
					for (var z =0; z<lis.length;z++){
						var counter =0;
						var this_date = $(lis[z]).children().first().text();
						//$(".welcome").text(this_date);
						for (var i =0; i<jsonData.list.length;i++){
							if (parseInt(this_date)==parseInt(jsonData.list[i])){
								counter++;
							}
						}
						if (counter==0){
							//alert("smaller");
							$(lis[z]).removeClass("clickable");
							$(lis[z]).find(".event_display").text("");
							$(lis[z]).find(".event_display").html("<br>");
						} else {
							//alert("bigger than 0");
							$(lis[z]).addClass("clickable");
							$(lis[z]).find(".event_display").text(counter+" event(s) planned.");
						}
					}
				} else {
					//alert("blah");
					$(".message").text(jsonData.message);
				}
			},false);
			xmlHttp.send(null);
		}


		function reload_date_events_share(d_year, d_month, d_date, d_tag, user){
			var xmlHttp = new XMLHttpRequest();			
			xmlHttp.open("GET","date_events_share.php"+"?month="+encodeURIComponent(parseInt(d_month)+1)+"&year="+encodeURIComponent(d_year)+"&date="+encodeURIComponent(d_date)+"&user_view="+encodeURIComponent(user),true);
			
			xmlHttp.addEventListener("load", function(event){

				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.success){
					$(".date_events").text("");
					$(".date_events_list").html("");
					$(".date_events").text(d_tag+ " events of "+ user +" on "+(parseInt(d_month)+1)+"/"+d_date+"/"+d_year+":");

					for (var i=0; i<jsonData.list.length;i++){
						//alert(jsonData.list[i].shared_by);
						if (jsonData.list[i].shared_by) {
							$(".date_events_list").append("<li>" + jsonData.list[i].tag+": <strong>"+jsonData.list[i].title+"</strong> at "+jsonData.list[i].time+ "shared by "+ jsonData.list[i].shared_by + "<br>");
						} else {
							$(".date_events_list").append("<li>" + jsonData.list[i].tag+": <strong>"+jsonData.list[i].title+"</strong> at "+jsonData.list[i].time+"<br>");
						}
					}
				} else {


				}
			}, false);
			xmlHttp.send(null);

		}
		
		function update_calendar(){

			var q_first = month.getDateObject(1).getDate();
			var q_last = month.nextMonth().getDateObject(0).getDate();
			var q_month = month.getDateObject(1).getMonth();
			//alert(q_month);
			var q_year = month.getDateObject(1).getFullYear();
			
			var xmlHttp = new XMLHttpRequest();
			
			xmlHttp.open("GET","month_events.php"+"?month="+encodeURIComponent(q_month)+"&year="+encodeURIComponent(q_year)+"&first="+encodeURIComponent(q_first)+"&last="+encodeURIComponent(q_last),true);
			
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);

				if (jsonData.success){
					var lis = $(".days").children();
					for (var z =0; z<lis.length;z++){
						var counter =0;
						var this_date = $(lis[z]).children().first().text();
						//$(".welcome").text(this_date);
						for (var i =0; i<jsonData.list.length;i++){
							if (parseInt(this_date)==parseInt(jsonData.list[i])){
								counter++;
							}

						}

						if (counter == 0){
							//alert("smaller");
							$(lis[z]).removeClass("clickable");
							$(lis[z]).find(".event_display").text("");
							$(lis[z]).find(".event_display").html("<br>");

						} else {
							//alert("bigger than 0");
							$(lis[z]).addClass("clickable");
							$(lis[z]).find(".event_display").text(counter+" event(s) planned.");
						}




					}
			

				} else {
					//alert("blah");
					$(".message").text(jsonData.message);
				}

			},false);
			xmlHttp.send(null);
		}

		function reload_date_events(d_year, d_month, d_date, d_tag){
			var xmlHttp = new XMLHttpRequest();
			
			//$(".date_events").html("<br><span>Display only events with tag: </span><select name='tag_display' class ='tag_display'><option value='All'>All</option><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select>");
			if (d_tag == "All") {
				//alert("Get to All");
				xmlHttp.open("GET","date_events.php"+"?month="+encodeURIComponent(parseInt(d_month)+1)+"&year="+encodeURIComponent(d_year)+"&date="+encodeURIComponent(d_date),true);
			} else {
				//alert("Not Get to All");
				xmlHttp.open("GET","date_events_withtag.php"+"?month="+encodeURIComponent(parseInt(d_month)+1)+"&year="+encodeURIComponent(d_year)+"&date="+encodeURIComponent(d_date)+"&tag="+encodeURIComponent(d_tag),true);
			}
			xmlHttp.addEventListener("load", function(event){

				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.success){
					$(".date_events").text("");
					$(".date_events_list").html("");
					$(".date_events").text(d_tag+ " events on "+(parseInt(d_month)+1)+"/"+d_date+"/"+d_year+":");
					//$(".date_events").html("<span>Display only events with tag: </span><select name='tag_display' id ='tag_display'><option value='All'>All</option><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select><button type='button' onclick='event_with_tag()'>Display</button>");

					for (var i=0; i<jsonData.list.length;i++){
						//alert(jsonData.list[i].shared_by);
						if (jsonData.list[i].shared_by) {
							$(".date_events_list").append("<li>" + jsonData.list[i].tag+": <strong>"+jsonData.list[i].title+"</strong> at "+jsonData.list[i].time+ " shared by "+ jsonData.list[i].shared_by + "<br><div class='event_message'></div><button type='button' class ='edit'>Edit</button><button type='button' class='delete'>Delete</button><button type='button' class = 'add_participant'>Add a participant</button><input type='hidden' class='title' value ='"+jsonData.list[i].title+"'><input type='hidden' class='tag' value ='"+jsonData.list[i].tag+"'><input type='hidden' class ='time' value ='"+d_year+"-"+(parseInt(d_month)+1)+"-"+d_date+" "+jsonData.list[i].time+"'></li>");
						} else {
							$(".date_events_list").append("<li>" + jsonData.list[i].tag+": <strong>"+jsonData.list[i].title+"</strong> at "+jsonData.list[i].time+"<br><div class='event_message'></div><button type='button' class ='edit'>Edit</button><button type='button' class='delete'>Delete</button><button type='button' class = 'add_participant'>Add a participant</button><input type='hidden' class='title' value ='"+jsonData.list[i].title+"'><input type='hidden' class='tag' value ='"+jsonData.list[i].tag+"'><input type='hidden' class ='time' value ='"+d_year+"-"+(parseInt(d_month)+1)+"-"+d_date+" "+jsonData.list[i].time+"'></li>");
						}
					}
				} else {


				}
			}, false);
			xmlHttp.send(null);

		}

		
		$(document).on('click','.date_events_list li .delete', function(){

			var title = $(this).parent().find(".title").val();
			var time = $(this).parent().find(".time").val();
			var d_tag = $(".tag_value").find(".tag_display").val();
			var just_date = time.split(" ")[0];
			var token = $(".token").val();
			var dataString = "title="+encodeURIComponent(title)+"&time="+encodeURIComponent(time) + "&token=" + encodeURIComponent(token);
			var xmlHttp = new XMLHttpRequest();
			//alert(title + time + d_tag);
			xmlHttp.open("POST","delete_event.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);

				if (jsonData.success){
					var time_values = just_date.split("-");
					//alert(time_values[0]+"and"+time_values[1]+"and"+time_values[2]);
					reload_date_events(time_values[0], time_values[1]-1, time_values[2], d_tag);
					update_calendar();

					
				} else {
					//alert("nah");
					$(".event_message").text(jsonData.message);
					
				}

			},false);
			xmlHttp.send(dataString);
		});
		
		$(document).on('click','.date_events_list li .add_participant', function(){
			//alert("To add participant");
			$(this).parent().append("<div class = 'add_participant_display'><span>Participant account: </span><input type='text' class ='participant_account' ><button type ='button' class = 'edit_participant'>Add</button><button type ='button' class = 'cancel_add'>Cancel</button></div>");
			$(this).remove();
		});
		
		$(document).on('click','.date_events_list li .add_participant_display .cancel_add', function(){
			var time = $(this).parent().parent().find(".time").val();
			var d_tag = $(".tag_value").find(".tag_display").val();
			var just_date = time.split(" ")[0];
			var time_values = just_date.split("-");
			reload_date_events(time_values[0], time_values[1]-1, time_values[2], d_tag);
			update_calendar();
		});
		
		$(document).on('click','.date_events_list li .add_participant_display .edit_participant', function(){
			var title = $(this).parent().parent().find(".title").val();
			var time = $(this).parent().parent().find(".time").val();
			var d_tag = $(".tag_value").find(".tag_display").val();
			var tag = $(this).parent().parent().find(".tag").val();
			var token = $(".token").val();
			var new_participant = $(this).parent().find(".participant_account").val();
			//alert(new_participant + " " + tag + " " + title + " " + time + " " + new_participant);
			var just_date = time.split(" ")[0];
			var dataString = "title="+encodeURIComponent(title)+"&time="+encodeURIComponent(time)+"&tag="+encodeURIComponent(tag)+"&new_participant="+encodeURIComponent(new_participant)+ "&token=" + encodeURIComponent(token);
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","add_participant.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.success){
					//$(this).parent().parent().prepend("<button type='button' class ='edit'>Edit</button>");
					//$(this).parent().remove();
					var time_values = just_date.split("-");
					//alert(time_values[0]+"and"+time_values[1]+"and"+time_values[2]);
					reload_date_events(time_values[0], time_values[1]-1, time_values[2], d_tag);
					update_calendar();
				} else {
					//alert("blah");
					$(".event_message").text(jsonData.message);	
				}
			},false);
			xmlHttp.send(dataString);
		});


		$(document).on('click','.date_events_list li .edit', function(){
			var title = $(this).parent().find(".title").val();
			var time = $(this).parent().find(".time").val();
			var just_time = time.split(" ")[1];
			$(this).parent().append("<div class = 'edit_display'><span>Title: </span><input type='text' class ='title' value='"+title+"'><span>Time: </span> <input type ='text' class = 'just_time' value ='"+just_time.substring(0,5)+"'><select name='tag_edit' class ='tag_edit'><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select><button type ='button' class = 'save_edit'>Save changes</button><button type ='button' class = 'cancel_edit'>Cancel</button></div>");
			$(this).remove();

			
		
		});
		
		
		$(document).on('click','.date_events_list li .edit_display .cancel_edit', function(){
			var time = $(this).parent().parent().find(".time").val();
			var d_tag = $(".tag_value").find(".tag_display").val();
			var just_date = time.split(" ")[0];
			var time_values = just_date.split("-");
			reload_date_events(time_values[0], time_values[1]-1, time_values[2], d_tag);
			update_calendar();
		});

		$(document).on('click','.date_events_list li .edit_display .save_edit', function(){
			var title = $(this).parent().parent().find(".title").val();
			var time = $(this).parent().parent().find(".time").val();
			var token = $(".token").val();
			var d_tag = $(".tag_value").find(".tag_display").val();
			var new_title = $(this).parent().find(".title").val();
			var new_time = $(this).parent().find(".just_time").val();
			var new_just_time = $(this).parent().find(".just_time").val();
			var new_tag = $(this).parent().find(".tag_edit").val();
			//alert(new_tag);
			var just_date = time.split(" ")[0];
			new_time = just_date+" "+new_time;
			var dataString = "title="+encodeURIComponent(title)+"&time="+encodeURIComponent(time)+"&new_title="+encodeURIComponent(new_title)+"&new_time="+encodeURIComponent(new_time)+"&new_just_time="+encodeURIComponent(new_just_time)+"&new_tag="+encodeURIComponent(new_tag)+"&token="+encodeURIComponent(token);
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","edit_event.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);

				if (jsonData.success){
					var time_values = just_date.split("-");
					//alert(time_values[0]+"and"+time_values[1]+"and"+time_values[2]);
					reload_date_events(time_values[0], time_values[1]-1, time_values[2], d_tag);
					update_calendar();

					
				} else {
					//alert("blah");
					$(".event_message").text(jsonData.message);
					
				}

			},false);
			xmlHttp.send(dataString);
		});

		$(document).on('click', '.days li.clickable', function(){
			//alert($(this).children().first().text());
			var user_view = $(".view_calendar_value").find(".user_view").val();
			var d_date = $(this).children().first().text();
			var d_month = month.getDateObject(1).getMonth();
			var d_tag = $(".tag_value").find(".tag_display").val();
			//alert(d_tag);
			var d_year = month.getDateObject(1).getFullYear();
			if (user_view) {
				//alert("inside click share " + user_view);
				reload_date_events_share(d_year, d_month, d_date, d_tag, user_view);
			} else {
				//alert("outside click share");
				reload_date_events(d_year, d_month, d_date, d_tag);
			}
			
		});
		
		