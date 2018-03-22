require('dotenv').config();
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');

var Spotify = require('node-spotify-api');


var command = process.argv[2];
var input = process.argv.slice(3);
var inputs = input.join(" ");


switch (command) {
    case 'my-tweets':        
        twitter();
        break;
    case 'spotify-this-song':
        spotify();
        break;
    case 'movie-this':
        imdb();
        break;
    case 'do-what-it-says':
        readRandom();
        break;
    default:
        break;
}

function twitter() {
    var client = new Twitter(keys.twitter);
    var user = {
        screen_name: 'Nakizon',
        count: 20,
        result_type: 'recent'
    }
    client.get('statuses/user_timeline', user, function(err, tweets, response) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        for (var i = 0; i < tweets.length; i++) {
            var results = tweets[i].text + '\n';
            logResults(results);
        }
    })
}

function spotify() {
    var spotify = new Spotify(keys.spotify);
    if (inputs === '') {
        inputs = 'The Sign Ace of Base'
    }
    spotify.search({type: 'track', query: inputs, limit: 1}, function(err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        var song = data.tracks.items[0];
        var results = 'Artist: ' + song.artists[0].name + '\nSong: ' + song.name
        + '\nURL: ' + song.preview_url + '\nAlbum: ' + song.album.name + '\n';
        logResults(results);
    }
    )
}

function imdb() {
    if (inputs === '') {
        inputs = 'Mr. Nobody'
    }
    var queryUrl = 'http://www.omdbapi.com/?t=' + inputs + '&y=&plot=short&apikey=trilogy';
    request(queryUrl, function(err, res, body) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        if (!err && res.statusCode === 200) {
            var movie = JSON.parse(body);
            var results = 'Title: ' + movie.Title + '\nRelease Year: ' + movie.Year 
            + '\nIMDB Rating: ' + movie.imdbRating + '\nRotten Tomatoes Rating: ' + movie.Metascore
            + '\nProduced by: ' + movie.Production + '\nLanguage: ' + movie.Language
            + '\nPlot: ' + movie.Plot + '\nActors: ' + movie.Actors + '\n';
            logResults(results);
          }
    })
}

function readRandom() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        var dataArr = data.split(',');
        inputs = dataArr[1];
        spotify();
    })
}

function logResults(log) {
    fs.appendFile('log.txt', log, function(err) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        console.log(log);
        console.log('log.txt has been updated');
    })
}