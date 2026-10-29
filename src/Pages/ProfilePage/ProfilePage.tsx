import React, { useState, useRef } from "react";
import { Form, Row, Col, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheck,
} from "react-icons/fa";
import placeholderuser from "../../assets/image/placeholder_user.png";
import "./profilePage.css";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actUpdateUser } from "../../store/User/actUpdateUser";
import ButtonComponent from "../../Components/Button/ButtonComponent";
import { actGetUser } from "../../store/User/actGetUser";
import FeedbackToast from "../../Components/FeedbackToast/FeedbackToast";
import { ProfileImageUrl } from "../../EndPoints/EndPoints";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  image: string | null;
}

const ProfilePage = () => {
  const { UserData } = useAppSelector((state) => state.UserInfoSLice);
  const dispatch = useAppDispatch();
  const [Loading, setLoading] = useState(false);
  const [Toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [profile, setProfile] = useState<ProfileData>({
    firstName: UserData?.f_name ?? "",
    lastName: UserData?.l_name ?? "",
    email: UserData?.email ?? "",
    phone: UserData?.phone ?? "",
    password: "",
    confirmPassword: "",
    image: UserData?.image ?? "",
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const lang = i18n.language;

  const avatarSrc = profile.image
    ? profile.image.startsWith("data:") || profile.image.startsWith("http")
      ? profile.image
      : `${ProfileImageUrl}/${profile.image}`
    : placeholderuser;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const APIBoody = {
      f_name: profile.firstName,
      l_name: profile.lastName,
      phone: profile.phone,
      password: profile.password,
      email: profile.email,
    };
    setLoading(true);
    dispatch(actUpdateUser(APIBoody))
      .then(() => {
        setLoading(false);
        dispatch(actGetUser());
        setToast({
          show: true,
          message: t("profile.success"),
          type: "success",
        });
      })
      .catch(() => {
        setLoading(false);
        setToast({
          show: true,
          message: t("profile.error"),
          type: "error",
        });
      });
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
    <div className="container profile-page" dir={direction}>
      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            <img src={avatarSrc} alt="" />
            <button
              type="button"
              className="profile-avatar-cam"
              onClick={() => inputRef.current?.click()}
              aria-label="change photo"
            >
              <FaCamera />
            </button>
            <input
              type="file"
              ref={inputRef}
              accept="image/*"
              className="d-none"
              onChange={handleImageChange}
            />
          </div>
          <h5 className="profile-name">
            {`${profile.firstName} ${profile.lastName}`.trim()}
          </h5>
          <span className="profile-sub">{profile.email}</span>
          {profile.phone && (
            <span className="profile-phone">
              <FaCheck size={9} /> {profile.phone}
            </span>
          )}
        </div>

        <div className="profile-section-title">
          <span>{t("profile.title")}</span>
        </div>

        <Form className="form-profile" onSubmit={handleSubmit}>
          <Row className="gy-3">
            <Col md={6}>
              <Form.Label>
                {t("profile.firstName")} <span className="text-danger">*</span>
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
              <Form.Label>
                {t("profile.lastName")} <span className="text-danger">*</span>
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
              <Form.Label>{t("profile.email")}</Form.Label>
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
              <Form.Label>{t("profile.phone")}</Form.Label>
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
                    <Form.Control value={profile.phone} readOnly />
                    <InputGroup.Text className="text-success">
                      <FaCheck />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </OverlayTrigger>
            </Col>

            <Col md={6}>
              <Form.Label>{t("profile.password")}</Form.Label>
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
              <Form.Label>{t("profile.confirmPassword")}</Form.Label>
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

          <div className="profile-submit">
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
