import "./topbar.scss";
import { Search, Person, Chat, Notifications, Email } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import  SearchBar  from "../searchBar/SearchBar"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';




function TopbarIcon({url, icon, badgeNumber}) {
  return (
    <Link className="topbarIconItem" to={url}>
      <div className="topbarSvgWrap">
        {icon}
        <span className="topbarIconBadge">{badgeNumber}</span>
      </div>   
    </Link>
  )
}








export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const gotoMessages = () => {
    try {
      history.push('/messenger')
      //axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {
      alert("Invalid link")
    }
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Jun's Social</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <SearchBar />
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div 
            className="topbarIconItem"
            onClick={gotoMessages}
          >
            <div className="topbarSvgWrap">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>   
          </div>
          <div 
            className="topbarIconItem"
            onClick={gotoMessages}
          >
            <div className="topbarSvgWrap">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>   
          </div>
          
          <Link className="topbarIconItem" to={`{/mailbox/${user.username}}`}>
            <div className="topbarSvgWrap">
              <Notifications />
              <span className="topbarIconBadge">2</span>
            </div>   
          </Link>
          <Link className="topbarIconItem" to={`/mailbox/${user.username}`}>
            <div className="topbarSvgWrap">
              <Email />
              <span className="topbarIconBadge">69</span>
            </div>   
          </Link>
          {/* <TopbarIcon url="/mailbox/${user.username}" icon="<Email />" badgeNumber="" /> */}
          <Link className="topbarIconItem" to={`/slack`}>
            <div className="topbarSvgWrap">
              <img src="/assets/slack-new-logo.svg" />
              <span className="topbarIconBadge">69</span>
            </div>   
          </Link>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
//https://dev.to/iwaniukooo11/send-e-mails-directly-from-front-end-with-js-5d7d