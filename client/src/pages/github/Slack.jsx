import "./Slack.scss";
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
  Close
} from "@material-ui/icons";

let slackScopes = []
const CLIENT_ID = '261563897047.2551911311360'
const redirect_uri='https://localhost:8888'
const scope = ['incoming-webhook','commands']



export default function Slack() {
  const [isPoppedUp, setPopUp] = useState(false);
  const [slackAction, setSlackAction] = useState(null);
  const [searchbarInput, setSearchBarInput] = useState("");
  let slackData = new Map([["convoList", [{
      "title":"test"
  }]], ["yourId", null]])
  console.log("slackData: ")
  console.log(slackData)
    //const [slackData,setSlackData] = useState()
// API call (which shouldn't be here but whatever)
const getConvoList = async () => {
    // try {
        const res = await axios.get("https://slack.com/api/conversations.list",{
        headers:{
            'Authorization': 'Bearer xoxp-261563897047-1529974447411-2525808007733-05dfbfffa58f05d32698505ce200bbca',
            'Content-type': 'application/x-www-form-urlencoded',
        }
        }).then(res => {
            console.log("success =========", res)
        }).catch(err =>{
            console.log("Error ========>", err);
        });
        
    // }
    // catch(err) {
    //     console.log(err)
    // }   
  };

const authMe = () =>{
    let oauthUrl = encodeURI(`https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${scope.join(',')}&redirect_uri=${redirect_uri}`)
    console.log(oauthUrl)
    window.location.href = oauthUrl
    
}

  // UI =======================

  const popup = (e) => {
    console.log(e);
    let action = e.target.dataset.action
    setSlackAction(action);
    setPopUp(true);
  };

  const ConvoListItem = (listData) => {
    let {title} = listData?listData:{
        "title":"empty"
    }
    return (
        <div>
            {title}
        </div>   
    )
  }

  (()=>{
    slackData.set("convoList",[
        {
            "title": 1
        },
        {
            "title": 2
        },
        {
            "title": 3
        },
    ])

    //getConvoList()

  })()


  const RenderConvoList = () => {
    return (
      <div className="convoList">
        {slackData.get("convoList").map((p, index) => (
            <ConvoListItem key={index} title={p.title}/>
        ))}
        
      </div>
    )
  }

  useEffect(() => {});

  const receiveSearchBarInput = e =>{
      console.log(e)
      setSearchBarInput(e)
  }

  

  return (
    <>
      <Topbar />
      <div onClick={authMe} data-action="authMe" className="slackBtn">
        Auth
      </div><div onClick={popup} data-action="inviteItem" className="slackBtn">
        Invite peeps
      </div>
      {isPoppedUp && <div className="overlay">
        <div className="popupModal">
            <div className="popupModal__Top">
                <div>
                    Invite members by email
                </div>
                <Close />
            </div>
            <SearchBar onSearchBarInput={receiveSearchBarInput}/>
            <div className="popupModal__Content">
                <RenderConvoList />
            </div>
            <div className="popupModal__Bottom">
                <div onClick={popup} data-action="save" className="slackBtn">
                    Save
                </div>
            </div>
        </div>
          
    </div>}
    </>
  );
}
