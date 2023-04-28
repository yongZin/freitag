import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import CustomInput from "../components/CustomInput";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

const GuestForm = styled.form`
	text-align:right;
	button{
		margin-top:10px;
		font-size:14px;
		color:#777;
		border:0;
		border-bottom:1px solid #888;
		background-color:transparent;
		position:relative;
		&::before{
			content:"다양한 기능 사용이 가능합니다.";
			width:100%;
			padding:10px 0;
			line-height:1.3;
			font-size:13px;
			font-family:var(--f-reular);
			letter-spacing:0.4px;
			word-break:keep-all;
			border-radius:8px;
			background-color:#e1e1e1;
			position:absolute;
			top:20px;
			right:0;
			pointer-events:none;
			transition:0.3s;
			opacity:0;
		}
		&::after{
			content:"";
			border-left:8px solid transparent;
			border-right:8px solid transparent;
			border-bottom:8px solid #e1e1e1;
			position:absolute;
			top:14px;
			right:calc(50% - 8px);
			pointer-events:none;
			transition:0.3s;
			opacity:0;
		}
		&:hover{
			&::before{
				top:32px;
				opacity:1;
			}
			&::after{
				top:26px;
				opacity:1;
			}
		}
	}
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

	const guestHandler = () => {
		setUsername("guest");
		setPassword("superguest");
	}

	return(
		<Wrap>
			<div>

				<h3>로그인</h3>

				<form onSubmit={loginHandler}>
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

					<SubmitBtn type="submit">로그인</SubmitBtn>
				</form>

				<GuestForm onSubmit={loginHandler}>
					<button type="submit" onClick={guestHandler}>관리자 권한으로 로그인</button>
				</GuestForm>
			</div>
		</Wrap>
	)
}

export default LoginPage;