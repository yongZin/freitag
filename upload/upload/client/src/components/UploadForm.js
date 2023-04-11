// 파일 업로드 컴포넌트
import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify"; //alert 라이브러리
import axios from "axios";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const FileDropper = styled.div`
  min-height:100px;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  margin-bottom:20px;
  padding:15px;
  text-align:center;
  border:1px dashed #111;
  border-radius:10px;
  background-color:bisque;
  overflow:hidden;
  position:relative;
  transition:0.3s;
  &:hover{
    color:#fff;
    background-color:gray;
  }
  input{
    width:100%;
    height:100%;
    opacity:0;
    cursor:pointer;
    position:absolute;
    top:0;
    left:0;
  }
  p{
    width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
`;

const FileBtn = styled.button`
  width:100%;
  height:40px;
  border:0;
  border-radius:8px;
  color:#fff;
  background-color:#333;
  transition:0.3s;
  &:hover{
    background-color:#555;
  }
`;

const ImgPreview = styled.div`
  font-size:0;
  img{
    width:0;
    font-size:0;
    border-radius:10px;
    opacity:0;
    transition:0.3s;
    &.show{
      width:calc(50% - 13px);
      display:inline-block;
      margin:10px auto;
      border:5px solid #ccc;
      opacity:1;
      background-color:red;
      &:nth-child(2n){
        margin-left:6px;
      }
    }
  }
`;

const UploadForm = () => {
  const {setImages} = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [percent, setPercent] = useState(0);
  const inputRef = useRef();

  const imgHandler = async (e) => {
    const imgFiles = e.target.files; //파일정보 가져오기
    setFiles(imgFiles);

    /* 업로드 프리뷰 */
    const imgPreviews = await Promise.all(
      [...imgFiles].map(async (imgFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imgFile);
            fileReader.onload = (e) => 
            resolve({ imgSrc: e.target.result, fileName: imgFile.name});
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    /* //업로드 프리뷰 */

    setPreviews(imgPreviews);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for(let file of files){
      formData.append("image", file);
    }

    try {
      const res = await axios.post("/images", formData, {
        Headers: {"Content-Type":"multipart/form-data"},
        onUploadProgress: (e) => {
          setPercent(Math.round(100 * e.loaded/e.total)); //진행도 (ProgressEvent 참고)
        }
      });
      setImages((prevData) => [res.data, ...prevData]); //실시간 업로드 반영
      toast.success("업로드 성공");
      
      setTimeout(() =>{ //초기화
        setPercent(0);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);

    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      setPreviews([]);
      inputRef.current.value = null;
      console.log(err);
    }
  }

  const previewsImg = previews.map((preview) => (
    <img 
      alt=""
      key={preview.imgSrc}
      src={preview.imgSrc}
      className={`${preview.imgSrc && "show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.map((el) => {
        return(
          <p key={el.fileName}>{el.fileName}</p>
        )
      })
      // : previews.reduce(
      //     (previous, current) => previous + `${current.fileName},`,
      //     ""
      //   );

  return(
    <form onSubmit={onSubmit}>
      <ImgPreview>
        {previewsImg}
      </ImgPreview>
      
      <ProgressBar percent={percent} />

      <FileDropper>
        {fileName}
        <input
          ref={ref => (inputRef.current = ref)}
          id="image"
          type="file"
          multiple
          accept="image/*"
          onChange={imgHandler}
        />
      </FileDropper>
      
      <FileBtn>제출</FileBtn>
    </form>
  )
}

export default UploadForm;