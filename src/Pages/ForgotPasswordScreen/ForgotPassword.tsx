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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import mobileCodePic from "../../assets/svg/otp_verification.svg";
import { ResturantIMG } from "../../EndPoints/EndPoints";
import ButtonComponent from "../../Components/Button/ButtonComponent";
import { useTranslation } from "react-i18next";
import { actOTPForgetPassword } from "../../store/Auth/ForgetPassword/actOTPForgetPassword";
import { actVerifyForgetPasswordOTP } from "../../store/Auth/ForgetPassword/actVerifyForgetPasswordOTP";
import { actLoginByPhone } from "../../store/Auth/OTP/actLoginByPhone";
import { actResetPassword } from "../../store/Auth/ForgetPassword/actResetPassword";
import "./ForgotPassword.css";

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
];

const ForgetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const logoImage = `${ResturantIMG}/${resturantdata?.restaurant_logo}`;

  const [selectedCountry, setSelectedCountry] = useState<Country>(countryList[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (showOtpField) setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [showOtpField]);

  const formatPhoneNumber = (raw: string): string => {
    let formatted = raw.trim().replace(/^0+/, "");
    if (formatted.startsWith(selectedCountry.code.replace("+", ""))) {
      formatted = formatted.replace(selectedCountry.code.replace("+", ""), "");
    }
    return formatted;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!phoneNumber) return setError(t("enter_phone_number"));

    const cleanNumber = formatPhoneNumber(phoneNumber);
    const fullPhone = `${selectedCountry.code}${cleanNumber}`;

    setLoading(true);
    try {
      const res = await dispatch(actOTPForgetPassword(fullPhone)).unwrap();
      if (res.message === "success") {
        setShowOtpField(true);
        startTimer();
      } else {
        setError(t("otp_send_failed"));
      }
    } catch (err: any) {
      setError(err || t("otp_send_failed"));
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
      const res = await dispatch(actVerifyForgetPasswordOTP({ email_or_phone: fullPhone, reset_token: otp })).unwrap();
      if (res.message==="Token found, you can proceed") {
        setShowOtpField(false);
        setShowPasswordField(true);
      } else {
        setError(t("otp_invalid"));
      }
    } catch (err: any) {
      setError(err || t("otp_verify_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError(t("fill_all_fields"));
    if (newPassword !== confirmPassword) return setError(t("passwords_do_not_match"));

    const cleanNumber = formatPhoneNumber(phoneNumber);
    const fullPhone = `${selectedCountry.code}${cleanNumber}`;
    const body = {
      _method: "put",
      reset_token: otpDigits.join(""), 
      password: newPassword,
      confirm_password: confirmPassword,
      email_or_phone: fullPhone,
      type: "phone",
    };

    setLoading(true);
    try {
      const res = await dispatch(actResetPassword(body)).unwrap();
      if (res.status) {
        const loginRes = await dispatch(actLoginByPhone({ phone: fullPhone, password: newPassword })).unwrap();
        if (loginRes.status===true) {
          navigate("/");
        }
      } else {
        setError(t("reset_failed"));
      }
    } catch (err: any) {
  console.error(err); 
  let errorMessage = t("reset_failed");

  if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    errorMessage = err.errors[0].message;
  } else if (err?.message) {
    errorMessage = err.message;
  }

  setError(errorMessage);
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

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
      const digits = value.split("").slice(0, 6 - index);
      const updated = [...otpDigits];
      for (let i = 0; i < digits.length; i++) updated[index + i] = digits[i];
      setOtpDigits(updated);
      const nextIndex = Math.min(index + digits.length, 5);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
      return;
    }

    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);
    if (value && index < 5) setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      e.preventDefault();
      setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return;
    const chars = paste.split("");
    const updated = [...otpDigits];
    for (let i = 0; i < chars.length && index + i < 6; i++) updated[index + i] = chars[i];
    setOtpDigits(updated);
    const focusIndex = Math.min(index + chars.length, 5);
    setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
  };

  const allFilled = otpDigits.every((d) => d !== "");

  return (
    <Container className="py-5 d-flex align-items-center justify-content-center forgot-password-page" dir="ltr" style={{ height: "90vh" }}>
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5}>
          <Card className="shadow-lg p-4 rounded-4 border-0">
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {!showOtpField && !showPasswordField && (
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
                            <Image src={selectedCountry.flag} alt={selectedCountry.name} rounded style={{ width: 18, height: 16, marginRight: 8 }} />
                            <span style={{ minWidth: 18 }}>{selectedCountry.code}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ maxHeight: 250, overflowY: "auto" }}>
                            {countryList.map((c) => (
                              <Dropdown.Item key={c.iso} eventKey={c.iso} active={c.iso === selectedCountry.iso}>
                                <div className="d-flex align-items-center">
                                  <Image src={c.flag} alt={c.name} rounded style={{ width: 18, height: 14, marginRight: 8 }} />
                                  <span style={{ flex: 1 }}>{c.name}</span>
                                  <small className="text-muted">{c.code}</small>
                                </div>
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        <Form.Control type="tel" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required dir="ltr" />
                      </InputGroup>
                    </Form.Group>
                    <div className="w-100 d-flex align-items-center justify-content-center">

                    <Button type="submit" className="backgroundMainColor border-0 w-100" disabled={loading}>
                      {loading ? <Spinner size="sm" animation="border" /> : "Send OTP"}
                    </Button>
                    </div>
                  </Form>
                </>
              )}

              {showOtpField && (
                <>
                  <div className="w-100">
                    <img className="w-100 object-fit-contain" height={280} src={mobileCodePic} alt="" />
                  </div>

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
                        ref={(el) => { inputRefs.current[i] = el; }}
                        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, i)}
                         onPaste={(e) => handlePaste(e as React.ClipboardEvent<HTMLInputElement>, i)}
                        maxLength={1}
                        style={{ width: 45, height: 55, textAlign: "center", fontSize: 22, borderRadius: 8 }}
                      />
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      {canResend ? (
                        <Button variant="link" className="p-0 text-decoration-none" onClick={() => handleSendOtp()}>
                          Resend
                        </Button>
                      ) : (
                        <>Resend in {timer}s</>
                      )}
                    </small>
                  </div>

                  {allFilled && (
                    <div className="w-100">
                      <ButtonComponent text="Verify OTP" className="w-100" loading={loading} onClick={handleVerifyOtp} />
                    </div>
                  )}

                  <Button variant="link" onClick={() => { setShowOtpField(false); setOtpDigits(Array(6).fill("")); }} className="w-100 mt-3 text-decoration-none">
                    Change phone number
                  </Button>
                </>
              )}

              {showPasswordField && (
                <>
                  <div style={{ height: "20vh" }} className="logo w-100 d-flex align-items-center justify-content-center">
                    <img className="object-fit-contain" style={{ width: "100%", height: "60px" }} src={logoImage} alt="" />
                  </div>

                  <div className="text-center mb-4 fw-semibold">Reset your password</div>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Form.Group>

                  <div className="w-100">
                    <ButtonComponent text="Reset Password" className="w-100" loading={loading} onClick={handleResetPassword} />
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPassword;
