import { Button } from "react-bootstrap"
import { useNavigate } from "react-router"
import guest_login from "../../assets/image/guest_login.png"
const NotLoginComponent = () => {
    const navigate=useNavigate()
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
