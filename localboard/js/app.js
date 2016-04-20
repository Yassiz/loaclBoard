$(document).ready(function(){
	var source = $("#image-template").html();
	var imageTemplate = Handlebars.compile(source);

	// Get access token
	var tokenMatches = window.location.href.match(/#access_token=(.*)/);
	if (tokenMatches) {
		var access_token = tokenMatches[1];
		//console.log(access_token);
		window.sessionStorage.setItem("instagram_access_token", access_token);
		//Also Get information about the owner of the access_token
		$.ajax({
			url: "https://api.instagram.com/v1/users/self/?access_token="+window.sessionStorage.getItem("instagram_access_token"),
			dataType: "jsonp",
			type: "GET",
			success: function(result) {
				var username = result.data.username;
				$("ul.navbar-right li").html("<span class='welcome'>Welcome "+username+"!<span>");
			},
			error: function() {
				alert("Error getting user information!");
			}
		});
	}
	
	
	$("#find").on("click", function(event){
		event.preventDefault();
		//geo location
		if (!navigator.geolocation){
			alert("<p>Geolocation is not supported by your browser</p>");
			return;
		}
		function success(position) {
			var latitude  = position.coords.latitude;
			var longitude = position.coords.longitude;
			//instagram ajax to get photos
			var token = window.sessionStorage.getItem("instagram_access_token");
			$.ajax({
				url: "https://api.instagram.com/v1/media/search?lat="+latitude+"&lng="+longitude+"&distance=5000&access_token="+token,
				dataType: "jsonp",
				type: "GET",
				success: function(results) {
					console.log(results);
					if(results.data){
						var result_arr = results.data;
						result_arr.forEach(function (element) {
							//console.log(element.name);
							var element = {
								image: element.images.standard_resolution.url
							};
							$(".row").append(imageTemplate(element));
						});
						
					}
					else {
						alert('Looks like you do not have any photos tagged in your current location!');
					}
					
				},
				error: function() {
					alert("Error!");
				}
			});
		};
		function error() {
			alert("Unable to retrieve your location");
		};
		navigator.geolocation.getCurrentPosition(success, error);

		//a way to return lat and lng from a geoFindMe function ??
	});
});