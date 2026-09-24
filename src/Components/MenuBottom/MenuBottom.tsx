import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { List } from "lucide-react";
import SideBare from "../SideBare/SideBare";
import "./MenuStyle.css";
import { useTranslation } from "react-i18next";

export default function MenuBottom() {
  const [show, setShow] = useState(false);
  const { i18n } = useTranslation();
  const dir = i18n.dir(); // rtl أو ltr

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Menu Burger Button */}
      <div style={{ margin:"0 1rem" }} onClick={handleShow}>
        <List size={20} />
      </div>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        className="custom-offcanvas overflow-hidden"
        show={show}
        onHide={handleClose}
        placement={dir === "ltr" ? "end" : "start"}
        backdrop={true}
      >
        <Offcanvas.Body className="p-0 overflow-hidden">
          <SideBare />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
