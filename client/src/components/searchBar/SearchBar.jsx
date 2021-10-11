import "./SearchBar.scss";
import { Search } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

export default function SearchBar(props) {

  let { onSearchBarInput } = props?props:{
      "onSearchBarInput":null
  };
  const history = useHistory();
  const passUpInput = (e) => {
      if(!onSearchBarInput){
          return
      }
    let val = e.target.value;
    onSearchBarInput(val);
  };

  return (
    <div className="searchbar">
      <Search className="searchIcon" />
      <input
        placeholder="Search for friend, post or video"
        className="searchInput"
        onChange={passUpInput}
      />
    </div>
  );
}
