import React, { useState, useEffect, useRef } from "react";
import {
  Spinner,
  Alert,
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Hooks/hooks";
import { actOTPLogin } from "../../store/Auth/OTP/actOTPLogin";
import { actVerifyPhone } from "../../store/Auth/OTP/actVerifiyPhone";
import mobileCodePic from "../../assets/image/OTP.webp"
import zainGif from "../../assets/image/Zain El Sham - Transparent.webp"
import object3Png from "../../assets/image/object3.webp"
import ButtonComponent from "../../Components/Button/ButtonComponent";
import { useTranslation } from "react-i18next";
import { actLoginByPhone } from "../../store/Auth/OTP/actLoginByPhone";
import { actRegisterByPhone } from "../../store/Auth/OTP/actRegisterByPhone";
import "./OTPLoginPage.css";
interface Country {
  name: string;
  code: string;
  flag: string;
  iso: string;
}

const countryList: Country[] = [
  { name: "Egypt", code: "+20", flag: "https://flagcdn.com/w40/eg.png", iso: "EG" },
  { name: "Saudi Arabia", code: "+966", flag: "https://flagcdn.com/w40/sa.png", iso: "SA" },
  { name: "United Arab Emirates", code: "+971", flag: "https://flagcdn.com/w40/ae.png", iso: "AE" },
  { name: "Kuwait", code: "+965", flag: "https://flagcdn.com/w40/kw.png", iso: "KW" },
  { name: "Qatar", code: "+974", flag: "https://flagcdn.com/w40/qa.png", iso: "QA" },
  { name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png", iso: "US" },
  { name: "United Kingdom", code: "+44", flag: "https://flagcdn.com/w40/gb.png", iso: "GB" },
];

const RegisterWithOTP = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedCountry = countryList[0]; // كود الدولة ثابت على مصر
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [showOtpField, setShowOtpField] = useState(false);
  const [showLoginFiled, setShowLoginFiled] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showRegistureFiled, setShowRegistureFiled] = useState(false);

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
    const location = useLocation();
const { t, i18n } = useTranslation();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // لوجو البراند — الإمبلم المتحرّك فوق اسم المطعم
  const brandLogo = (
    <div className="otp-brand">
      <img src={zainGif} alt="Zain El Sham" />
      <img src={object3Png} alt="" />
    </div>
  );

  useEffect(() => {
    if (showOtpField) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [showOtpField]);


  const formatPhoneNumber = (raw: string): string => {
    let formatted = raw.trim().replace(/^0+/, "");
    if (formatted.startsWith(selectedCountry.code.replace("+", ""))) {
      formatted = formatted.replace(selectedCountry.code.replace("+", ""), "");
    }
    return formatted;
  };

  const handleRegister = async () => {
  if (!firstName || !lastName || !registerPassword) {
    return setError(t("fill_all_fields"));
  }

  const cleanNumber = formatPhoneNumber(phoneNumber);
  const fullPhone = `${selectedCountry.code}${cleanNumber}`;

  setLoading(true);
  try {
    const res = await dispatch(
      actRegisterByPhone({
        phone: fullPhone,
        first_name: firstName,
        last_name: lastName,
        password: registerPassword,
      })
    ).unwrap();

    if ( res.token) {
      navigate("/");
    } else {
      setError(t("register_failed"));
    }
  } catch (err: any) {
    setError(err || t("register_failed"));
  } finally {
    setLoading(false);
  }
};
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phoneNumber) return  setError(t("enter_phone_number"));
    const cleanNumber = formatPhoneNumber(phoneNumber);
    const fullPhone = `${selectedCountry.code}${cleanNumber}`;
    setLoading(true);
    try {
      const res = await dispatch(actOTPLogin(fullPhone)).unwrap();
      if (res.message === "success" && res.token === "active") {
         setSuccess(t("otp_sent_success"));
        setShowOtpField(true);
        startTimer();
      }else if(res.Userexists ) {
      setShowOtpField(false);
      setShowLoginFiled(true);
      }
      
      else {
      setError(t("otp_send_failed"));
      }
    } catch (err: any) {
      setError(err || "حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) return setError(t("enter_full_otp"));
    const cleanNumber = formatPhoneNumber(phoneNumber);
    const fullPhone = `${selectedCountry.code}${cleanNumber}`;

    setLoading(true);
    try {
      const body = { phone: fullPhone, token: otp };
      const res = await dispatch(actVerifyPhone(body)).unwrap();

      if (res.status && res.token) {
      setSuccess(t("otp_verify_success"));
           const fromCart = location.state?.fromCart; 
      if (fromCart) {
        navigate("/checkout", { replace: true }); 
      } else {
        navigate("/"); 
      }
      }
       
       else if(res.temporary_token &&res.status === false) {
     setShowOtpField(false);
  setShowLoginFiled(false);
  setShowRegistureFiled(true);
      }
      else{
        setError(t("otp_invalid"));
      }
    } catch (err: any) {
    setError(err || t("otp_verify_error"));
    } finally {
      setLoading(false);
    }
  };

 
  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  useEffect(() => {
    if (!showOtpField) return;
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showOtpField, timer]);
const handleLoginWithPassword = async () => {
  if (!password) return setError(t("enter_password"));

  const cleanNumber = formatPhoneNumber(phoneNumber);
  const fullPhone = `${selectedCountry.code}${cleanNumber}`;

  setLoading(true);
  try {
    const res = await dispatch(
      actLoginByPhone({ phone: fullPhone, password })
    ).unwrap();

    if (res.status && res.token) {
      navigate("/");
    } else {
      setError(t("invalid_credentials"));
    }
  } catch (err: any) {
    // فشل تسجيل الدخول (401 وغيره) — رسالة مترجمة بدل نص axios الخام
    setError(t("invalid_credentials"));
  } finally {
    setLoading(false);
  }
};
 
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

  
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6 - index);
      const updated = [...otpDigits];
      for (let i = 0; i < digits.length; i++) {
        updated[index + i] = digits[i];
      }
      setOtpDigits(updated);
      const nextIndex = Math.min(index + digits.length, 5);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
      return;
    }

    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    if (value && index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      e.preventDefault();
      setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return;
    const chars = paste.split("");
    const updated = [...otpDigits];
    for (let i = 0; i < chars.length && index + i < 6; i++) {
      updated[index + i] = chars[i];
    }
    setOtpDigits(updated);
    const focusIndex = Math.min(index + chars.length, 5);
    setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
  };

  const allFilled = otpDigits.every((d) => d !== "");

  return (
    <Container className="py-5 d-flex align-items-center justify-content-center otp-login-page" dir={i18n.dir()} style={{ minHeight: "92vh" }}>
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5}>
          <Card className="shadow-lg p-4 rounded-4 border-0">
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {showRegistureFiled && (
                <>
                  {brandLogo}

                  <div className="text-center mb-4 fw-semibold">
                    {t("checkout.otp_complete_reg")}
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>{t("checkout.otp_first_name")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t("checkout.otp_last_name")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t("checkout.otp_password")}</Form.Label>
                    <Form.Control
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="w-100 d-flex align-items-center justify-content-center">

                  <ButtonComponent
                    text={t("checkout.otp_register")}
                    loading={loading}
                    onClick={handleRegister}
                    className="w-100"
                    />
                    </div>
                </>
              )}

              {showLoginFiled && !showRegistureFiled && (
                <>
                  {brandLogo}

                  <div className="text-center mb-4 fw-semibold">
                    {t("checkout.otp_enter_password")}
                  </div>


                  <Form.Group className="mb-3">
                    <Form.Label>{t("checkout.otp_password")}</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={t("checkout.otp_password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <div className="w-100 text-end mb-3">
                    <Link
                      to="/forget-password"
                      className="TextMainColor text-decoration-underline small fw-semibold"
                    >
                      {t("checkout.otp_forgot")}
                    </Link>
                  </div>
                  <div className="w-100 d-flex align-items-center justify-content-center">

                  <ButtonComponent
                    text={t("checkout.otp_login")}
                    className="w-100"
                    loading={loading}
                    onClick={handleLoginWithPassword}
                    />
                    </div>

                  <Button
                    variant="link"
                    className="w-100 mt-3 text-decoration-none"
                    onClick={() => {
                      setShowLoginFiled(false);
                      setShowOtpField(false);
                      setPassword("");
                    }}
                  >
                    {t("checkout.otp_back")}
                  </Button>
                </>
              )}

              {!showRegistureFiled && !showLoginFiled && (
                <>
                  {showOtpField && (
                    <div className="w-100 d-flex justify-content-center">
                      <img className="object-fit-contain" style={{ width: "55%" }} src={mobileCodePic} alt="" />
                    </div>
                  )}

                  {!showOtpField && (
                    <>
                      {brandLogo}
                      <Form onSubmit={handleSendOtp}>
                        <Form.Group controlId="phone" className="mb-3">
                          <Form.Label>{t("checkout.otp_phone_label")}</Form.Label>
                          <InputGroup className="phone-input-group">
                            <Form.Control
                              type="tel"
                              placeholder={t("checkout.otp_phone_placeholder")}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              dir="ltr"
                            />
                          </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="backgroundMainColor border-0 w-100" disabled={loading}>
                          {loading ? <Spinner size="sm" animation="border" /> : t("checkout.otp_send")}
                        </Button>
                      </Form>
                    </>
                  )}


                  {showOtpField && (
                    <>
                      <div className="text-center mb-3 fw-semibold">
                        {t("checkout.otp_sent_to")}{" "}
                        <span className="text-primary">
                          {selectedCountry.code}
                          {formatPhoneNumber(phoneNumber)}
                        </span>
                      </div>

                      <div className="d-flex justify-content-center gap-2 mb-3" dir="ltr">
                        {otpDigits.map((digit, i) => (
                          <Form.Control
                            key={i}
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            ref={(el) => {
                              inputRefs.current[i] = el;
                            }}
                            onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, i)}
                            onPaste={(e) => handlePaste(e as React.ClipboardEvent<HTMLInputElement>, i)}
                            maxLength={1}
                            style={{
                              width: 45,
                              height: 55,
                              textAlign: "center",
                              fontSize: 22,
                              borderRadius: 8,
                            }}
                          />
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-muted">
                          {canResend ? (
                            <Button
                              variant="link"
                              className="p-0 text-decoration-none"
                              onClick={() => handleSendOtp()}
                            >
                              {t("checkout.otp_resend")}
                            </Button>
                          ) : (
                            <>{t("checkout.otp_resend_in", { timer })}</>
                          )}
                        </small>
                      </div>

                      {allFilled && (
                        <div className="w-100">
                          <ButtonComponent
                            text={t("checkout.otp_apply")}
                            loading={loading}
                            onClick={handleVerifyOtp}
                            className="w-100"
                          />
                        </div>
                      )}

                      <Button
                        variant="link"
                        onClick={() => {
                          setShowOtpField(false);
                          setOtpDigits(Array(6).fill(""));
                        }}
                        className="w-100 mt-3 text-decoration-none"
                      >
                        {t("checkout.otp_change_phone")}
                      </Button>
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterWithOTP;
