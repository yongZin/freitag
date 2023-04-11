import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import CustomInput from "../components/CustomInput";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
	width:100%;
	max-width:350px;
	margin:100px auto 0;
`;

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [, setMe] = useContext(AuthContext);
	const navigate = useNavigate();


	const loginHandler = async (e) => {
		try {
			e.preventDefault();

			if(username.length < 3 || password.length < 6)
				throw new Error("입력하신 정보가 올바르지 않습니다.");

			const result = await axios.patch(
				"/users/login",
				{ username, password }
			);
			setMe({
				userId: result.data.userId,
				sessionId: result.data.sessionId,
				name: result.data.name,
			})
			navigate("/"); //완료시 홈 화면으로 이동
			toast.success("로그인 성공");
		} catch (err) {
			console.error(err.response);
			toast.error(err.response.data.message);
		}
	}

	return(
		<Wrap>
			<h3>Login</h3>

			<form onSubmit={loginHandler}>
				<CustomInput 
					label="아이디"
					value={username}
					setValue={setUsername}
				/>
				<CustomInput 
					label="비밀번호"
					value={password}
					setValue={setPassword}
					type="password"
				/>

				<button type="submit">로그인</button>
			</form>
		</Wrap>
	)
}

export default LoginPage;