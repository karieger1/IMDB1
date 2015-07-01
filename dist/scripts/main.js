$(document).ready(function() {
	var Pages = Backbone.Router.extend ({

		routes: {
			"": "home",
			"home": "home",
			"search/:query": "search"
		},

		home: function() {
			$(".page").hide();
			$("#home").show();
			$("#display-results").html("");
		},

		search: function(query) {
			$(".page").hide();
			$("#search").show();
		}
	});

	var myRouter = new Pages();
	Backbone.history.start();

	$("#search-form").on("submit", function(e) {
		var movieObj = {};
		e.preventDefault();

		var query = $("#query").val();
	
		myRouter.navigate("search/"+query, {trigger: true});
		$.get(
			"http://www.omdbapi.com/",
			{
				s: $("#query").val(),
				type: "movie"
			},
			getMovies,
			"json"
			);
	});


	$("#go-back").on("click", function(e) {
		myRouter.navigate("home", {trigger: true});

		$("#query").val("");
	});


	function getMovies(movies) {
		var movieArray = [];
		console.log(movies);
		$("#display-results").html("");

		for (var i = 0; i<movies.Search.length; i++) {
			movieArray.push(movies.Search[i].imdbID);	

		}

		// console.log(movieArray);

		for (var i = 0; i<movieArray.length; i++) {
			$.get("http://www.omdbapi.com/",
				{
					i: movieArray[i]
				},
				moviePosters,
				"json"
				);
		}

	}

	function moviePosters(movies) {

		return $("#display-results").append("<img src="+movies.Poster+">");
	}

	var savedMovies = [];

	$("#display-results").on("click", function(e) {
		var $clicked = $(e.target);
		savedMovies.push($clicked);

		return $("#watch-list").append(savedMovies);

	})

	$("#clear").on("click", function(e) {
		savedMovies = [];
		$("#watch-list").html("");

	});


});