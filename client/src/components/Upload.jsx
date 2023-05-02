import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//background
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

//our actual popup
const Wrapper = styled.div`
  width : 600px;
  height  600px;
  background-color : ${({ theme }) => theme.bgLighter};
  color : ${({ theme }) => theme.text};
  padding : 20px;
  display : flex;
  flex-direction : column;
  gap : 20px;
  position : relative
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

export const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  //useState will keep on changing continuosly if it is changed here we are using the 
  //progress which in built comes and keeps on changing
  //we use redux for handling large items and accross diff files where as useState for inside file itself
  const [imgPerc, setImgPrec] = useState(0);
  const [video, setVideo] = useState(undefined);
  const [videoPerc, setVideoPrec] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  //use State for object types
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl" ? setImgPrec(Math.round(progress)) : setVideoPrec(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType] : downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video,"videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img,"imgUrl");
  }, [img]);

  const {currentUser} = useSelector((state)=>state.user);

  const handleUpload = async (e) => {
    
    e.preventDefault();//imp in uploading the items of the inputs of page
    const token = currentUser.token;
    const res = await axios.post("http://localhost:8800/api/videos",{
        ...inputs,tags,token
    });
    console.log(res);
    setOpen(false);
    if(res.status===200){
        navigate(`/video/${res.data.savedVideo._id}`)
    }
    else{

    }
  }

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a new Video</Title>
        <Label>Video : </Label>
        {videoPerc > 0 ? (
          "Uploading : " + videoPerc + '%'
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <Desc
          name="desc"
          placeholder="Description"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Seperate Tags with commas"
          onChange={handleTags}
        />
        <Label>Image : </Label>
        {imgPerc > 0 ? (
          "Uploading : " + imgPerc + '%'
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button onClick={handleUpload} >Upload</Button>
      </Wrapper>
    </Container>
  );
};
