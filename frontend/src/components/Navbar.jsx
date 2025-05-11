import React from 'react'
import Logo from "../assets/images/Logo.svg";
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './Cards/SearchBar';



function Navbar({userInfo,searchQuery,setSearchQuery,handleClearSearch,onSearchStory}) {
  const isToken =localStorage.getItem("token");
    const navigate= useNavigate();
    const onLogout=()=>{
      localStorage.clear();
      navigate("/login")
    }
const  handleSearch=()=>{
  if(searchQuery){
    onSearchStory(searchQuery)
  }
}

const  onClearSearch=()=>{
  handleClearSearch();
  setSearchQuery("");
}
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
         <img src={Logo} alt="" srcset="" class="h-11" /> 
       
         {isToken&& 
         <>
         <SearchBar
         value={searchQuery}
         onChange={({target})=>{
          setSearchQuery(target.value)

         }}
         handleSearch={handleSearch}
         onClearSearch={onClearSearch}
         />
         <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
         </>}
    </div>
   
  )
}

export default Navbar