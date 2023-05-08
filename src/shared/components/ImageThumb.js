import React from 'react'

const ImageThumb = ({ image }) => {
  return <img src={URL.createObjectURL(image)} alt={image.name} />;
//   return <img src={image} alt='' />;
};

export default ImageThumb;