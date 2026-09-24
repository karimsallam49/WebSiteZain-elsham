import { useState } from "react";
import { Form, Button, Card, Container, Spinner, Alert } from "react-bootstrap";

import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { actAuthLogin } from "../../store/Auth/Login/actLogin";
import "./Login.css";

const Login = () => {
  const dispatch = useAppDispatch();
//   const {}=useAppSelector((state)=>state.)
  const [formData, setFormData] = useState({ email: "", password: "" });
     const { loading, error } = useAppSelector((state) => state.Authslice)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actAuthLogin(formData));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 login-page">
      <Card style={{ width: "400px" }} className="shadow-lg border-0">
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold MainColor">Login</h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              className="backgroundMainColor border-0 w-100"
              type="submit"
              
              disabled={loading==="pending"}
            >
              {loading==="pending" ? <Spinner size="sm" animation="border" /> : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              OR?{" "}
            
            </small>
            
          </div>

          <div>
                <Button
              className="backgroundMainColor border-0 w-100"
              type="submit"
              
            >
              <Link 
  to="/register-otp" 
  style={{ textDecoration: "none", color: "inherit" }}
>
  Registure With OTP
</Link>

            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default Login