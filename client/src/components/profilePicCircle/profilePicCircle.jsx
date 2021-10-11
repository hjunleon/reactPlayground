import "./profilePicCircle.scss";
import { Person } from "@material-ui/icons";
export default function ProfilePicCircle({user}) {
    const profilePicClass = "profilePicImg"
    //console.log(user)
    if (user?.url?.length == 0){
        return (
            <img className={profilePicClass} src={user.url} alt="" /> //Shouold be some error image
        )
    }
    if (user?.username?.length === 0 ){
        return (
            <div className={profilePicClass}>

            </div>
        )
    }

  return (
    <div className={profilePicClass}>
        <Person />
    </div>
  );
}
