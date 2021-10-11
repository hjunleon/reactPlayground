import "./Zoom.scss";
import Topbar from "../../components/topbar/Topbar";
import SearchBar from "../../components/searchBar/SearchBar";
import ProfilePicCircle from "../../components/profilePicCircle/profilePicCircle";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

import { getDefaultTime } from "../../lib/uiUtils";
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

let CLIENT_ID = "K1lAIvYdSX69TYPbSXiMQ";
let REDIRECT_URL = "http://localhost:3000/zoom/callback";
let AUTH_CODE = ""
const scope = ["incoming-webhook", "commands"];
const OAUTH_AUTH_CODE_URL =
  "https://zoom.us/oauth/authorize?response_type=code&client_id=K1lAIvYdSX69TYPbSXiMQ&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fzoom%2Fcallback";
const ZOOM_SERVER_URL = "http://localhost:4000";
const MY_REDIRECT_URL = "http://localhost:3000/zoom";

export default function Zoom() {
  const [isPoppedUp, setPopUp] = useState(false);
  const [slackAction, setSlackAction] = useState(null);
  const [searchbarInput, setSearchBarInput] = useState("");
  const [zoomData, setZoomData] = useState(null);
  const [authCode, setAuthCode] = useState("");

  let slackData = new Map([
    [
      "convoList",
      [
        {
          title: "test",
        },
      ],
    ],
    ["yourId", null],
  ]);
  console.log("slackData: ");
  console.log(slackData);

  const getCode = () => {
    console.log(window.location);
    let url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get("code");
    console.log("code ", c);
    if (c != null && c.length != 0) {
      //setTimeout(()=>{window.location.replace("http://localhost:8000")},500)
      //window.location.assign("http://127.0.0.1:8000")
      //history.replaceState(null,"MIAO","http://localhost:8080")
      console.log("Found code");
      console.log(c);
      setAuthCode(c);
      AUTH_CODE = c
      console.log("AUTH_CODE ", AUTH_CODE);
      sessionStorage.setItem("zoomAuthCode", AUTH_CODE); //https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
      //window.location.assign = "http://127.0.0.1:8000"

      // Note, this means u can go backwards and get the auth code
      // https://www.30secondsofcode.org/articles/s/javascript-modify-url-without-reload
        window.history.pushState({}, "", MY_REDIRECT_URL); //https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
        window.history.replaceState({}, "", MY_REDIRECT_URL);
    } else {
      // window.location.href = OAUTH_AUTH_CODE_URL; // will lead to circular loop
    }
  };
  //   if (sessionStorage.getItem("zoomAuthCode")){
  //     setAuthCode(sessionStorage.getItem("zoomAuthCode"))
  //   } else {
  //     authMe()
  //     getCode();
  //   }

  getCode();
  const authMe = () => {
    // let oauthUrl = encodeURI(`https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${scope.join(',')}&redirect_uri=${redirect_uri}`)
    // console.log(oauthUrl)
    window.location.href = OAUTH_AUTH_CODE_URL;
  };

  const getAccessToken = async () => {
    console.log(`AUTH_CODE: ${AUTH_CODE}`);
    console.log(`authCode: ${authCode}`)
    console.log(sessionStorage.getItem("zoomAuthCode"))
    if (AUTH_CODE && AUTH_CODE.length == 0){
        AUTH_CODE = sessionStorage.getItem("zoomAuthCode")
    }
    const res = await axios
      .get(`${ZOOM_SERVER_URL}?code=${AUTH_CODE}`)
      .then((res) => {
        console.log("success =========", res);
        setZoomData(res.data)
      })
      .catch((err) => {
        console.log("Error ========>", err);
      });
    console.log(res);
  };

  // UI =======================

  const popup = (e) => {
    console.log(e);
    let action = e.target.dataset.action;
    setSlackAction(action);
    setPopUp(true);
  };

  const ConvoListItem = (listData) => {
    let { title } = listData
      ? listData
      : {
          title: "empty",
        };
    return <div>{title}</div>;
  };

  (() => {
    slackData.set("convoList", [
      {
        title: 1,
      },
      {
        title: 2,
      },
      {
        title: 3,
      },
    ]);

    //getConvoList()
  })();

  const RenderConvoList = () => {
    return (
      <div className="convoList">
        {slackData.get("convoList").map((p, index) => (
          <ConvoListItem key={index} title={p.title} />
        ))}
      </div>
    );
  };

  useEffect(() => {});

  const receiveSearchBarInput = (e) => {
    console.log(e);
    setSearchBarInput(e);
  };

  return (
    <>
      <Topbar />
      <div onClick={authMe} data-action="authMe" className="slackBtn">
        Auth
      </div>
      <div
        onClick={getAccessToken}
        data-action="grantAccess"
        className="slackBtn"
      >
        Acess Token
      </div>
      <div onClick={popup} data-action="inviteItem" className="slackBtn">
        Invite peeps
      </div>

      {zoomData && (<div dangerouslySetInnerHTML={{ __html: zoomData }} />)}
      {isPoppedUp && (
        <div className="overlay">
          <div className="popupModal">
            <div className="popupModal__Top">
              <div>Invite members by email</div>
              <Close />
            </div>
            <SearchBar onSearchBarInput={receiveSearchBarInput} />
            <div className="popupModal__Content">
              <RenderConvoList />
            </div>
            <div className="popupModal__Bottom">
              <div onClick={popup} data-action="save" className="slackBtn">
                Save
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
