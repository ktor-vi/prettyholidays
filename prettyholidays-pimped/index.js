#!/usr/bin/node


// Requires :
const axios = require('axios');
const {
  getCode,
  getNameList
} = require('country-list');
const ora = require('ora');
const chalk = require('chalk');
const figlet = require('figlet');

const chalklet = require('chalklet');


//Figlet Title
console.log(chalk.rgb(0, 238, 255)(figlet.textSync('Pretty\nHolidays!', {
  font: 'Doom',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})));
//Say hello :
console.log((`\nGood evening ! Welcome to prettyholidays!\n`));

//Affect variables - best method
let country = process.argv[2]
let year = process.argv[3]

//User-side verification (Case-sensitivity)
if (year == undefined) {
  year = 2019;
} else {
  year.toLowerCase();
}
if (country == "") {
  console.log("Please enter a country...")
  console.log("I can't guess it, I'm just a program you know...");
  process.exit();
}

//User-side verification (Existing country)
const countryArray = Object.keys(getNameList());

if (countryArray.includes(country) == false) {
  console.log(`Honey, "${country}" is not a country...`);
  process.exit();
}

console.log(`Okay I found your country, ${country} is indeed a nice place.`)
console.log("Now let's find the holidays, shall we ?")

const countryCode = getCode(country);

const spinner = ora('Loading Mojitos\n').start();
axios.get(`https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`)

  .then(function(response) {
    showHolidays(response.data)
    nbrHolidays = getNbrHolidays(response.data)
    console.log(`\nDuring the year ${year} there are ${nbrHolidays} holidays in ${country}.`)
  })
  .catch(function(error) {
    showErrors(error);
  })
  .then(function() {
    spinner.stop();

  });

//FUNCTIONS :
function showHolidays(jsonList) {
  jsonList.forEach((item, index) => {
    let h = getHslRainbowColorsPerIndex(index);
    // console.log(h);
    console.log(chalk.hsl(h, 100, 50)(`${index + 1} : ${item.date} - ${item.name} (${item.localName})`));
  });
}

function getNbrHolidays(jsonList) {
  return jsonList.length;
}

function showErrors(error) {
  console.log(`Mistakes were made - Error ${error.response.status}: ${error.response.statusText}`)
}

function getHslRainbowColorsPerIndex(index) {
  let h = (index) % 12 * 30;
  return h;

}
