import React from "react";
import styled from "styled-components";

const Boundary = styled.div`
	margin-bottom:20px;
	border:1px solid #111;
	border-radius:10px;
	overflow:hidden;
	div{
		line-height:38px;
		text-align:center;
		color:#fff;
		background-color:green;
		border-radius:8px;
		transition:0.3s;
	}
`;

const ProgressBar = ({ percent }) => { 
	return(
		<Boundary>
			<div style={{width: `${percent}%`}}>{percent}%</div>
		</Boundary>
	)
}

export default ProgressBar;