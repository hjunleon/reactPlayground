import "./MailAccMenu.scss";
import ProfilePicCircle from "../profilePicCircle/profilePicCircle";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

import { PersonAdd } from "@material-ui/icons";


export default function MailAccountMenu() {
  const { user } = useContext(AuthContext);
  const [isAddAccModalOpen, setAddAccModalOpen] = useState(false);
  
  // useEffect(() => {
  //     const fetchUser = async () => {
  //       const res = await axios.get(`/users?username=${username}`);
  //       setUser(res.data);
  //     };
  //     fetchUser();
  //   }, [username]);

  const addEmailAccount = () =>{
    setAddAccModalOpen(true)
  }


  return (
    <div className="mailAccMenu">
      <div className="activeAccountWrap">
        <div className="emailPic active">
          <ProfilePicCircle />
        </div>
        <div>
          <div>miaomiaox123</div>
          <div>miaomiaox123@gmail.com</div>
          <div className="manageBtn">Manage this email account</div>
        </div>
      </div>
      <div className="otherEmailAccs">
        <div className="otherEmailAccs_item">
          <div className="otherEmailAccs_item1">
            <div className="emailPic">
              <ProfilePicCircle />
            </div>
            <div className="emailDetails">
              <div>Username</div>
              <div>Email</div>
            </div>
          </div>
          <div className="emailType">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png" />
          </div>
        </div>
        <div className="otherEmailAccs_item">
          <div className="otherEmailAccs_item1">
            <div className="emailPic">
              <ProfilePicCircle />
            </div>
            <div className="emailDetails">
              <div>Username</div>
              <div>Email</div>
            </div>
          </div>
          <div className="emailType">
            <img src="/assets/outlook-icon.svg" />
          </div>
        </div>
        <div className="otherEmailAccs_item">
          <div className="otherEmailAccs_item1">
            <div className="emailPic">
              <ProfilePicCircle />
            </div>
            <div className="emailDetails">
              <div>Username</div>
              <div>Email</div>
            </div>
          </div>
          <div className="emailType">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png" />
          </div>
        </div>
        <div className="addEmailAccBtn" onClick={addEmailAccount}>
            <PersonAdd />
            <div>
                Add Another Account
            </div>
        </div>
        <div className="signOutAllMail">
            <div>
                Sign out from all accounts
            </div>
            
        </div>
      </div>
    </div>
  );
}
