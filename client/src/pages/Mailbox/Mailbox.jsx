import "./Mailbox.scss";
import Topbar from "../../components/topbar/Topbar";
import SearchBar from "../../components/searchBar/SearchBar";
import MailAccountMenu from "../../components/mailAccMenu/MailAccMenu";
import ProfilePicCircle from "../../components/profilePicCircle/profilePicCircle";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

import { getDefaultTime } from "../../lib/uiUtils";
import { loadGoogleScript, initClient } from "../../lib/GoogleLogin";

import { listThreads, listMessages } from "../../lib/GmailAPIs";

//import * as dotenv from "dotenv";

import {
  Search,
  Person,
  Chat,
  Notifications,
  Email,
  Menu,
  Settings,
  Inbox,
} from "@material-ui/icons";
//import MenuIcon from '@material-ui/icons/Menu';
//import SettingsIcon from '@material-ui/icons/Settings';

export default function Mailbox() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [gapi, setGapi] = useState();
  const [googleAuth, setGoogleAuth] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const [user, setUser] = useState({});
  const [isMailAccMenuOpen, setMailAccMenu] = useState(true); //false
  const [mails, setMails] = useState([]);
  const [mailNextPageToken, setMailNextPageToken] = useState(null);

  const username = useParams().username;

  const onSuccess = (googleUser) => {
    // (Ref. 7)
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
    setEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
  };

  const onFailure = () => {
    setIsLoggedIn(false);
  };

  const logOut = () => {
    // (Ref. 8)
    (async () => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };

  const renderSigninButton = (_gapi) => {
    // (Ref. 6)
    _gapi.signin2.render("google-signin", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  useEffect(() => {
    console.log("Window.gapi");
    console.log(window.gapi); //expected to be undefined for now
    // Window.gapi is available at this point
    window.onGoogleScriptLoad = () => {
      // (Ref. 1)
      console.log("Google script loaded");
      const _gapi = window.gapi; // (Ref. 2)
      console.log("_gapi");
      console.log(_gapi);
      _gapi.load("client:auth2");
      setGapi(_gapi); //.then(listThreads)
      console.log("Loading client:auth2");
    };
    // Ensure everything is set before loading the script
    loadGoogleScript(); // (Ref. 9)
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    // Don't do useEffect on data heavy apis
    // _gapi = window.gapi; //gapi
    // console.log("LISTING THREADS")
    // listThreads(_gapi)
  });

  const openAccPopup = () => {
    try {
      console.log(isMailAccMenuOpen);
      setMailAccMenu(!isMailAccMenuOpen);
      //axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {
      alert("setMailAccMenu failed");
    }
  };

  const signInGoogle = async () => {
    console.log("SIGNING IN TO GOOGLE");
    console.log(gapi);
    //initClient()
    let hasSignedIn = await initClient(); //gapi.auth2.getAuthInstance().isSignedIn.get()
    console.log("hasSignedIn: ", hasSignedIn);

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
      listMessages(gapi);
    });
    if (!hasSignedIn) {
      gapi.auth2.getAuthInstance().signIn();
    } else {
      console.log("already signed in");
      let messageResult = await listMessages(gapi);
      console.log(messageResult);
      setMailNextPageToken(messageResult["nextPageToken"]);
      setMails(messageResult["messages"]);
    }
  };

  const mailItem = (p) => {
    let subject, sender, snippet, timeReceived;
    snippet = p.snippet;
    timeReceived = getDefaultTime(p.internalDate);
    let headers = p.payload.headers;
    for (let i = 0; i < headers.length; i += 1) {
      if (headers[i].name == "Subject") {
        subject = headers[i].value;
      } else if (headers[i].name == "From") {
        sender = headers[i].value;
      }
    }
    return (
      <div className="mailItem">
        <div>{p.payload.headers[18].value}</div>
        <div>{p.payload.headers[21].value}</div>
        <div>{p.snippet}</div>
        <div>{getDefaultTime(p.internalDate)}</div>
      </div>
    );
  };

  return (
    <>
      <Topbar />
      <div className="Mailbox">
        <div className="mbTopBar">
          <div className="mbTopBar-left">
            <Menu />
            <div>
              <Email />
            </div>
            <SearchBar />
          </div>
          <div className="mbTopBar-right">
            <Settings />
            <div className="activeProfilePic" onClick={openAccPopup}>
              <ProfilePicCircle
                user={{
                  username: "carmen",
                }}
              />
              {isMailAccMenuOpen && <MailAccountMenu />}
            </div>
          </div>
        </div>
        <div className="mbMain">
          <div className="mbSideBar">
            <div className="composeWrap">
              <div className="composeBtn">+ Compose</div>
            </div>
            <div className="mbSections">
              <div className="mbSectionItem">
                <div>
                  <Inbox />
                  Inbox
                </div>
                <div>16,097</div>
              </div>
            </div>
          </div>
          <div className="mbContentWrap">
            <div className="mbContentWrap__secondBar">
              <div className="mbContentWrap__secondBar-left">
                <div className="selectorWrap">
                  <span
                    className="selectorCheckbox"
                    aria-checked="false"
                    role="checkbox"
                    style={{ userSelect: "none" }}
                    dir="ltr"
                  >
                    <div class="checkmark" role="presentation"></div>
                  </span>
                  <div class="dropdown" aria-hidden="true">
                    &nbsp;
                  </div>
                </div>

                <Inbox />
                <Inbox />
                <Inbox />
              </div>
              <div className="mbContentWrap__secondBar-right"></div>
            </div>

            <div className="mbContentWrap__filterBar">
              <div className="mbContentWrap__filter active">
                <Inbox />
                <div>Inbox</div>
              </div>
              <div className="mbContentWrap__filter">
                <Person />
                <div>Person</div>
              </div>
            </div>

            <div className="mbContent">
              {gapi != undefined ? (
                <div onClick={signInGoogle}>Sign in try first</div>
              ) : (
                <div>GAPI STILL UNDEFINED</div>
              )}

              {mails.map((p) => (
                mailItem(p)
              ))}
            </div>
          </div>
        </div>

        <div id="googleAuthorisor">
          {!isLoggedIn && <div id="google-signin"></div>}

          {isLoggedIn && (
            <div>
              <div>
                <img src={imageUrl} />
              </div>
              <div>{name}</div>
              <div>{email}</div>
              <button className="btn-primary" onClick={logOut}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
