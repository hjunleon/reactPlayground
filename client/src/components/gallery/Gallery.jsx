import "./Gallery.scss";
import { useContext, useEffect, useState } from "react";
import { Search } from "@material-ui/icons";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Post from "../post/Post";


// A component to display items with preview, based on url given
export default function Gallery(props) {
    let url = props.url
    let username = props.username   //idea is to autorecommend based on some algo
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            // const res = username //i'm abstracting this to the one calling gallery. Gallery is more UI to create grid view based on specific url
            //     ? await axios.get(urls[0] + username)
            //     : await axios.get(urls[1] + user._id);
            // setPosts(
            //     res.data.sort((p1, p2) => {
            //     return new Date(p2.createdAt) - new Date(p1.createdAt);
            //     })
            // )
            const res = url?await axios.get(url):{
                data:[]
            }
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            )

        };
        fetchPosts();
    }, [username, user._id]);

    return (
        <div className="galleryContainer">
            {posts.map((p) => (
                <Post key={p._id} post={p} />
            ))}
        </div>
    );

}