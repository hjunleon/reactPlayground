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
  Close,
} from "@material-ui/icons";

//https://www.akashmittal.com/force-component-to-rerender-in-reactjs/

// import React from 'react';

// export default function App(){
// 	const [items, setItems] = React.useState({a: 1, b: 2});

// 	return(
// 		<div key={Math.random()+Date.now()}>
// 			{Object.keys(items).map((val) => {
// 			  return <p key={val}>{items[val]}</p>;
// 			})}
// 			<p><button onClick={() => setItems({a: items.a+1, b: items.b+1})}>Increase items by 1</button></p>
// 		</div>
// 	);
// }

// import React from 'react';

// export default function App(){
// 	const [count, setCount] = React.useState(1);
// 	const [refresh, setRefresh] = React.useState(1);

// 	useEffect(() => {
// 		if(refresh === 0){
// 			setRefresh(1);
// 		}
// 	}, [refresh])

// 	useEffect(() => {
// 		setRefresh(0);
// 	}, [count]);

// 	const ChildComp = (props) => {
// 		return(
// 			<p>{props.val}</p>
// 		)
// 	}

// 	return(
// 		<div>
// 			{refresh ? <ChildComp /> : null}
// 			<p><button onClick={() => {setCount(count+1)}}>Increase Count by 1</button></p>
// 		</div>
// 	);
// }

let slackScopes = [];
const CLIENT_ID = "261563897047.2551911311360";
const redirect_uri = "https://localhost:3000/slack/callback";
const scope = ["incoming-webhook", "commands"];

export default function Slack() {
  const [isPoppedUp, setPopUp] = useState(false);
  const [slackAction, setSlackAction] = useState(null);
  const [searchbarInput, setSearchBarInput] = useState("");
  const [slackData, setSlackData] = useState(
    new Map([
      [
        "convoList",
        [
          {
            id: 1,
            name: 1,
          },
          {
            id: 2,
            name: 2,
          },
          {
            id: 3,
            name: 3,
          },
        ],
      ],
      ["yourId", null],
    ])
  );
  // let slackData = ;
  console.log("slackData: ");
  console.log(slackData);
  //const [slackData,setSlackData] = useState()
  // API call (which shouldn't be here but whatever)
  const getConvoList2 = async () => {
    // try {
    const res = await axios
      .get("https://slack.com/api/conversations.list", {
        headers: {
          Authorization:
            "Bearer xoxp-261563897047-1529974447411-2525808007733-05dfbfffa58f05d32698505ce200bbca",
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("success =========", res);
      })
      .catch((err) => {
        console.log("Error ========>", err);
      });

    // }
    // catch(err) {
    //     console.log(err)
    // }
  };

  const getConvoList = async () => {
    setSlackAction("convoList")
    const res = await axios
      .get("/slack/convoList")
      .then((res) => {
        console.log("success =========");
        console.log(res);
        let slackDataCopy = new Map(slackData);
        slackDataCopy.set("convoList", res.data.channels);
        setSlackData(slackDataCopy);

        console.log(slackData.get("convoList"));
      })
      .catch((err) => {
        console.log("Error ========>");
        console.log(err);
      });
  };

  const getConvoHistory = async () => {
    setSlackAction("convoHistory")
    let sampleChannelId = slackData.get("convoList")[0].id
    const res = await axios
      .get(`/slack/convoHistory?channel=${sampleChannelId}`)
      .then((res) => {
        console.log("success =========");
        console.log(res);
        let slackDataCopy = new Map(slackData);
        let channelObj = slackDataCopy.get(sampleChannelId) || {}
        channelObj["history"] = res.data
        slackDataCopy.set(sampleChannelId,channelObj)
        setSlackData(slackDataCopy);
      })
      .catch((err) => {
        console.log("Error ========>");
        console.log(err);
      });
  };

  const testSlack = async () => {
    const res = await axios
      .get(`/slack/testSlack`)
      .then((res) => {
        console.log("success =========", res);
      })
      .catch((err) => {
        console.log("Error ========>");
        console.log(err);
      });
  };

  const authMe = () => {
    console.log(`redirect_uri: ${redirect_uri}`);
    //v2 might not be suitable
    let oauthUrl = encodeURI(
      `https://slack.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope.join(
        ","
      )}&redirect_uri=${redirect_uri}`
    );
    console.log(oauthUrl);
    window.location.href = oauthUrl;
  };

  // UI =======================

  const popup = (e) => {
    console.log(e);
    let action = e.target.dataset.action;
    setSlackAction(action);
    setPopUp(true);
  };

  const closePopup = (e) => {
    setPopUp(false);
  };

  const ConvoListItem = (listData) => {
    console.log("ConvoListItem");
    // console.log(listData)
    let { title } = listData
      ? listData
      : {
          title: "empty",
        };
    return <div>{title}</div>;
  };

  // ;(() => {
  //   slackData.set("convoList", [
  //     {
  //       id: 1,
  //       name: 1,
  //     },
  //     {
  //       id: 2,
  //       name: 2,
  //     },
  //     {
  //       id: 3,
  //       name: 3,
  //     },
  //   ]);

  //   //getConvoList()
  // })();

  const RenderConvoList = () => {
    return (
      <div className="convoList">
        {slackData.get("convoList").map((p, index) => (
          <ConvoListItem key={index} title={p.name} />
        ))}
      </div>
    );
  };

  const RenderConvoHistory = () => {
    let currentChannelId = slackData.get('convoList')[0].id
    console.log(`currentChannelId: ${currentChannelId}`)
    let channelHistory = slackData.get(currentChannelId)
    if(channelHistory == undefined){
      return <div>Convo History Undefined</div>
    }
    channelHistory = channelHistory["history"] // logic need decouple, i cant rmb the structure of the store 
    console.log("channelHistory")
    console.log(channelHistory)
    let messages = channelHistory["messages"]
    return (<div className="convoHistory">
      {messages.map((p,index)=>(
        <div key={index}>{p.text}</div>
      ))}
    </div>)
  }

  const DataPreview = () => {
    if (slackAction == "convoList") {
      return <RenderConvoList />;
    } else if (slackAction == "convoHistory") {
      return <RenderConvoHistory />;
    } //else {
    return <div>EMPTY</div>;
    //}
  };

  // useEffect(() => {});

  const receiveSearchBarInput = (e) => {
    console.log(e);
    setSearchBarInput(e);
  };

  return (
    <>
      <Topbar />
      <div>
        <div onClick={authMe} data-action="authMe" className="slackBtn">
          Auth
        </div>
        <div onClick={testSlack} data-action="testMe" className="slackBtn">
          Test Me
        </div>
        <div
          onClick={getConvoList}
          data-action="convoList"
          className="slackBtn"
        >
          Get Convo List
        </div>
        <div
          onClick={getConvoHistory}
          data-action="convoHistory"
          className="slackBtn"
        >
          Get Convo History
        </div>
        <div onClick={popup} data-action="inviteItem" className="slackBtn">
          Invite peeps
        </div>
      </div>
      <div className="apiOutput">
        <DataPreview />
      </div>
      {isPoppedUp && (
        <div className="overlay">
          <div className="popupModal">
            <div className="popupModal__Top">
              <div>Invite members by email</div>
              <Close onClick={closePopup} />
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
