import "./3dcatalogue.scss";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import  SearchBar  from "../../components/searchBar/SearchBar"
import  Gallery  from "../../components/gallery/Gallery"

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";



export default function ArtGallery() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="3d-gallery">
        <Sidebar />
        <SearchBar />
        <Gallery />
      </div>
    </>
  );
}
