// src/Pages/AboutUs/AboutUs.tsx
import StaticPage from "../../Components/StaticPage/StaticPage";
import { useAppSelector } from "../../Hooks/hooks";

const CancellationPolicy = () => {
    const {PageData}=useAppSelector((state)=>state.PagesSlice)

  return <StaticPage  content={PageData?.cancellation_page.content??""} />;
};

export default CancellationPolicy;
