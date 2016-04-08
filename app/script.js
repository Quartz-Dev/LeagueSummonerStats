'use strict';

const API_URLS = {
  GET_SUMMONER_ID: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'
};
const API_KEY = "03e76ce4-0e39-4501-9244-b2194ac146a7";

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
      for (var i = 0; i < this.summoners.length; i++) {
        summoner = this.summoners[i];
        if(summoner.name == this.newSummonerInput) {
          alert("Errror: Already Exists!")
          return;
        }
      }
      if (this.newSummonerInput == "") {
        return;
      }
      this.summoners.push({
        name: this.newSummonerInput
      });
      this.newSummonerInput = '';
    }
  },

  ready: function() {
    this.summoners.push(
      { name: 'Bobby', id: 0},
      { name: 'Jimmy', id: 0},
      { name: 'Lizzy', id: 0},
      { name: 'Richa', id: 0},
      { name: 'Derek', id: 0}
    );
  }


});

/**
 * Activates the selected summoner, updating the information on the screen and
 * in the output files
 */
function apply(){

  var id = getSummonerId(document.getElementById("summoner").value);

}

/**
 * Returns the summoner's id stored in League's servers
 *
 * @param summoner The summoner's name
 */
function getSummonerId(summoner){

  var formatsummonername = summoner.toLowerCase().replace(/\W*/g, "");

  fetch(API_URLS['GET_SUMMONER_ID'] + summoner + "?api_key=" + API_KEY)
  .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
        return;
      }
      response.json().then(function(data) {

        var summonerid = data[formatsummonername].id;

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

        //return summonerid;
      });
    }
  ).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}
//
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();
menu.append(new MenuItem({ label: 'Remove', click: function(e) {
  console.log(e.target.innerHTML);
} }));

window.addEventListener('contextmenu', function (e) {
  if(e.target.matches('li')){
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  }
},
false);
