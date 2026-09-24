
import './BackGroundImage.css'; 
import { useAppSelector } from '../../Hooks/hooks';
import { useEffect, useState } from 'react';
export const BackGroundImage = () => {
    const {BranchImages}=useAppSelector((state)=>state.BranchImages)
    const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
    const [photo,setphoto]=useState("")

    useEffect(()=>{
    const BranchUrl=resturantdata?.base_urls.branch_image_url
    const PhotoUrl=`${BranchUrl}/${BranchImages?.background_image}`
      setphoto(PhotoUrl)
    },[resturantdata,BranchImages])


  return (
    <div className="w-100  d-flex flex-column align-items-center rounded banner-conatiner" style={{height: "300px", }}>
      
<div className="img-container w-100 h-100 d-flex justify-content-center align-items-center">
  <img 
  loading='lazy'      
  src={photo}
 className="w-100 h-100" style={{ objectFit: "cover" }} alt="" />
</div>
    </div>
  );
};
