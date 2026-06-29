import Image from "next/image";
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
		<Image
			src={`https://res.cloudinary.com/dpflpiqbz/image/upload/f_auto,q_auto,w_800/v1773913782/${src}`}
			alt="image"
			width={width}
			height={height}
			sizes="100vw"
			loading="lazy"
			blurDataURL={`https://res.cloudinary.com/dpflpiqbz/image/upload/e_blur:1000,q_1,w_50/${src}`}
		/>
	);
};

export default ImageLoaderWithCloudinary;
