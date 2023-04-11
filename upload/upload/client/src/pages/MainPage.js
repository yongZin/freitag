import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UploadForm from "../components/UploadForm";
import Product from "../components/Product";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용

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
    const [power, setPower] = useState();

    useEffect(() => {
      const sessionId = localStorage.getItem("sessionId");

      if(me) {
        if(sessionId){
          axios
            .get(
              "/users/me",
              {headers: { sessionid: sessionId }}
            )
            .then((result) => setPower(result.data.userId))
            .catch((err) => console.error(err));
        }
      }
    }, [me]);
    
	return(
		<div>
			<TitleExBold>F203 BOB</TitleExBold>
      <TitleBold>TOTE BAG MEDIUM</TitleBold>
      
      {me && power === ADMIN_ID &&
        <UploadForm />
      }

			<Product />
		</div>
	)
}

export default MainPage;