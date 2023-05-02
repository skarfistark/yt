import React, { useEffect,useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Card } from "../components/Card";

const Container = styled.div`
  display : flex;
  flex-wrap : wrap;
  gap : 10px;
`;


export const Search = () => {
  const [videos,setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(()=>{
    const fetchVideos = async () => {
        const res = await axios.get(`http://localhost:8800/api/videos/search${query}`);
        setVideos(res.data.videos);
    };
    fetchVideos();
  },[query]);

  return (
    <Container>
        {videos.map(video=>(
            <Card key = {video._id} video={video} />
        ))}
    </Container>
  )
}
