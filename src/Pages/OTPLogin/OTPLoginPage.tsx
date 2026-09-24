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
  Dropdown,
  Image,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actOTPLogin } from "../../store/Auth/OTP/actOTPLogin";
import { actVerifyPhone } from "../../store/Auth/OTP/actVerifiyPhone";
import mobileCodePic from "../../assets/svg/otp_verification.svg"
import { ResturantIMG } from "../../EndPoints/EndPoints";
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

  const [selectedCountry, setSelectedCountry] = useState<Country>(countryList[0]);
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
const { t } = useTranslation();

  const {resturantdata}=useAppSelector((state)=>state.restaurantSettingsSlice)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
const logoImage = `${ResturantIMG}/${resturantdata?.restaurant_logo}`;

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
    setError(err || t("login_failed"));
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
    <Container className="py-5 d-flex align-items-center justify-content-center otp-login-page" dir="ltr" style={{ height: "90vh" }}>
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
                  <div style={{ height: "20vh" }} className="logo w-100 d-flex align-items-center justify-content-center">
                    <img className="object-fit-contain" style={{ width: "100%", height: "60px" }} src={logoImage} alt="" />
                  </div>

                  <div className="text-center mb-4 fw-semibold">
                    Complete your registration
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="w-100 d-flex align-items-center justify-content-center">

                  <ButtonComponent
                    text="Register"
                    loading={loading}
                    onClick={handleRegister}
                    className="w-100"
                    />
                    </div>
                </>
              )}

              {showLoginFiled && !showRegistureFiled && (
                <>
                  <div style={{ height: "20vh" }} className="logo w-100 d-flex align-items-center justify-content-center">
                    <img className="object-fit-contain" style={{ width: "100%", height: "60px" }} src={logoImage} alt="" />
                  </div>

                  <div className="text-center mb-4 fw-semibold">
                    Enter your password to continue
                  </div>


                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <div className="w-100 text-end">
                    <Link to="/forget-password">
                      Forget Password?
                    </Link>
                  </div>
                  <div className="w-100 d-flex align-items-center justify-content-center">

                  <ButtonComponent
                    text="Login"
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
                    Back
                  </Button>
                </>
              )}

              {!showRegistureFiled && !showLoginFiled && (
                <>
                  {showOtpField && (
                    <div className="w-100">
                      <img className="w-100 object-fit-contain" height={280} src={mobileCodePic} alt="" />
                    </div>
                  )}

                  {!showOtpField && (
                    <>
                      <div style={{ height: "20vh" }} className="logo w-100 d-flex align-items-center justify-content-center">
                        <img className="object-fit-contain" style={{ width: "100%", height: "60px" }} src={logoImage} alt="" />
                      </div>
                      <Form onSubmit={handleSendOtp}>
                        <Form.Group controlId="phone" className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <InputGroup className="phone-input-group">
                            <Dropdown
                              onSelect={(iso) => {
                                const c = countryList.find((x) => x.iso === iso);
                                if (c) setSelectedCountry(c);
                              }}
                            >
                              <Dropdown.Toggle variant="light" className="d-flex align-items-center">
                                <Image
                                  src={selectedCountry.flag}
                                  alt={selectedCountry.name}
                                  rounded
                                  style={{ width: 18, height: 16, marginRight: 8 }}
                                />
                                <span style={{ minWidth: 18 }}>{selectedCountry.code}</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ maxHeight: 250, overflowY: "auto" }}>
                                {countryList.map((c) => (
                                  <Dropdown.Item
                                    key={c.iso}
                                    eventKey={c.iso}
                                    active={c.iso === selectedCountry.iso}
                                  >
                                    <div className="d-flex align-items-center">
                                      <Image
                                        src={c.flag}
                                        alt={c.name}
                                        rounded
                                        style={{ width: 18, height: 14, marginRight: 8 }}
                                      />
                                      <span style={{ flex: 1 }}>{c.name}</span>
                                      <small className="text-muted">{c.code}</small>
                                    </div>
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                            <Form.Control
                              type="tel"
                              placeholder="Enter your phone number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              dir="ltr"
                            />
                          </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="backgroundMainColor border-0 w-100" disabled={loading}>
                          {loading ? <Spinner size="sm" animation="border" /> : "Send OTP"}
                        </Button>
                      </Form>
                    </>
                  )}


                  {showOtpField && (
                    <>
                      <div className="text-center mb-3 fw-semibold">
                        Enter the 6-digit code sent to{" "}
                        <span className="text-primary">
                          {selectedCountry.code}
                          {formatPhoneNumber(phoneNumber)}
                        </span>
                      </div>

                      <div className="d-flex justify-content-center gap-2 mb-3">
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
                              Resend
                            </Button>
                          ) : (
                            <>Resend in {timer}s</>
                          )}
                        </small>
                      </div>

                      {allFilled && (
                        <div className="w-100">
                          <ButtonComponent
                            text="Apply"
                            loading={loading}
                            onClick={handleVerifyOtp}
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
                        Change phone number
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
