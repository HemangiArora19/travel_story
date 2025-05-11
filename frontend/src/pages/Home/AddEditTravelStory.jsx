import React, { useState } from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSector from '../../components/Cards/DateSector';
import ImageSector from '../../components/Cards/ImageSector';
import TagInput from '../../components/Cards/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';
const token = localStorage.getItem("token");
const AddEditTravelStory = ({
  storyInfo = {}, // Default to an empty object
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [error, setError] = useState("");
// const updateTravelStory= async()=>{
//   try {
//     const id=storyInfo._id
//     let imgUrl = "";

    
//     const postData = {
//       title,
//       story,
//       imageUrl: imageUrl || "",
//       visitedLocation,
//       visitedDate: visitedDate
//         ? moment(visitedDate).valueOf()
//         : moment().valueOf(),
//     };
    
//     if (typeof storyImg === "object") {
//       // Upload New Image
//       const imgUploadRes = await uploadImage(storyImg);
//       imageUrl = imgUploadRes.imageUrl || "";
    
//       postData = {
//         ...postData,
//         imageUrl: imageUrl,
//       };
//     }
    
   
    
//     const response = await axiosInstance.post(
//       "/edit-story/"+id,postData,
      
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
//         },
//       }
//     );

//     if (response.data && response.data.story) {
//       toast.success("Story added successfully");
//       getAllTravelStories();
//       // Close the modal or form
//       onClose();
//     }
//   } catch (error) {
//     console.error("Error adding travel story:", error);
//     toast.error("Failed to add the story. Please try again.");
//   }




// }
const updateTravelStory = async () => {
  try {
    const id = storyInfo._id;
    let imgUrl = storyImg;
    const token = localStorage.getItem("token");

    if (typeof storyImg === "object") {
      // Upload New Image
      const imgUploadRes = await uploadImage(storyImg);
      imgUrl = imgUploadRes?.imageUrl || "";
    }

    const postData = {
      title,
      story,
      imageUrl: imgUrl,
      visitedLocation,
      visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
    };

    const response = await axiosInstance.post(`/edit-story/${id}`, postData,  {
      headers: {
        Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
      },
    });

    if (response.data?.story) {
      toast.success("Story updated successfully!");
      getAllTravelStories();
      onClose();
    }
  } catch (error) {
    console.error("Error updating travel story:", error);
    toast.error("Failed to update the story. Please try again.");
  }
};
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${token}` },
});


// const handleDeleteStroryImg=async ()=>{
// const imgUrl=storyInfo?.imageUrl;
// try{
//   const response= await axiosInstance.delete(
//     '/delete-image',
//     {
//       params: { imageUrl: imgUrl },
      
//     }
//   );
//   if (response.data && !response.data.error) {
//     console.log("Image deleted successfully.");
//     toast.success("Image deleted successfully!");
//     setImage(null); // Clear the image state after successful deletion
//   } else {
//     console.error(
//       "Error deleting image:",
//       response.data.message || "Unknown error occurred"
//     );
//     toast.error(response.data.message || "Failed to delete image.");
//   }
// } catch (error) {
//   console.error("Error occurred while deleting the image:", error.message);
//   console.error("Full error object:", error);
//   toast.error("An unexpected error occurred while deleting the image.");
// }
  
// }

const handleDeleteStroryImg = async () => {
  if (!storyImg) {
    console.error("No image selected to delete.");
    toast.error("No image selected to delete.");
    return;
  }

  try {
    console.log(`Attempting to delete image: ${storyImg}`);

    const response = await axiosInstance.delete('/delete-image', {
      params: { imageUrl: storyImg },
    });

    if (response.data && !response.data.error) {
      console.log("Image deleted successfully.");
      toast.success("Image deleted successfully!");
      setStoryImg(null); // Clear the storyImg state after successful deletion
    } else {
      const errorMessage = response.data?.message || "Failed to delete image.";
      console.error("Error deleting image:", errorMessage);
      toast.error(errorMessage);
    }
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      toast.error(error.response.data.message || "Failed to delete image due to server error.");
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No response from server. Please check your network connection.");
    } else {
      console.error("Unexpected error:", error.message);
      toast.error("An unexpected error occurred while deleting the image.");
    }
  }
};

const addNewTravelStory = async () => {
  try {
    let imgUrl = "";
    const token = localStorage.getItem("token");
    if (storyImg) {
      // Upload the image if it exists
      const imgUpload = await uploadImage(storyImg);
      console.log(imgUpload);
      
      imgUrl = imgUpload.imageUrl || ""; // Get the uploaded image URL or fallback to an empty string
    }

   
    
    const response = await axiosInstance.post(
      "/add-travel-story",
      {
        title,
        story,
        imageUrl: imgUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
        },
      }
    );

    if (response.data && response.data.story) {
      toast.success("Story added successfully");
      getAllTravelStories();
      // Close the modal or form
      onClose();
    }
  } catch (error) {
    console.error("Error adding travel story:", error);
    toast.error("Failed to add the story. Please try again.");
  }
};

const handleAddOrUpdateClick=()=>{
  console.log({title,storyImg,story,visitedDate})
  if(!title){
    setError("Plese enter the title")
    return;
  }
  if(!story){
    setError("Plese enter the title")
    return
  }
  setError("");
  if(type==="edit"){
    updateTravelStory();
  }else{
    addNewTravelStory();
  }
  
}
  return (
    <>
    <div className='relative'>
    <div className="flex items-center justify-between">
      <h5 className="text-xl font-medium text-slate-700">
        {type === "add" ? "Add Story" : "Update Story"}
      </h5>

      <div>
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
         {type==='add'? (<button className="btn-small" onClick={handleAddOrUpdateClick}>
            <MdAdd className="text-lg" /> ADD STORY
          </button>):(<>
          <button className='btn-small' onClick={handleAddOrUpdateClick}>
            <MdUpdate className='text-lg'/> UPDATE STORY
          </button>
          {/* <button className='btn-small bg-rose-400 text-white' onClick={onclose}>
            <MdUpdate className='text-lg'/> DELETE STORY
          </button> */}

          </>)}
          

          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>

         {error &&(<p className='text-red-500 text-xs pt-2 text-right'>{error}</p>)}

      </div>
    </div>
    <div>
      <div className='flex-1 flex flex-col gap-2 pt-4'>
        <label className='input-label'>TITLE</label>
        <input type='text' className='text-2xl text-slate-950 outline-none'
        placeholder='A Day at the Great Wall'
        value={title}
        onChange={({target})=>setTitle(target.value)}
        />
       <div className='my-3'>
       <DateSector date={visitedDate} setDate={setVisitedDate} />

       </div>
       <ImageSector image={storyImg} setImage={setStoryImg}
       handleDeleteImg={handleDeleteStroryImg}
       />
       <div className='flex flex-col gap-3 mt-4'>
        <label className='input-label'>STORY</label>
        <textarea
        type="text"
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='Your Story'
        rows={10}
        value={story}
        onChange={({target})=>setStory(target.value)}
        />
       </div>

       <div className='pt-3'>
        <label className='input-label'>VISITED LOCATION</label>
        <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>

       </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default AddEditTravelStory

