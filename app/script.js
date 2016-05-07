'use strict';

const API_URLS = {
  GET_SUMMONER_ID: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'
};
const API_KEY = "03e76ce4-0e39-4501-9244-b2194ac146a7";

var Vue = require('Vue');
Vue.use(require('vue-resource'));

const fs = require("fs");

Vue.config.debug = true;

var vm = new Vue({
  el: 'body',

  data: {
    summoners: [],
    selectedSummoner: {},
    newSummonerInput: '',
  },

  methods: {
    addNewSummoner: function() {
      var summoner;

      // Make sure the summoner isn't already there
      for (var i = 0; i < this.summoners.length; i++) {
        summoner = this.summoners[i];
        if(summoner.name == this.newSummonerInput) {
          alert("Errror: Already Exists!")
          return;
        }
      }

      // make sure they actually typed something in
      if (this.newSummonerInput == "") {
        return;
      }

      // Add them to the summoner list
      this.summoners.push({
        name: this.newSummonerInput,
        id: getSummonerId(this.newSummonerInput)
      });

      // Clear the input
      this.newSummonerInput = '';
    }
  },



});

/**
 * Activates the selected summoner, updating the information on the screen and
 * in the output files
 */
function apply(){

  //var id = getSummonerId(document.getElementById("summoner").value);

}

/**
 * Returns the summoner's id stored in League's servers
 *
 * @param summoner The summoner's name
 */
function getSummonerId(summoner){

  var formatsummonername = summoner.toLowerCase().replace(/\W*/g, "");

  var a = fetch(API_URLS['GET_SUMMONER_ID'] + summoner + "?api_key=" + API_KEY)
  .then(status)
  .then(json)
  .then(function(response) {


        var summonerid = response[formatsummonername].id;

        fs.access('profiles.json', fs.F_OK, function(err) {
            if (err) {
                fs.writeFileSync('profiles.json', '[]');
            }
        });

        var profiles = JSON.parse(fs.readFileSync("profiles.json")) || [];

        profiles.push({
          "summoner": summoner,
          "id": summonerid
        });

        fs.writeFile("profiles.json", JSON.stringify(profiles));

        alert(summoner + "'s ID: " + summonerid);

        return summonerid;
      })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  console.log(a);
  return a;

}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}
