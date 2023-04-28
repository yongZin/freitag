import React, { useState } from "react";
import styled from "styled-components";

const InputBox = styled.div`
	margin-bottom:20px;
	border:1px solid #111;
	border-radius:5px;
	position:relative;
	z-index:1;
	label{
		padding:0 4px;
		font-size:16px;
		color:#111;
		background-color:#fff;
		position:absolute;
		top:50%;
		left:15px;
		z-index:10;
		transform:translateY(-50%);
		transition:0.3s;
		cursor:text;
	}
	input{
		width:100%;
		height:48px;
		padding:12px 15px;
		font-size:16px;
		overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
		border:0;
		border-radius:5px;
		box-sizing:border-box;
		&:focus{
			& + label{
				font-size:14px;
				color:#585858;
				top:0;
			}
		}
	}
	&.on{
			label{
				font-size:14px;
				color:#585858;
				top:0;
			}
		}
`;

const CustomInput = ({ id, label, value, setValue, type = "text" }) => {
	const [move, setMove] = useState(false);

	return(
		<InputBox 
			className={move ? "on" : null}
		>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);

					if(e.target.value.length > 0) setMove(true)
					else setMove(false);
				}}
				/>
			<label htmlFor={id}>{label}</label>
		</InputBox>
	)
}

export default CustomInput;