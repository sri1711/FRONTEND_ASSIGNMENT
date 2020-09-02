window.addEventListener("load",function(){
		document.querySelector("#button").addEventListener("click",function(){
		document.querySelector("#content").style.top = "0%";
		queryString = document.getElementById("search_string").value;

		queryString&&searchQuery(queryString);	
	})
});

var queryString = "";

function clickhandler(){
	queryString = queryString + document.querySelector("#query").value;
	queryString&&searchQuery();	
}

async function searchQuery(){
	var api = "c378b904df4aaa181324b1b950ff74cc";
	var results;
	
	await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api}&query= ${queryString}`)
	.then(response => response.json())
	.then(data => results = data);
	console.log(results);
	sort(results);
	top3(results);
}

function sort(results){
	results.results.sort(function(a,b){
		return a.popularity - b.popularity;
	});

}

function sort_top_in_page(results){
	results.sort(function(a,b){
		return b.popularity - a.popularity;
	});
}

async function top3(results){
	var result_in_all_page = new Array();
	var api = "c378b904df4aaa181324b1b950ff74cc";
	for(var i=1;i<=results.total_pages;i++){
		await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api}&query= ${queryString}&sort_by=popularity.asc&page=${i}`)
		.then(response => response.json())
		.then(data => res = data);
		sort(res);
		console.log(res);
		for(var k =0 ;k<res.results.length;k++){
			result_in_all_page.push(res.results[k]);
		}
	}
	sort_top_in_page(result_in_all_page );
	var top3 = new Array();
	var j = 0;
	while((result_in_all_page .length - j > 0) && j < 3){
		top3.push(result_in_all_page [j]);
		j++;
	}
	console.log(top3);
	display(top3);
}

var last_display;

function display(results){

	for(var i = 0 ; i < results.length ; i++){
		
		var div = document.getElementById(`result${i+1}`);
		var image_path = results[i].poster_path;
		
		
		if(image_path != null){
			var imagex =`https://image.tmdb.org/t/p/w185${image_path}`;
			div.innerHTML = `<img src=${imagex}>`
		}
		else{
			var imagey =`./no-image-available-png-3.png`
			div.innerHTML = `<img id="IMAGE" src=${imagey} width= "185"  >`
		}
		
		div.innerHTML +=`<div id="TITLE">${results[i].original_title}(${results[i].title}) </div> ` 

		div.innerHTML += `<div id="SYNOPSIS"> ${results[i].overview} </div>`;
  		
  		div.innerHTML += `<div id="RELEASE DATE"> ${results[i].release_date}</div>`;


	}
	
	////To remove  unwanted images on next iteration

	var balance_length = last_display - results.length;
	if(balance_length > 0 && last_display != undefined){
		console.log('yes');
		for(i=balance_length -1 ;i<last_display;i++){
			console.log('yes yes');
			var div = document.getElementById(`result${i+1}`);
				div.innerHTML = "";
		}
	}
	last_display = results.length;

}

