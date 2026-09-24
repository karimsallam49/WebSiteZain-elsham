// src/Pages/AboutUs/AboutUs.tsx
import StaticPage from "../../Components/StaticPage/StaticPage";
import { useAppSelector } from "../../Hooks/hooks";

const RefundPolicy  = () => {
    const {PageData}=useAppSelector((state)=>state.PagesSlice)

  return <StaticPage  content={PageData?.refund_page.content??""} />;
};

export default RefundPolicy ;
