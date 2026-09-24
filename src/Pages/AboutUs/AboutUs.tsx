// src/Pages/AboutUs/AboutUs.tsx
import StaticPage from "../../Components/StaticPage/StaticPage";
import { useAppSelector } from "../../Hooks/hooks";

const AboutUs = () => {
    const {PageData}=useAppSelector((state)=>state.PagesSlice)

  return <StaticPage  content={PageData?.about_us??""} />;
};

export default AboutUs;
