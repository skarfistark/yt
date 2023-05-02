import React, { useState,useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { Card } from "./Card.jsx";

const Container = styled.div`
  flex: 2;
`;

export const Recommendation = ({tags}) => {

  const [videos, setVideos] = useState([]);

  useEffect(()=>{
    const fetchVideos = async () => {
        const res = await axios.get(`http://localhost:8800/api/videos/tags?tags=${tags}`);
        setVideos(res.data.videos);
    };
    fetchVideos();
  },[tags]);

  return (
    <Container>
        {videos.map(video=>(
            <Card type="sm" key={video._id} video={video}></Card>
        ))};
    </Container>
  )
}
