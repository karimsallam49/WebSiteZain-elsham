import StaticPage from "../../Components/StaticPage/StaticPage";
import { useAppSelector } from "../../Hooks/hooks";

const PrivacyPolicy  = () => {
    const {PageData}=useAppSelector((state)=>state.PagesSlice)

  return <StaticPage  content={PageData?.privacy_policy??""} />;
};

export default PrivacyPolicy ;
