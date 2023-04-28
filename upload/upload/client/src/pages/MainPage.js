import React, { useContext } from "react";
import styled from "styled-components";
import UploadForm from "../components/UploadForm";
import Product from "../components/Product";
import { AuthContext } from "../context/AuthContext";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.div`
  transition:0.1s;
`;
const TitleExBold = styled.h2`
  font-size:50px;
  color:#111;
  font-family:var(--f-ebold);
`;
const TitleBold = styled.h3`
  font-size:25px;
  color:#111;
`;

  const MainPage = () =>{
    const [me] = useContext(AuthContext);
    
	return(
		<Wrap className="wrap">
			<TitleExBold>F203 BOB</TitleExBold>
      <TitleBold>TOTE BAG MEDIUM</TitleBold>

      {me && ((me.userId) === ADMIN_ID || (me.userId) === GUEST_ID) &&
        <UploadForm />
      }
      
			<Product />
		</Wrap>
	)
}

export default MainPage;