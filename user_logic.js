$(document).ready(check_if_logged_in);

		function check_if_logged_in(){
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", "check_if_logged_in.php", true);
			$(".header").html("");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);
				if (jsonData.logged){
					$(".welcome").append("<h1> Welcome, "+jsonData.username+" <h1>");
					$(".token").val(jsonData.token);
					//alert("token " + jsonData.token);
					//alert($(".token").val());
					$(".header").append("<button type ='button' onclick ='addEvent()'>Add Event</button>");
					$(".header").append("<button type ='button' onclick ='shareCalendar()'>Share Calendar</button>");
					$(".view_calendar").append ("<span> View calendar of other user: </span><input type ='text' class ='share_user' placeholder='username'><button type='button' onclick='view_sharedCalendar()'>View</button>");
					$(".tag_value").append("<br><span>Only show events with tag: </span><select name='tag_display' class ='tag_display'><option value='All'>All</option><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select>");
					$(".logout").html("<button type='button' onclick='logout()'>Log Out</button>");
					update_calendar();
				} else {
					login_display();
				}


			}, false);
			xmlHttp.send(null);

		}
		

		function login_display() {
			$(".header").html("");
			$(".header").append("<p>You are not logged in.</p>");
			$(".header").append("<span>Username: </span>");
			$(".header").append("<input class = 'username' type = 'text'> <br>");
			$(".header").append("<span>Password: </span>");
			$(".header").append("<input class='password' type = 'password'>");
			$(".header").append("<div class ='message'></div>");
			$(".header").append("<p><button type='button' onclick='login()'>Log In</button></p>");

			$(".header").append("<p><button type='button' onclick = 'signup()'>Sign Up</button></p>");
		}

		

		function signup(){
			$(".header").html("");
			$(".header").append("<p>You are not logged in.</p>");
			$(".header").append("<span>Username: </span>");
			$(".header").append("<input class = 'username' type = 'text'> <br>");
			$(".header").append("<span>Password: </span>");
			$(".header").append("<input class='password' type = 'password'><br>");
			$(".header").append("<span>Retype password: </span>");
			$(".header").append("<input class='retype_password' type = 'password'>");

			$(".header").append("<div class ='message'></div>");
			$(".header").append("<p><button type='button' onclick='check_if_logged_in()'>Back to Login</button></p>");
			$(".header").append("<p><button type='button' onclick='server_signup()'>Sign Up</button></p>");

		}

		function server_signup(){
			var username = $(".username").val();
			var password = $(".password").val();
			var retype_password = $(".retype_password").val();
			var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)+"&retype_password="+ encodeURIComponent(retype_password);

			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","server_signup.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);

				if (jsonData.success){
					login_display();

					$(".message").text(jsonData.message);
				} else {
					$(".message").text(jsonData.message);
				}

			},false);
			xmlHttp.send(dataString);

		}

		function logout(){
			$(".welcome").html("");
			$(".logout").html("");
			$(".message").html("");
			$(".tag_value").html("");
			$(".view_calendar").html("");
			$(".view_calendar_message").html("");
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", "server_logout.php", true);
			xmlHttp.send(null);
			$(".days").html("");
			$(".header").html("");
			$(".date_events").html("");
			$(".date_events_list").html("");
			layoutCalendar(month, new Date());
			login_display();

		}

		function login(){
			var username = $(".username").val();
			var password = $(".password").val();
			var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST","server_login.php",true);
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xmlHttp.addEventListener("load", function(event){
				var jsonData = JSON.parse(event.target.responseText);

				if (jsonData.success){
					$(".message").text("");
					$(".header").html("");
					$(".token").val(jsonData.token);
					//alert($(".token").val());
					$(".welcome").append("<h1> Welcome, "+jsonData.username+" <h1>");
					$(".header").append("<button type ='button' onclick ='addEvent()'>Add Event</button>");
					$(".header").append("<button type ='button' onclick ='shareCalendar()'>Share Calendar</button>");
					$(".view_calendar").append ("<span> View calendar of other user: </span><input type ='text' class ='share_user' placeholder='username'><button type='button' onclick='view_sharedCalendar()'>View</button>");
					$(".tag_value").append("<br><span>Only show events with tag: </span><select name='tag_display' class ='tag_display'><option value='All'>All</option><option value='Work'>Work</option><option value='Family'>Family</option><option value='Personal'>Personal</option><option value='Social'>Social</option><option value='Other'>Other</option></select>");
					$(".logout").html("<button type='button' onclick='logout()'>Log Out</button>");
					update_calendar();
				} else {
					$(".message").text(jsonData.message);
				}

			},false);
			xmlHttp.send(dataString);


		}