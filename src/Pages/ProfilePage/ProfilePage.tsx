import React, { useState, useRef } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheck,
} from "react-icons/fa";
import placeholderuser from "../../assets/image/placeholder_user.png"
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  image: string | null;
}
import "./profilePage.css"
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actUpdateUser } from "../../store/User/actUpdateUser";
import ButtonComponent from "../../Components/Button/ButtonComponent";
import { actGetUser } from "../../store/User/actGetUser";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";


const ProfilePage = () => {
  const {UserData}=useAppSelector((state)=>state.UserInfoSLice)
  const dispatch=useAppDispatch()
    const[Loading,setLoading]=useState(false)
const [Toast, setToast] = useState({
  show: false,
  message: "",
  type: "success" as "success" | "error",
});  const [profile, setProfile] = useState<ProfileData>({
    firstName: UserData?.f_name??"",
    lastName: UserData?.l_name??"",
    email: UserData?.email??"",
    phone: UserData?.phone??"",
    password: "",
    confirmPassword: "",
    image: UserData?.image??"",
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlign = i18n.language === "ar" ? "text-end" : "text-start";
  const lang=i18n.language

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    const APIBoody={
      f_name:profile.firstName,
      l_name:profile.lastName,
      phone:profile.phone,
      password:profile.password,
      email:profile.email
    }
      setLoading(true)
    dispatch(actUpdateUser(APIBoody)).then(()=>{
      setLoading(false)
      dispatch(actGetUser())
        setToast({
        show: true,
          message: t("profile.success"),
        type: "success",
      });
    }).catch(() => {
      setLoading(false);
      setToast({
        show: true,
          message: t("profile.error"),
        type: "error",
      });
    });
    
    e.preventDefault();
    
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container vh-100 profile-page" dir={direction}>
      <div
        className=" rounded-3 shadow-sm"
        style={{
         
          borderTop: "5px solid #f7f2f1ff",
          height:"20%",
        }}
      >
        
        <div className="text-center position-relative profileheader h-100 mb-4"style={{ backgroundColor: "#ecd1cdff",}}>
          <div className="d-inline-block profile">
            <Image
              src={
                profile.image ||
                placeholderuser
              }
              roundedCircle
              style={{
                width: "130px",
                height: "130px",
                backgroundColor: "#f5f5f5",
                objectFit: "cover",
              }}
            />
            <Button
              variant="none"
              className="position-absolute bottom-0 end-0 border-0 rounded-circle p-2"
              style={{ backgroundColor: "#5E2B1D" }}
              onClick={() => inputRef.current?.click()}
            >
              <FaCamera color="white" />
            </Button>
            <input
              type="file"
              ref={inputRef}
              accept="image/*"
              className="d-none"
              onChange={handleImageChange}
            />
          </div>
        </div>

      
        <Form className="form-profile" onSubmit={handleSubmit}>
          <Row className="gy-3">
  
            <Col md={6}>
              <Form.Label className={textAlign}>
                {t("profile.firstName")} <span className="text-danger">*</span>
                <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup dir={direction}>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>

            
            <Col md={6}>
              <Form.Label className={textAlign}>
                {t("profile.lastName")} <span className="text-danger">*</span>
                <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup dir={direction}>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>

           
            <Col md={6}>
              <Form.Label className={textAlign}>
              <Form.Label className={textAlign}>{t("profile.email")}</Form.Label>
              </Form.Label>
              <InputGroup dir={direction}>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>

            
            <Col md={6}>
              <Form.Label className={textAlign}>
              <Form.Label className={textAlign}>{t("profile.phone")}</Form.Label>
              </Form.Label>
              <OverlayTrigger
                placement={lang === "ar" ? "left" : "right"}
                overlay={
                  <Tooltip id="tooltip-top">
                    {t("profile.tooltipPhone")}
                  </Tooltip>
                }
              >
                <div>
                  <InputGroup dir={direction}>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      value={profile.phone}
                      readOnly
                      style={{ backgroundColor: "#f8f9fa", color: "#555" }}
                    />
                    <InputGroup.Text className="text-success fw-bold">
                      <FaCheck />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </OverlayTrigger>
            </Col>

         
            <Col md={6}>
              <Form.Label className={textAlign}>
                {t("profile.password")} <span className="text-danger">*</span>
                <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup dir={direction}>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                    placeholder={t("profile.enterNewPassword")}

                  value={profile.password}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>

            
            <Col md={6}>
              <Form.Label className={textAlign}>
                {t("profile.confirmPassword")}
              </Form.Label>
              <InputGroup dir={direction}>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                   placeholder={t("profile.confirmNewPassword")}

                  value={profile.confirmPassword}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <ButtonComponent
            type="submit"
            text={t("profile.update")}
            loading={Loading}
/>
          </div>
        </Form>
      </div>
         <FeedbackToast
  show={Toast.show}
  message={Toast.message}
  type={Toast.type}
  onClose={() => setToast({ ...Toast, show: false })}
/>
    </div>
  );
};

export default ProfilePage;
