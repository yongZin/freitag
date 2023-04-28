import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import GlobalStyle from "./components/GlobalStyle";
import { ToastContainer } from "react-toastify"; //alert 라이브러리
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Detail from "./pages/Detail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import Nav from "./components/Nav";
import { AuthContext } from "./context/AuthContext";
import { ImageContext } from "./context/ImageContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Container = styled.div`
  max-width:1000px;
  margin:0 auto;
  padding:100px 30px;
`;

const App = () => {
  const navigate = useNavigate();
  const [me] = useContext(AuthContext);
  const {images, setImages} = useContext(ImageContext);
	const [confirm, setConfirm] = useState(false);
  const [guestImg, setGuestImg] = useState([]);

  useEffect(() => {
		setTimeout(() => {
      if(me && ((me.userId) === GUEST_ID)) {
        axios
          .get("/users/me/images") //이미지 데이터 가져오기
          .then((result) => setGuestImg(result.data))
          .catch((err) => {
            console.error(err);
          })
      } else{
        setGuestImg([]);
      }
    }, 100)
	}, [me, images]);
  
  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = ""; //Chrome에서 동작하도록;

		setConfirm(true);
  };
  
  useEffect(() => {
    if(me && (me.userId === GUEST_ID)) {
      (() => {
        window.addEventListener("beforeunload", preventClose);
      })();

      return () => {
        window.removeEventListener("beforeunload", preventClose);
      };
    }
  }, [me]);

  if(confirm) {
    guestImg.map(async (id) => {
      const result = await axios.delete(`/images/${id._id}`);
      setImages(images.filter(image => image._id !== id._id));
      navigate("/");

      return result;
    })
  }
  
  return (
    <Container>
      <ToastContainer />
      <GlobalStyle />
      <Nav />
      <Routes>
        <Route path="/images/:imageId" element={<Detail />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Container>
  );
}

export default App;