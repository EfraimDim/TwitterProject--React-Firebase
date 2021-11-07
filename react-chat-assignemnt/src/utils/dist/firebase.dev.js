"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = firebase;

var _app = require("firebase/app");

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCcUGkBU04jpyN0rMKxJvV7Og4ELpQCy6M",
  authDomain: "twitter-react-project.firebaseapp.com",
  projectId: "twitter-react-project",
  storageBucket: "twitter-react-project.appspot.com",
  messagingSenderId: "507208774657",
  appId: "1:507208774657:web:5526f56907d4afc7e3fc00"
}; // Initialize Firebase

var app = (0, _app.initializeApp)(firebaseConfig);

function firebase() {
  return;
}