import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";

const Wrap = styled.div`
	width:100%;
	display:flex;
	justify-content:space-between;
	a, span{
		color:#111;
		text-decoration:none;
		cursor:pointer;
		&:hover{
			text-decoration:underline;
		}
		& + a{
			margin-left:15px;
		}
	}
`;

const Nav = () => {
	const [me, setMe] = useContext(AuthContext);

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

	return(
		<Wrap>
			<Link to="/">홈</Link>

			{me ? (
				<span onClick={logoutHandler}>
					로그아웃({me.name})
				</span>
			) : (
				<div>
					<Link to="/auth/login">로그인</Link>
					<Link to="/auth/register">회원가입</Link>
				</div>
			)
			}
		</Wrap>
	)
}

export default Nav;