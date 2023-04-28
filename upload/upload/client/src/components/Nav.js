import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import logo from "./images/logo.svg"
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.div`
	width:100%;
	display:flex;
	justify-content:center;
	background-color:rgba(0,29,58,.18);
	backdrop-filter:blur(2px);
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	transition:0.1s;
`;
const Content = styled.div`
	width:100%;
	max-width:1000px;
	padding:10px 30px;
	display:flex;
	align-items:center;
	justify-content:space-between;
	a, span{
		font-size:16px;
		font-family:var(--f-ebold);
		color:#414141;
		text-decoration:none;
		cursor:pointer;
		&:hover{
			text-decoration:underline;
		}
		& + a{
			margin-left:14px;
		}
	}
	> a{
		width:102px;
		height:34px;
		font-size:0;
		background:url(${logo}) no-repeat;
		background-size:cover;
	}
`
const Notice = styled.div`
	width:100%;
	background-color:#111;
	text-align:center;
	position:fixed;
	top:0;
	left:0;
	z-index:100;
	div{
		max-width:1000px;
		margin:0 auto;
		padding:5px 30px;
		font-size:0;
		p{
			width:calc(100% - 30px);
			display:inline-block;
			vertical-align:middle;
			text-align:center;
			font-family:var(--f-ebold);
			font-size:14px;
			color:#fff;
		}
		button{
			width:30px;
			height:30px;
			display:inline-block;
			vertical-align:middle;
			border:0;
			background-color:transparent;
			position:relative;
			&::before,&::after{
				content:"";
				width:20px;
				height:2px;
				background-color:#fff;
				position:absolute;
				top:calc(50% - 1px);
				left:5px;
				transform:rotate(45deg);
			}
			&::after{
				transform:rotate(-45deg);
			}
		}
	}
	& + div{
		top:40px;
	}
	& ~ .wrap{
		margin-top:40px;
	}
`;

const Nav = () => {
	const [me, setMe] = useContext(AuthContext);
	const [notice, setNotice] = useState(false);

	const logoutHandler = async () => {
		try {
			await axios.patch("/users/logout");
			
			setMe();
			toast.success("로그아웃");
		} catch (err) {
			console.error(err);
			toast.error(err.message);
		}
	}

	useEffect(() => {
		if(me && (me.userId) === GUEST_ID) setNotice(true);
		else setNotice(false);
	}, [me])

	return(
		<>
			{notice &&
				<Notice>
					<div>
						<p>새로고침 및 브라우저 종료시 업로드한 데이터는 사라지며, 현재 아이디로 업로드한 상품만 삭제 가능합니다.</p>
						<button onClick={() => setNotice(!notice)}></button>
					</div>
				</Notice>
			}

			<Wrap>
				<Content>
					<Link to="/">홈</Link>

					{me ? (
						<span onClick={logoutHandler}>
							LOGOUT({me.name})
						</span>
					) : (
						<div>
							<Link to="/auth/login">LOGIN</Link>
							<Link to="/auth/register">JOIN</Link>
						</div>
					)
					}
				</Content>
			</Wrap>
		</>
	)
}

export default Nav;