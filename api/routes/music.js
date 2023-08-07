const express = require('express');
const request = require('request'); 
const dotenv = require('dotenv'); 

const port = 5000; 
const app = express();

global.access_token = ''

dotenv.config(); 

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID; 
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:3000/auth/callback"; 

const generateState = (length) => {
    let state = '';
    const keys = "ABCDEFGHIJKLOMNPQRSTUVWXYZabcdefghijklomnpqrstuvwxyz123456789!@#$%^&*()"; 

    for (let i = 0; i < length; i++) {
        state += keys[Math.floor(Math.random() * keys.length)];
    }

    return state 
}

// request authorization token 
app.get('/auth/login', (req, res) => {
    var scope = "streaming user-read-email user-read-private"; 

    // these are the necessary parameters for the request direct 
    var auth_query_parameters = new URLSearchParams({
        response_type: "code", 
        client_id: spotify_client_id, 
        scope: scope, 
        redirect_uri: spotify_redirect_uri, 
        state: generateState(16)
    })

    // returns a code and state for the next request for the access token 
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()); 
}); 

// request access token with the response from the authorization token  
app.get('/auth/callback', (req, res) => {
    // from the previous request 
    var code = req.query.code; 

    // parameters needed for the access token request 
    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code, 
            redirect_uri: spotify_redirect_uri,
            grant_type: "authorization_code"
        }, 
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64')), 
            'Content-Type' : 'application/x-www-form-urlencoded'
        }, 
        json: true
    };

    // on response it will return the access token and you can direct to the root 
    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token; 
            res.redirect('/'); 
        }
    })
});

app.get('/refresh_token', (req, res) => {
    var refresh_token = req.query.refresh_token; 
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token', 
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ":" + client_secret).toString('base64')) }, 
        form: {
            grant_type: 'refresh_token', 
            refresh_token: refresh_token
        }, 
        json: true 
    }

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token; 
            res.send({ 'access_token': access_token })
        }
    })
})

// returns access token from the request as json to the /auth/token endpoint 
// which will allow us to start the music player and make API calls and retrieve important data 
app.get('/auth/token', (req, res) => {
    res.json({access_token: access_token})
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
}); 