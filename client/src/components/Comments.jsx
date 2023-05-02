import React , {useEffect, useState} from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import { useSelector } from "react-redux";
import SendIcon from '@mui/icons-material/Send';

const Container = styled.div`
  padding : 20px 0px;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.div`
  color : ${({ theme }) => theme.text};
`;

//we no need to use currentVideo._id because aldready in Video we have sent the props of video_id
export const Comments = ({videoId}) => {

  const [comments , setComments] = useState([]);
  const { currentUser } = useSelector((state)=>state.user);
  const { currentVideo } = useSelector((state)=>state.video);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/comments/${videoId}`);
        setComments(res.data.comments);//res.data is imp
      } catch (err) {
        console.log(err);
      }
    }
    fetchComments();
  })

  const [commentDesc,setCommentDesc] = useState("");

  //here we are getting directlt because we are using the useState as in page we are doing things
  const handleComment = async () => {
    const res = await axios.post("http://localhost:8800/api/comments/",{
      videoId : currentVideo._id,
      desc : commentDesc,
      token : currentUser.token,//req.user.id is taken from the verify token
    });
  }

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser ? currentUser.otherDetails.img : "abcd"} />
        <Input placeholder="Add a comment..." onChange={e=>setCommentDesc(e.target.value)}/>
        <Button onClick={handleComment}><SendIcon /></Button>
      </NewComment>
      {comments.map (comment => (
        <Comment key={comment._id} comment = {comment} />
      ))}
    </Container>
  );
};
