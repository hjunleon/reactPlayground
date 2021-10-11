//https://www.quod.ai/post/how-to-integrate-google-api-into-your-react-app

import { listThreads } from "./GmailAPIs";

export const loadGoogleScript = () => {
  // Loads the Google JavaScript Library
  (function () {
    const id = "google-js";
    const src = "https://apis.google.com/js/platform.js"; // (Ref. 1)

    // We have at least one script (React)
    const firstJs = document.getElementsByTagName("script")[0]; // (Ref. 2)

    console.log("firstJs");
    console.log(firstJs);

    // Prevent script from loading twice
    if (document.getElementById(id)) {
      return;
    } // (Ref. 3)
    const js = document.createElement("script"); // (Ref. 4)
    js.id = id;
    js.src = src;
    js.onload = window.onGoogleScriptLoad; // (Ref. 5)
    firstJs.parentNode.insertBefore(js, firstJs);
  })();
};
//const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// Client ID and API key from the Developer Console
var CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "";
console.log(CLIENT_ID);
var API_KEY = ""; //'AIzaSyDey5ZAN7LkdwY7plFwLbbsLe7bZ-coo-w';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
]; //,"https://gmail.googleapis.com/gmail/v1/users/hjunleon/messages"

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.metadata",
];
SCOPES = SCOPES.join(" ");
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export async function initClient() {
  // this can be common function for all API calls to google. Must run  this function tocall getAuthInstance()
  let gapi = window.gapi;
  //console.log(gapi)

  return await gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        //console.log(gapi.auth2.getAuthInstance())
        console.log(gapi);
        let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get(); //.listen(updateSigninStatus);
        console.log(isSignedIn);
        if (isSignedIn == undefined || !isSignedIn) {
          gapi.auth2.getAuthInstance().signIn();
          return gapi.auth2.getAuthInstance().isSignedIn.get();
        }
        return isSignedIn;

        if (isSignedIn) {
          listThreads();
        }
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}
