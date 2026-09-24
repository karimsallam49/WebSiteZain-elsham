import StaticPage from "../../Components/StaticPage/StaticPage";
import { useAppSelector } from "../../Hooks/hooks";

const TermsAndConditions  = () => {
    const {PageData}=useAppSelector((state)=>state.PagesSlice)

  return <StaticPage  content={PageData?.terms_and_conditions??""} />;
};

export default TermsAndConditions ;
