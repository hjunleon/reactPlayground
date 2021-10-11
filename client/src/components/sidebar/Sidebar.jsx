import "./sidebar.scss";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  KeyboardArrowRight
} from "@material-ui/icons";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import {Api} from '@mui/icons-material';
import { Users } from "../../dummyData";

import { useContext, useEffect, useState } from "react";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const popupOpts = {
  api: [
    {
      title: `mail`,
      link: `/mailbox`,
    },
    {
      title: `slack`,
      link: `/slack`,
    },
    {
      title: `zoom`,
      link: `/zoom`,
    },
  ],
};

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [isOverListItem, setIsOverListItem] = useState(false);
  const [isOverRightPopup, setIsOverRightPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState("api");
  const [popupOffset, setPopupOffset] = useState([0, 0]);

  const popRightOptions = () => {
    let requiredMenu = popupOpts[currentPopup] || [];

    return (
      <div
        className="rightBarPopup"
        style={{
          top: `${popupOffset[0]}px` || "0px",
          left: `${popupOffset[1] - 4}px` || "0px",
        }}
        onMouseOver={rightPopupEnter}
        onMouseLeave={rightPopupLeave}
      >
        {requiredMenu.map((o) => (
          <Link
            className="rightBarPopup__item"
            to={o["link"] || "/"}
            style={{ textDecoration: "none" }}
          >
            <span>{o["title"] || "unknown Opt"}</span>
          </Link>
        ))}
      </div>
    );
  };

  const rightPopupEnter = (e) => {
    console.log("rightPopupEnter");
    console.log(e);
    setIsOverRightPopup(true);
  };

  const rightPopupLeave = (e) => {
    console.log("rightPopupLeave");
    console.log(e);
    setIsOverRightPopup(false);
  };

  const listItemEnter = (e) => {
    console.log(e);
    let curElem = e.target;
    while (curElem && curElem.className != "sidebarListItem") {
      curElem = curElem.parentNode;
    }
    if (!curElem) {
      setIsOverListItem(false);
      return;
    }
    console.log(curElem);
    if ("popup" in curElem.dataset) {
      let bounds = curElem.getBoundingClientRect();
      console.log(bounds);
      setCurrentPopup(curElem.dataset["popup"]);
      setPopupOffset([
        bounds.top - 56,
        curElem.offsetLeft + curElem.offsetWidth,
      ]);
      setIsOverListItem(true);
      // } else if (e.target.className == "sidebarListItem") {
      //   setIsOverListItem(false);
      // }
    } else {
      console.log(e);
      setIsOverListItem(false);
    }
  };

  const listItemLeave = (e) => {
    console.log(e);
    console.log(isOverRightPopup);
    // if (e.target.className == "sidebarList") {
      setIsOverListItem(false);
    // }
    // if (!isOverRightPopup){

    // }
  };
  //onMouseEnter
  return (
    <div className="sidebar" onMouseLeave={listItemLeave}>
      <div className="sidebarWrapper" onMouseOver={listItemEnter}>
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
          <li className="sidebarListItem">
            <AllInclusiveIcon className="sidebarIcon" />
            <Link
              className="sidebarListItemText"
              to={`3D-Catalogue/${user.username}`}
              style={{ textDecoration: "none" }}
            >
              <span>3D exploration</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <AllInclusiveIcon className="sidebarIcon" />
            <Link
              className="sidebarListItemText"
              to={`/trying3D`}
              style={{ textDecoration: "none" }}
            >
              <span>3D trying</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <AllInclusiveIcon className="sidebarIcon" />
            <Link
              className="sidebarListItemText"
              to={`/debugOutlines`}
              style={{ textDecoration: "none" }}
            >
              <span>Debuggin Outlines</span>
            </Link>
          </li>
          Webgl_materials_variations_toon
          <li className="sidebarListItem" data-popup="api">
            <Api className="sidebarIcon" />
            <Link
              className="sidebarListItemText"
              to={`API Menu`}
              style={{ textDecoration: "none" }}
            >
              <span>API Playground</span>
            </Link>
            <KeyboardArrowRight className="sidebarIcon leanRight" />
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
      {(isOverListItem || isOverRightPopup) && popRightOptions()}
    </div>
  );
}
