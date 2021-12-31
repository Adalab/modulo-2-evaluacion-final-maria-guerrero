'use strict';

const formElement = document.querySelector('.js-form');
const seriesList = document.querySelector('.js-series-list');
const favoriteList = document.querySelector('.js-favorite-list');
const searchBtn = document.querySelector('.js-search');
const resetBtn = document.querySelector('.js-reset-btn');
// GUARDAMOS LAS SERIES EN UN ARRAY
let series = [];
// GUARDAMOS LAS SERIES FAVORITAS EN UN ARRAY
let favorites = [];

// 1. OBTENEMOS LOS DATOS DEL API Y LO METEMOS EN UNA FUNCIÓN
let inputValue = document.querySelector('.js-input');

function getApiData() {

    let inputValueEl = inputValue.value;
    // let inputValueEl = 'Nadja';

    fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValueEl}`).then(response => response.json())
    .then(data => {
        series = data.results;
        paintSeries();
        
    });
};

// 2. PINTAMOS LAS SERIES
function getSeriesHtmlCode(serie){

    let htmlCode = '';
    htmlCode += `<li class="js-list listStyle" data-id="${serie.mal_id}">`;
    htmlCode += `<img class="serie_image" src="${serie.image_url}" alt="serie"`;
    htmlCode += `<h3 class="serie_name">${serie.title}</h3>`;
    htmlCode += `</li>`;
    return htmlCode; 
};

//////// con esta función, se recorre todas las series con un bucle. Y por cada serie que pasa, pinta la función getSeriesHtmlCode
const paintSeries = () =>{
    let seriesCode = '';
    for (const serie of series){
        seriesCode += getSeriesHtmlCode(serie);
    }
    seriesList.innerHTML = seriesCode;
    listenAddSeries(); // <-- Llamamos la función de abajo
};

// 3. ESCUCHAMOS EL CLICK SOBRE LOS ELEMENTOS DE LA BÚSQUEDA DE RESULTADOS.
function listenAddSeries() {
    const seriesClick = document.querySelectorAll('.js-list');
    // Hacemos un addEventListener a cada uno de los elementos
    for (const serieClick of seriesClick) {
        serieClick.addEventListener('click', addSerie);
    }
};

// 4. IDENTIFICAMOS CUAL ES EL ELEMENTO CLICKADO
function addSerie(ev) {
    const clickId = parseInt(ev.currentTarget.dataset.id);
    // Vemos si la serie está ya en favoritos
    let foundItem;
    for (const item of favorites) { // <-- recorremos todos los favoritos
        if(item.mal_id === clickId) { 
            foundItem = item;
        }      
    }
    
    if(foundItem === undefined) {
        // 1. buscamos en el array cual es el elemento que coincide con el id que hemos clickado, iterando:
        let foundSerie;
        for (const serie of series) {
            if(serie.mal_id === clickId) { // <-- si el id de la serie, es igual al id del que he clikado, entonces:
                foundSerie = serie; // <-- Guardamos la serie en la serie encontrada
            }      
        }

    // Y pusheamos en favoritos las series encontradas
    favorites.push({
        mal_id: foundSerie.mal_id,
        image_url: foundSerie.image_url,
        title: foundSerie.title
    });
} 
    paintFavoriteItems(); // <-- lanzamos la función de abajo
};

// 5. PINTAMOS LOS ELEMENTOS EN FAVORITOS
//////// primero creamos el código de la lista
function getFavoriteHtmlCode(item) {

    let htmlCode = '';
    htmlCode += `<li class="js-favorites favoritesListStyle">`;
    htmlCode += `<img class="serie_image_favs" src="${item.image_url}"`;
    htmlCode += `<h3 class="serie_name">${item.title}</h3>`;
    htmlCode += '</li>';
    return htmlCode;
};

//////// aquí creamos una función que pintará la función getFavoriteHtmlCode
function paintFavoriteItems() {
    favoriteList.innerHTML = ''; // <-- limpiamos para que no se dupliquen los elementos
    for (const item of favorites) {
        favoriteList.innerHTML += getFavoriteHtmlCode(item);
    }
};

// 6. HACEMOS QUE EL BOTÓN DE RESET FUNCIONE
function resetActiveBtn(event) {
    event.preventDefault();
    if(resetBtn.value === true) {
        favoriteList.innerHTML = '';
    }
}

// ARRANCAMOS LA APP
getApiData();

// CREAMOS EL EVENTO
searchBtn.addEventListener('click', getApiData);
resetBtn.addEventListener('click', resetActiveBtn);