import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CircleIcon from "@mui/icons-material/Circle";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Comments } from "../components/Comments";
import { Card } from "../components/Card";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { fetchSuccess } from "../redux/videoSlice";
import { format } from "timeago.js";
import { like, dislike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import { Recommendation } from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div`
  flex: 2;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.text};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

export const Video = () => {
  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);
  //why reducer for current Video fetching and why ot for the channel name means
  //by using the usestate if any changes are made then after refreshing the page only we can see them
  //but by using the useSelector the immedidate changes can be seen like (liking the post) (disliking post)
  //etc

  const dispatch = useDispatch();

  //to get video id from the params comes in router of react
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `http://localhost:8800/api/videos/find/${path}`
        );
        const channelRes = await axios.get(
          `http://localhost:8800/api/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, path]);

  const handleLike = async () => {
    await axios.post(
      `http://localhost:8800/api/users/like/${currentVideo._id}`,
      {
        token: currentUser.token,
      }
    );
    dispatch(like(currentUser.otherDetails._id));
  };

  const handleDislike = async () => {
    await axios.post(
      `http://localhost:8800/api/users/dislike/${currentVideo._id}`,
      {
        token: currentUser.token,
      }
    );
    dispatch(dislike(currentUser.otherDetails._id)); //because we aldready have the video details in Video Slice
  };

  const handleSubscribe = async () => {
    currentUser.otherDetails.subscribedUsers.includes(channel._id)
      ? await axios.post(
          `http://localhost:8800/api/users/unsub/${channel._id}`,
          {
            token: currentUser.token,
          }
        )
      : await axios.post(`http://localhost:8800/api/users/sub/${channel._id}`, {
          token: currentUser.token,
        });

    dispatch(subscription(channel._id)); //because we aldready have the user details in user Slice
  };
  
  return (
    
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls></VideoFrame>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views <CircleIcon sx={{ fontSize: 8 }} />{" "}
            {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(
                currentUser && currentUser.otherDetails._id
              ) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length} Likes
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(
                currentUser && currentUser.otherDetails._id
              ) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              {currentVideo.dislikes?.length} Dislikes
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
            <Description />
          </ChannelInfo>
          <Subscribe onClick={handleSubscribe}>
            {currentUser &&
            currentUser.otherDetails.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};
