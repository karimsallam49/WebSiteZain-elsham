// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { HeaderUrl } from "../../EndPoints/EndPoints";
import { memo, useEffect, useState } from "react";
import { useAppSelector } from "../../Hooks/hooks";
import MobileSocialMedia from "../MobileSocialMedia/MobileSocialMedia";
import { useTranslation } from "react-i18next";
// import LanguageSwitcher from "../LanguageSwitchButton/LanguageSwitcher";
const HeaderComponentBase = () => {
  const {BranchImages}=useAppSelector((state)=>state.BranchImages)
  const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const [photo,setphoto]=useState("")
  const { i18n } = useTranslation();

  const flexDirection = i18n.dir() === "rtl" ? "flex-row" : "flex-row-reverse";
    useEffect(()=>{
  const BranchUrl=resturantdata?.base_urls.branch_image_url
   const PhotoUrl=`${BranchUrl}/${BranchImages?.header_image}`

      setphoto(PhotoUrl)
    },[resturantdata,BranchImages])


  return (
    <div
      className="d-flex flex-column align-items-center position-relative justify-content-center text-white w-100"
      style={{ padding: ".5rem" }}
    >
<div className={`d-flex flex-row align-items-center  ${flexDirection}`} style={{ position:"absolute",right:"5%",top:"-100px",gap:"10px" }}>


      <div style={{ width:"160px" ,border:"5px solid #722914",height:"160px" }} className="resturant-logo rounded-circle d-flex justify-content-center align-items-center overflow-hidden ">

      <img
      loading="lazy"
        src={photo}
        alt="شعار المطعم"
        className="rounded-circle h-100"
        style={{ width: "100%", objectFit: "cover",transform:"scale(.99)" }}
        />
        </div>


        <div style={{ paddingTop:"2rem" }} >

          <MobileSocialMedia/>
        </div>
        </div>
    </div>
  );
};

export const HeaderComponent = memo(HeaderComponentBase);
