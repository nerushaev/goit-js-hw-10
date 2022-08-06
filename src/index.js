import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const listCountryEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

inputEl.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));

function onInputHandler(event) {
  clearOutputData();
  const value = event.target.value.trim();
  if (value.length === 0) {
    return;
  }
  findCountries(value);
}

function clearOutputData() {
  listCountryEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
  listCountryEl.style.fontSize = '';
}

function findCountries(name) {
  fetchCountries(name).then(checkNumberCountries).catch(fetchError);
}

function checkNumberCountries(data) {
  console.log('пошук країн =', data.length);
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  renderFiltersCountry(data);
}

function fetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function renderFiltersCountry(data) {
  renderCountryData(data);
  if (data.length === 1) {
    renderInfoCountry(data[0]);
    listCountryEl.style.fontSize = '24px';
  }
}

function renderCountryData(data) {
  const countryData = data.map(elem => {
    return `<li> <img src="${elem.flags.svg}"> <p>${elem.name}</p> </li>`;
  });
  listCountryEl.insertAdjacentHTML('beforeend', countryData.join(''));
}

function renderInfoCountry(data) {
  const languagesCountry = data.languages
    .map(language => language.name)
    .join(', ');
  const infoCountry = `<p><b>Capital:</b> ${data.capital}</p>
    <p><b>Population:</b> ${data.population}</p>
    <p><b>Languages:</b> ${languagesCountry}`;
  countryInfoEl.innerHTML = infoCountry;
}