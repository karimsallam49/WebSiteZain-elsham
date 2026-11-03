import { Button } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import guest_login_ar from "../../assets/image/guest_login.webp"
import guest_login_en from "../../assets/image/guest_login_en.webp"
const NotLoginComponent = () => {
    const navigate=useNavigate()
    const { i18n } = useTranslation()
    const guest_login = i18n.language === "ar" ? guest_login_ar : guest_login_en
  return (
    <div className=" d-flex flex-column container"style={{width:"100vw",height:"90vh",alignItems:"center",justifyContent:"center"}}>
      <img className=" objectfit-contain" style={{objectFit:"contain",width:"40%",height:"40%"}} src={guest_login} alt="" />

<h3>
    guest Mode
</h3>

<p>
  Now you are in Guest Mode Please login 
</p>
      <Button className="backgroundMainColor border-0" onClick={()=>navigate("/register-otp")}>
        Login
      </Button>
    </div>
  )
}

export default NotLoginComponent
