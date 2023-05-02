import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";


//to use here use in prop and use chat gpt for any queires (flex->side by side by default)
const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: ${(props) => (props.type === "sm" ? "60%" : "100%")};
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

export const Card = ({type,video}) => {

  const [channel,setChannel] = useState({});
  //useEffect works only on reloading the page
  useEffect(()=> {
    const fetchChannel = async ()=> {
      const res = await axios.get(`http://localhost:8800/api/users/find/${video.userId}`);
      setChannel(res.data);
    }
    fetchChannel();
  },[video]);//type is arguement -- props

  const handleView = async () => {
    await axios.put(`http://localhost:8800/api/videos/view/${video._id}`)
  }

  //that sm is kept beacuse to resolve the conflicts for the recommendations section later on we will do crct
  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration : "none"}}>
    <Container type={type} onClick={handleView}>
        <Image type={type} src={video.imgUrl} />
        <Details type={type} >
            <ChannelImage type={type} src={channel.img} />
            <Texts>
                <Title> {video.title} </Title>
                <ChannelName>{ channel.name } </ChannelName>
                <Info>{video.views} views <CircleIcon sx={{ fontSize: 8 }} /> {format(video.createdAt)}</Info>
            </Texts>
        </Details>
    </Container>
    </Link>
  );
};
