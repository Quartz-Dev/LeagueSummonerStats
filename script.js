const apigetSummonerId = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
const apikey = "api_key=03e76ce4-0e39-4501-9244-b2194ac146a7"
const fs = require("fs");

function getSummonerId(summoner){

  var formatsummonername = summoner.toLowerCase().replace(/\W*/g, "");

  fetch(apigetSummonerId + summoner + "?" + apikey)
  .then(

    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
        return;
      }
      response.json().then(function(data) {

        console.log(data);
        console.log(data[formatsummonername].id);

        summonerid = data[formatsummonername].id;

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
      });
    }
  ).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

  return summonerid;
}

function apply(){

  var id = getSummonerId(document.getElementById("summoner").value);

}
