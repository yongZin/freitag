// 상품 상세 컴포넌트
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; //관리자 확인용
const GUEST_ID = process.env.REACT_APP_GUEST_ID; //게스트 확인용

const Wrap = styled.div`
	text-align:center;
	transition:0.1s;
	img{
		width:50%;
		max-width:450px;
		margin-bottom:15px;
	}
`;

const BthCont = styled.div`
	display:flex;
	justify-content:space-between;
`;

const LikeBth = styled.div`
	/* width:80px; */
	display:inline-flex;
	align-items:flex-start;
	justify-content:center;
	padding:3px 4px 1px;
	font-size:16px;
	border-radius:4px;
	border:2px solid #bbb;
	color:#777;
	cursor:pointer;
	transition:0.2s;
	svg{
		transition:0.2s;
	}
	span{
		margin:0 3px;
	}
	&:hover{
		border-color:#999;
		svg{
			color:red;
		}
	}
`;

const DelBth = styled.div`
	display:inline-block;
	padding:3px 4px 1px;
	font-size:16px;
	border-radius:4px;
	border:2px solid #bbb;
	color:#777;
	cursor:pointer;
	transition:0.2s;
	&:hover{
		border-color:#999;
	}
`;

const Detail = () => {
	const navigate = useNavigate();
	const [hasLiked, setHasLiked] = useState(false); //좋아요 유무
	const [me] = useContext(AuthContext); //유저정보 가져오기
	const { imageId } = useParams(); //파라미터
	const {images, setImages} = useContext(ImageContext); //이미지정보 가져오기
	const [error, setError] = useState(false);
	const [image, setImage] = useState();
	const [guest, setGuest] = useState();

	useEffect(() => { //images 배열이 바뀔때 마다 이미지 가져오기
		const img = images.find((image) => image._id === imageId); //이미지 가져오기
		if(img) setImage(img);
	}, [imageId, images]);

	useEffect(() => { //첫 로드시
		if(image && image._id === imageId) return;//배열에 이미지가 존재할 때
		else 
			axios //배열에 이미지가 존재하지 않으면 무조건 서버 호출
				.get(`/images/${imageId}`)
				.then(({ data }) => {
					setImage(data);
					setError(false);
					setGuest(data.user._id);
				})
				.catch((err) => {
					setError(true);
					toast.error(err.response.data.message)
				});
	}, [imageId, image]);

	useEffect(() => {
		if(me && image && image.likes.includes(me.userId)) setHasLiked(true); //해당 아이디가 좋아요를 눌렀으면 true
	}, [me, image]);

	if(error) return <h3>Error...</h3> //이미지 가져오기 전 로딩
	else if(!image) return <h3>Loading...</h3> //이미지 가져오기 전 로딩

	const onSubmit = async () => { //좋아요 버튼
		const result = await axios.patch(`/images/${imageId}/${hasLiked ? "unlike" : "like"}`);
		setImages([
			...images.filter((image) => image._id !== imageId),
			result.data
		].sort((a, b) => {
			// new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
			if(a._id < b._id) return 1;
			else return -1;
		}));
		setHasLiked(!hasLiked);
	}

	const deleteHandler = async () => { //삭제 버튼
		try {
			if(!window.confirm("정말 삭제 하시겠습니까?")) return;
			const result = await axios.delete(`/images/${imageId}`);

			toast.success(result.data.message);

			setImages(images.filter(image => image._id !== imageId)); //삭제후 바로 리스트에서 제거
			navigate("/"); //완료시 홈 화면으로 이동
		} catch (err) {
			console.error(err.message);
		}
	}
	
	const detailImg = image.details.map((image) => {
		return(
			<img
				alt=""
				key={image.filename}
				src={`http://localhost:4000/uploads/${image.filename}`}
			/>
		)
	})
	
	return(
		<Wrap className="wrap">
			<BthCont>
				<LikeBth onClick={onSubmit}>
					{hasLiked ? <AiFillHeart style={{color: "red"}} /> : <AiOutlineHeart />}
					<span>좋아요</span>
					{image.likes.length}
				</LikeBth>

				{me && 
					(
						(me.userId) === ADMIN_ID
						|| (((me.userId) === guest) && ((me.userId) === GUEST_ID))
					) &&
					<DelBth onClick={deleteHandler}>삭제</DelBth>
				}
				{/* 관리자는 모든 이미지 삭제권한 부여 */}
				{/* 게스트는 본인이 올린 이미지만 삭제권한 부여 */}

			</BthCont>

			{detailImg}
		</Wrap>
	)
}

export default Detail;