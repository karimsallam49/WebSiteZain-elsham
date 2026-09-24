import  { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const BrandAmbassadorModal = ({ show, handleClose }:any) => {
  const [selectedDate, setSelectedDate] = useState<null|any>(null);
  const [selectedTime, setSelectedTime] = useState<null|any>(null);

  const timeSlots = [
    "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
    "11:00 AM","11:30 AM","12:00 PM",
  ];

  const renderCalendar = () => {
    // Simple static calendar for demo purposes
    const days = [];
    for (let d = 1; d <= 31; d++) {
      days.push(
        <div
          key={d}
          onClick={() => setSelectedDate(d)}
          style={{
            width: "40px",
            height: "40px",
            lineHeight: "40px",
            textAlign: "center",
            borderRadius: "50%",
            margin: "5px",
            cursor: "pointer",
            background: selectedDate === d ? "#fff" : "transparent",
            color: selectedDate === d ? "#000" : "#fff",
            border: "1px solid #555"
          }}
        >
          {d}
        </div>
      );
    }
    return <div style={{ display: "flex", flexWrap: "wrap" }}>{days}</div>;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Body style={{ backgroundColor: "#000", color: "#fff" }}>
        <h3 className="text-center mb-4">MEET OUR <strong>BRAND AMBASSADOR</strong></h3>

        <Row>
          {/* Left Form Section */}
          <Col md={5}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" value="+971" disabled />
                </Col>
                <Col md={8}>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" placeholder="Mobile Number" />
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email Address" />
              </Form.Group>

              <div className="d-flex gap-2 mb-3">
                <Button variant="secondary" className="w-50">ZOOM</Button>
                <Button variant="secondary" className="w-50">TEAMS</Button>
              </div>

              <Button variant="light" className="w-100">CONFIRM NOW</Button>
            </Form>
          </Col>

          {/* Calendar + Slots Section */}
          <Col md={7}>
            <div className="mb-3">
              <div style={{ fontSize: "14px" }}>SELECT DATE (UAE TIMEZONE GMT+4)</div>
              <div style={{ background: "#111", padding: "10px", borderRadius: "5px" }}>
                {renderCalendar()}
              </div>
            </div>

            <div>
              <h6>Time Slots</h6>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "light" : "dark"}
                    onClick={() => setSelectedTime(slot)}
                    className="d-block w-100 mb-2"
                    style={{ borderRadius: "20px" }}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-0">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BrandAmbassadorModal;
