const selector = document.getElementById('myMovie');
const myKey = prompt('Hello ! :) Entre ta clé API ici stp :');
const urlOrigin = 'http://www.omdbapi.com/?apikey=' + myKey + '&s=';

async function showMoviesList(selector, poster, name, year, imdbID) {
	selector.innerHTML += `
		<div class="d-flex row border rounded border-info mb-3">
			<img class="img-thumbnail m-3" style="max-width: 8rem;" src="${poster}">
			<div class="card-body text-info">
				<h1 class="card-title">${name}</h1>
				<p class="card-text">${year}</p>
				<button id="myBtn" type="button" class="btn btn-outline-info" onclick="return getMore('${imdbID}')">Read More</button>
			</div>
		</div>
	`;
};

async function getMoviesList(selector, urlOrigin) {
	const userResearch = document.getElementById('myResearch').value;
	const url = urlOrigin + userResearch;
	selector.innerHTML = '';
	fetch(url)
		.then((response) => response.json())
		// .then((response) => document.getElementById('message').innerHTML = response.Search.length)
		.then((response) => {
			response.Search.forEach((e) => {
				showMoviesList(
					selector,
					e.Poster,
					e.Title,
					e.Year,
					e.imdbID
				);
			})
		})	
		.then(() => addIntersectionObserver())
		.catch((error) => console.error('Houston, we have a problem :', error))
    ;
};

const getMore = (imdbID) => {
	let url = "https://www.omdbapi.com/?i=" + imdbID + "&apikey=" + myKey;
	fetch(url)
		.then((response) => response.json())
		.then((response) => showMore(response))
		.catch((error) => console.error(error));
};

const showMore = (movie) => {
	let modal = document.getElementById("myModal");
	let span = document.getElementsByClassName("close")[0];

	modal.style.display = "block";

	let content = document.getElementsByClassName("content")[0];
	content.innerHTML = `
		<div class="d-flex row mb-3">
			<img class="img-thumbnail m-3" style="max-width: 8rem;" src="${movie.Poster}">
			<div class="card-body text-info">
				<h1 class="card-title">${movie.Title}</h1>
				<p class="card-text">${movie.Year}</p>
				<p class="card-text">${movie.Plot}</p>
			</div>
		</div>
	`;

	span.onclick = function() {
		modal.style.display = "none";
	}

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		};
	};
};

const addIntersectionObserver = () => {
	let observer = new IntersectionObserver(function (observables) {
		observables.forEach(function (observable) {
			if (observable.intersectionRatio > 0.5) {
				observable.target.classList.remove('not-visible')
				// observer.unobserve(observable.target)
				console.log('Item visible')
			} else {
				observable.target.classList.add('not-visible')
			}
		})
	}, {
		threshold: [0.5]

	})

	let items = document.querySelectorAll('.row')
	items.forEach(function (item) {
		item.classList.add('not-visible')
		observer.observe(item)
	})
};

document.getElementById('mySubmit').addEventListener('click', (e) => {
	e.preventDefault();
	getMoviesList(selector, urlOrigin);
});