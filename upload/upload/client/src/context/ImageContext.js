import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
	const [images, setImages] = useState([]);
	const [imageUrl, setImageUrl] = useState("/images");
	const [imageLoad, setImageLoad] = useState(false);
	const [imageError, setImageError] = useState(false);
	const pastImageUrlRef = useRef();

	useEffect(() => {
		if(pastImageUrlRef.current === imageUrl) return;
		setImageLoad(true);
		axios
			.get(imageUrl) //이미지 데이터 가져오기
			.then((result) => setImages((prevData) => [...prevData, ...result.data]))
			.catch((err) => {
				console.error(err);
				setImageError(err)
			})
			.finally(() => {
				setImageLoad(false);
				pastImageUrlRef.current = imageUrl;
			});
	}, [imageUrl]);

	// const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;
	// const loadMoreImages = useCallback(() => {
	// 	if(imageLoad || !lastImageId) return;
		
	// 	setImageUrl(`/images?lastid=${lastImageId}`);
	// },[lastImageId, imageLoad]);

	
	return (
		<ImageContext.Provider value={{images, setImages, imageLoad, imageError, setImageUrl}}>
			{prop.children}
		</ImageContext.Provider>
	)
}