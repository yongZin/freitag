import React from "react";
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

const Container = styled.div`
  max-width:600px;
  margin:0 auto;
  padding:50px 15px;
`;

const App = () => {
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