import React ,{useState} from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isPassword,setisPassword]= useState(false);
    const toggleShowPassword=()=>{
        setisPassword(!isPassword)
    }
    return (
      <div className="flex items-center bg-cyan-600/[0.05] px-5 rounded mb-5">
        <input
          type={isPassword?"text":"password"}
          value={value} // This is now properly passed
          onChange={onChange} // Event handler is properly passed
          placeholder={placeholder || "Password"} // Default placeholder
          className="w-full text-sm bg-transparent py-3 outline-none "
        />
        {isPassword?(<FaRegEye size={22} className='text-primary cursor-pointer' onClick={()=>toggleShowPassword()}/>):(<FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer' onClick={()=>toggleShowPassword()}/>)}
      </div>
    );
  };
  
  export default PasswordInput;
  