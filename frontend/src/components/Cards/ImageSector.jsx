// import React, { useRef } from 'react';
// import { FaRegFileImage } from 'react-icons/fa6';
// import { MdDeleteOutline } from "react-icons/md";
// const ImageSector = ({ image, setImage }) => {
//   const inputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result); // Update image with base64 URL
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage=()=>{}

//   return (
//     <div>
//       {/* Hidden Input */}
//       <input
//         type="file"
//         accept="image/*"
//         ref={inputRef}
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {!image ? (
//         // Upload Button
//         <button
//           className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 hover:shadow-md"
//           onClick={() => inputRef.current?.click()}
//         >
//           <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100 hover:bg-cyan-100">
//             <FaRegFileImage className="text-xl text-cyan-500" />
//           </div>
//           <p className="text-sm text-slate-500">Browse image files to upload</p>
//         </button>
//       ) : (
//         // Display Uploaded Image
//         <div className="w-full h-[220px] flex items-center justify-center bg-slate-50 rounded border border-slate-200/50">
//           <img
//             src={image}
//             alt="Uploaded"
//             className="object-cover w-full h-full rounded"
//           />
//           <button className='btn-small btn-delete absolute top-2 right-2'
//           onClick={handleRemoveImage}
//           >
//             <MdDeleteOutline className='text-lg'/>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageSector;

// import React, { useRef } from 'react';
// import { FaRegFileImage } from 'react-icons/fa6';
// import { MdDeleteOutline } from "react-icons/md";

// const ImageSector = ({ image, setImage }) => {
//   const inputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result); // Update image with base64 URL
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null); // Clear the image
//   };

//   return (
//     <div>
//       {/* Hidden Input */}
//       <input
//         type="file"
//         accept="image/*"
//         ref={inputRef}
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {!image ? (
//         // Upload Button
//         <button
//           className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 hover:shadow-md"
//           onClick={() => inputRef.current?.click()}
//         >
//           <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100 hover:bg-cyan-100">
//             <FaRegFileImage className="text-xl text-cyan-500" />
//           </div>
//           <p className="text-sm text-slate-500">Browse image files to upload</p>
//         </button>
//       ) : (
//         // Display Uploaded Image
//         <div className="relative w-full h-[220px] flex items-center justify-center bg-slate-50 rounded border border-slate-200/50">
//           <img
//             src={image}
//             alt="Uploaded"
//             className="object-cover w-full h-full rounded"
//           />
//           <button
//             className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
//             onClick={handleRemoveImage}
//           >
//             <MdDeleteOutline className="text-lg" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageSector;

import React, { useRef, useState, useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

const ImageSector = ({ image, setImage, handleDeleteImg }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Save the file object
    }
  };
 
    
    
 
  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (handleDeleteImg) {
      handleDeleteImg(); // Call the external delete handler if provided
    }
  };

  useEffect(() => {
    // If the image prop is a string (URL), set it as the preview URL
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      // If the image prop is a File object, create a preview URL
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null); // Clear the preview URL
    }

    // Cleanup object URLs when the component unmounts
    return () => {
      if (previewUrl && typeof previewUrl !== "string") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 hover:shadow-md"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100 hover:bg-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      ) : (
        <div className="relative w-full h-[220px] flex items-center justify-center bg-slate-50 rounded border border-slate-200/50">
          <img
            src={previewUrl}
            alt="Preview"
            className="object-cover w-full h-full rounded"
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleRemoveImage}
          >
            <MdDeleteOutline className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSector;


