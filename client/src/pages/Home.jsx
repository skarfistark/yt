import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "../components/Card";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div`
  display : flex;
  justify-content: space-between;
  flex-wrap : wrap;
`;

const Warn = styled.h1`
  color: ${({ theme }) => theme.text};
`;

export const Home = ({type}) => {

  //fetching videos from backend
  const [videos,setVideos] = useState([]);
  const {currentUser} = useSelector((state) => state.user);

  useEffect(()=> {
    const fetchVideos = async ()=> {
      if(type !== "sub"){
        const res = await axios.get(`http://localhost:8800/api/videos/${type}`);
        setVideos(res.data.videos);
      }
      else{
        try{
          const res = await axios.post(`http://localhost:8800/api/videos/sub`,{
            token : currentUser.token
          });
          setVideos(res.data.videos);
        } catch (err) {
          setVideos([]);
        }
      }
    }
    fetchVideos();
  },[type,currentUser]);//type is arguement -- props
  return (

    <Container>
      {videos.length === 0 ? (
        <Warn>Please sign in or subscribe to view this section.</Warn>
      ) : (
        videos.map((singleVideo) => (
          <Card type={type} key={singleVideo._id} video={singleVideo} />
        ))
      )}
    </Container>
  );
  
};
