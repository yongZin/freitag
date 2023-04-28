// 상품 리스트 컴포넌트
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import styled from "styled-components";

const ItemList = styled.div`
	a{
		width:calc(50% - 6px);
		display:inline-block;
		vertical-align:top;
		margin:0 6px 5% 0;
		position:relative;
		cursor:pointer;
		&:before{
			content:"";
			display:block;
			padding-bottom:100%;
		}
		img{
			width:100%;
			height:100%;
			object-fit:contain;
			position:absolute;
			top:0;
			left:0;
		}
	}
`;

const Product = () => {
	const { images, imageLoad, imageError, setImageUrl } = useContext(ImageContext);
	const elementRef = useRef(null);

	const loadMoreImages = useCallback(() => {
		if(images.length === 0 || imageLoad) return;
		const lastImageId = images[images.length - 1]._id; //마지막 리스트 정보
		setImageUrl(`/images?lastid=${lastImageId}`);
	}, [images, imageLoad, setImageUrl])

	useEffect(() => {
		if(!elementRef.current) return;
		const observer = new IntersectionObserver(([entry]) => {
			if(entry.isIntersecting) loadMoreImages();
		})
		observer.observe(elementRef.current);
		return () => observer.disconnect();
	}, [loadMoreImages])

	const item = images.map((image, index) => (
		<Link
			key={image.key}
			to={`/images/${image._id}`}
			ref={index + 1 === images.length ? elementRef : undefined} //옵저버 기준
		>
			<img
				key={image.key}
				alt="상품 이미지"
				src={`http://localhost:4000/uploads/${image.key}`}
			/>
		</Link>
	));

	return(
		<ItemList>
			{item}

			{imageError && <div>Error...</div>}
		</ItemList>
	)
}

export default Product;