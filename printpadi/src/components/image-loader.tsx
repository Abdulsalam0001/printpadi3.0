import React from "react";

const ImageLoaderWithCloudinary = ({
	src,
	width,
	height,
}: {
	src: string;
	width: number;
	height: number;
}) => {
	return (
		<img
			src={`https://res.cloudinary.com/dpflpiqbz/image/upload/f_auto,q_auto,w_800/v1773913782/${src}`}
			alt="image"
			width={width}
			height={height}
			loading="lazy"
			style={{ objectFit: 'cover' }}
		/>
	);
};

export default ImageLoaderWithCloudinary;
