import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Wrap = styled.div`
	width:100%;
	>div{
		width:100%;
		max-width:350px;
		margin:15vh auto 0;
	}
	h3{
		margin-bottom:40px;
		text-align:center;
		font-size:30px;
	}
`;

const SubmitBtn = styled.button`
	width:100%;
	height:48px;
	margin-top:10px;
	font-size:16px;
	border:0;
	border-radius:5px;
	color:#fff;
	background-color:#333;
	transition:0.3s;
	&:hover{
		background-color:#555;
	}
`;

const RegisterPage = () =>{
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordChk, setPasswordChk] = useState("");
	const [, setMe] = useContext(AuthContext);
	const navigate = useNavigate();

	const submitHandler = async (e) => {
		try {
			e.preventDefault();
			if(username.length < 3)
				throw new Error("아이디를 3글자 이상으로 해주세요.");
			if(password.length < 6)
				throw new Error("비밀번호를 6글자 이상으로 해주세요.");
			if(password !== passwordChk)
				throw new Error("비밀번호가 다릅니다 확인해주세요.");

			const result = await axios.post("/users/register", {
				name,
				username,
				password
			});
			setMe({ //Nav에 회원가입정보 넘기기
				userId: result.data.userId,
				sessionId: result.data.sessionId,
				name: result.data.name,
			});
			toast.success("회원가입 완료");
			navigate("/"); //완료시 홈 화면으로 이동
		} catch (err) {
			console.error(err)
			toast.error(err.message)
		}
	}

	return(
		<Wrap>
			<div>
				<h3>회원가입</h3>

				<form onSubmit={submitHandler}>
					<CustomInput 
						id="inputName"
						label="이름"
						value={name}
						setValue={setName}
					/>
					<CustomInput
						id="inputId"
						label="아이디"
						value={username}
						setValue={setUsername}
					/>
					<CustomInput
						id="inputPwd"
						label="비밀번호"
						value={password}
						setValue={setPassword}
						type="password"
					/>
					<CustomInput 
						id="inpuChk"
						label="비밀번호 확인"
						value={passwordChk}
						setValue={setPasswordChk}
						type="password"
					/>

					<SubmitBtn type="submit">회원가입</SubmitBtn>
				</form>
			</div>
		</Wrap>
	)
}

export default RegisterPage;