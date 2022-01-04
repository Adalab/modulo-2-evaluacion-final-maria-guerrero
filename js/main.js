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

function getApiData(ev) {
    ev.preventDefault();

    let inputValueEl = inputValue.value;

    fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValueEl}`).then(response => response.json())
    .then(data => {
        series = data.results;
        paintSeries();
        
    });
};

// 2. PINTAMOS LAS SERIES
function getSeriesHtmlCode(serie){

    let foundItem;
    // Hacemos un bucle para que compare el id de item(favoritos) con el id de las series, para después, abajo, hacer un if que añada o quite la clase clickBorderActive en función de si foundItem es undefined o no
    for (const item of favorites) { 
        if(item.mal_id === serie.mal_id) {
            foundItem = item;
        }      
    }

    let htmlCode = '';
    if(foundItem === undefined) {
        htmlCode += `<li class="js-list listStyle" data-id="${serie.mal_id}">`;
    } else {
        htmlCode += `<li class="js-list listStyle clickedBorderActive" data-id="${serie.mal_id}">`;
    }
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
        if(item.mal_id === clickId) { //<-- si el id del item, es igual al id que he clickado, entonces:
            foundItem = item; // <-- Guardamos el item en foundItem
        }      
    }
    
    if(foundItem === undefined) {
        console.log('añadimos a favoritos');
        // Con esta línea añade el borde al hacer click a la serie que queremos en favoritos:
        ev.currentTarget.classList.add('clickedBorderActive');

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
    console.log(favorites);
} else { // <-- Aquí quitamos la clase clickedBorderActive al volver a seleccionar la serie
    console.log('sacamos de favoritos');
    ev.currentTarget.classList.remove('clickedBorderActive');
    const removeSerieFavBorder = favorites.indexOf(foundItem);
    favorites.splice(removeSerieFavBorder, 1);
}
    setLocalStorage();
    paintFavoriteItems();
};

// 5. PINTAMOS LOS ELEMENTOS EN FAVORITOS
//////// primero creamos el código de la lista
function getFavoriteHtmlCode(item) {

    let htmlCode = '';
    htmlCode += `<li class="js-favorites favoritesListStyle">`;
    htmlCode += `<div class="divImageEquis">`;
    htmlCode += `<img class="serie_image_favs" src="${item.image_url}">`;
    htmlCode += `<button class="js-equis-icon equisIcon" data-id="${item.mal_id}">x</button>`;
    htmlCode += `</div>`;
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
    equisBtn();
};

// 6. GUARDAMOS EN EL LOCAL STORAGE
function getLocalStorage() {
    const localStorageFavorites = localStorage.getItem('favorites');
    if(localStorageFavorites !== null) {
        favorites = JSON.parse(localStorageFavorites);
        paintFavoriteItems();
    }
}

function setLocalStorage() {
    const stringifyFavorites = JSON.stringify(favorites);
    localStorage.setItem('favorites', stringifyFavorites);
};

getLocalStorage();

// 7. HACEMOS QUE EL BOTÓN DE RESET FUNCIONE
function resetActiveBtn() {
    favorites = [];

    // setLocalStorage();
    paintSeries();
    paintFavoriteItems();
}

// 8. HACEMOS QUE EL BOTON 'X' ELIMINE FAVORITOS INDIVIDUALMENTE
function equisBtn() {
    const btnEquisButton = document.querySelectorAll('.js-equis-icon');

    for(const eachEquis of btnEquisButton) {
        eachEquis.addEventListener('click', clickRemoveItem);
    }
}

function clickRemoveItem(event) {
    //////// seleccionamos el id para resetear un elemento de favoritos:
    const clickResetFavoriteId = parseInt(event.currentTarget.dataset.id);
    //////// buscamos el id para resetear favoritos:
    const findItemId = favorites.findIndex((eachFavorite) => eachFavorite.mal_id === clickResetFavoriteId);

    /////// buscamos la posición del id para eliminar el elemento seleccionado de favoritos
    //const findPositionId = favorites.indexOf(findItemId);

    /////// eliminamos el elemento seleccionado
    favorites.splice(findItemId, 1);

    setLocalStorage();
    paintFavoriteItems();
    paintSeries();
}

// CREAMOS LOS EVENTOS
formElement.addEventListener('submit', getApiData);
searchBtn.addEventListener('click', getApiData);
resetBtn.addEventListener('click', resetActiveBtn);