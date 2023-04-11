import styled from "styled-components";

const InputBox = styled.div`
	margin-bottom:20px;
	input{
		width:100%;
		box-sizing:border-box;
	}
`;

const CustomInput = ({ label, value, setValue, type = "text" }) => {
	return(
		<InputBox>
			<label>{label}</label>
			<input
				type={type}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
		</InputBox>
	)
}

export default CustomInput;