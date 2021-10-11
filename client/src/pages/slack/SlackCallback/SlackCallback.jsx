import "./SlackCallback.scss";
import Topbar from "../../../components/topbar/Topbar";
import SearchBar from "../../../components/searchBar/SearchBar";
import ProfilePicCircle from "../../../components/profilePicCircle/profilePicCircle";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { getDefaultTime } from "../../../lib/uiUtils";
import {
  Search,
  Person,
  Chat,
  Notifications,
  Email,
  Menu,
  Settings,
  Inbox,
  Close,
} from "@material-ui/icons";

let slackScopes = [];
const CLIENT_ID = "261563897047.2551911311360";
const redirect_uri = "https://localhost:8888";
const scope = ["incoming-webhook", "commands"];

let AUTH_CODE = sessionStorage.getItem("slackAuthCode") || "";
export default function SlackCallback() {
  console.log("SlackCallback")
  const history = useHistory();

  const getCode = () => {
    console.log(window.location);
    let url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get("code");
    console.log("code ", c);
    console.log("AUTH_CODE ", AUTH_CODE);
    AUTH_CODE = c;
    if (c != null && c.length != 0) {
      //setTimeout(()=>{window.location.replace("http://localhost:8000")},500)
      //window.location.assign("http://127.0.0.1:8000")
      //history.replaceState(null,"MIAO","http://localhost:8080")
      console.log("Found code");
      console.log(c);
      AUTH_CODE = c;
      sessionStorage.setItem("slackAuthCode", AUTH_CODE); //https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
      //window.location.assign = "http://127.0.0.1:8000"

      // Note, this means u can go backwards and get the auth code
      // https://www.30secondsofcode.org/articles/s/javascript-modify-url-without-reload
      // window.history.pushState({}, "", "http://127.0.0.1:8000"); //https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
      // window.history.replaceState({}, "", "http://127.0.0.1:8000");
      postAuthCode(AUTH_CODE);
    }
  }

  const postAuthCode = async (authCode) => {
    let authCodeParam = { code: authCode };
    try {
      const res = await axios.post("/slack/receiveAuthCode", authCodeParam);
      // FOr react, useHistory
      setTimeout(() => {
        history.push("/slack");
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  getCode();
  return (
    <div>
      Redirecting back to Azzrio
      <div>RIGHT NOW</div>
    </div>
  );
}
