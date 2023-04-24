
/* 
// 1.вводити текст в текстове поле
// 2.Застосувати прийом на обробку подій і робити запит через 300мс після того як користувач перестав вводити текст
// 3.Якщо користувач повністю очищає поле пошуку то HTTP запит не виконуєтся, а розмітка списку країн зникає
// 4.Санітізація введеного рядка методм трім (прибирає пробіли)
// 5. якщо виводить більше ніж 10 країн, назва має бути більш специфічна
// 6. якщо бекенд повернув від 2 до 10 країн то кожен елемент складається з прапору та назви каїни
// 7.якщо результат це масив з 1 країною то відображається то відобраєа
// ться : прапор , назва , столиця  , населення і мови
// 8.якщо введено не існуюючу країну то бекенд поверне помилку 404 - не знайдено
// тому потрібно додати повідомлення про помилку
// 9
*/

/*-------------------------------------------------------*/
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(listEl);
    cleanMarkup(infoEl);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(listEl);
      cleanMarkup(infoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(listEl);
    const markupInfo = createInfoMarkup(data);
    infoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(infoEl);
    const markupList = createListMarkup(data);
    listEl.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));


// import './css/styles.css';
// import fetchCountries from './js/fetchCountries.js';
// import debounce from '../node_modules/lodash.debounce';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const DEBOUNCE_DELAY = 300;

// const refs = {
//   input: document.getElementById('search-box'),
//   ulEl: document.querySelector('.country-list'),
//   divEl: document.querySelector('.country-info'),
// };

// refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// function onInput(evt) {
//   const inputValue = evt.target.value.trim();
//     cleanMarkup(refs.ulEl);
//     cleanMarkup(refs.divEl);
//   if (inputValue != '') {
//     fetchCountries(inputValue)
//         .then(countries => {
//         if (countries.length > 10) {
//           Notify.info(
//             'Too many matches found. Please enter a more specific name.'
//           );
//         cleanMarkup(refs.ulEl);
//           return;
//         }
//         const markupList = countries.reduce(
//           (markup, country) => markup + createMarkupCountry(country),
//           ''
//         );
//         updateCountry(markupList, refs.ulEl);
//         if (countries.length === 1) {
//           const h2El = document.querySelector('.country-title');
//           h2El.classList.add('country-title__biggest');
//           const markupInfo = createMarkupInfoCountry(countries[0]);
//           updateCountry(markupInfo, refs.divEl);
//         } else {
//             cleanMarkup(refs.divEl);
//         }
//       })
//         .catch(error => {
//         if (error.message === '404')
//           Notify.failure('Oops, there is no country with that name');
       
//         onError(error);
//       });
//   }
// }

// function onError(err) {
//     cleanMarkup(refs.divEl);
//     cleanMarkup(refs.ulEl);
//     cleanInput();
//   console.error(err);
// }

// function createMarkupCountry({ name, flags }) {
//   return `
//     <li class="country-item">
//         <img src="${flags.svg}" class="country-img"><h2 class="country-title">${name.official}</h2>
//     </li>
//     `;
// }

// function createMarkupInfoCountry({ capital, population, languages }) {
//   return `
//     <p class="country-text"><b>Capital:</b> ${capital}</p>
//     <p class="country-text"><b>Population:</b> ${population}</p>
//     <p class="country-text"><b>Langueges:</b> ${Object.values(languages).join(
//       ', '
//     )}</p>
//     `;
// }

// function updateCountry(markup, elem) {
//   elem.innerHTML = markup;
// }

// function cleanMarkup(elem) {
//   elem.innerHTML = '';
// }