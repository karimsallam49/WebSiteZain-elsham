import { useEffect, useRef, useState, type JSX } from "react";
import { Card } from "react-bootstrap";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Share2,
  Navigation,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../Hooks/hooks";
import L from "../../utilities/leaflet";
import "./Support.css";

const Support = () => {
  const { t } = useTranslation();
  const { resturantdata } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );

  const phone = resturantdata?.restaurant_phone;
  const email = resturantdata?.restaurant_email;
  const whatsapp = resturantdata?.whatsapp;
  const firstBranch = resturantdata?.branches?.[0];

  const branchLat = Number(firstBranch?.latitude);
  const branchLng = Number(firstBranch?.longitude);
  const hasCoords = !isNaN(branchLat) && !isNaN(branchLng);
  const googleMapsUrl = `https://www.google.com/maps?q=${branchLat},${branchLng}`;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !hasCoords || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView([branchLat, branchLng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([branchLat, branchLng]).addTo(map);

    map.on("click", () => setShowActions((prev) => !prev));

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [hasCoords, branchLat, branchLng]);

  const handleShare = async () => {
    const shareData = {
      title: firstBranch?.name ?? "",
      text: firstBranch?.address ?? "",
      url: googleMapsUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(googleMapsUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard unavailable */
      }
    }
  };

  const items = [
    phone && {
      icon: <Phone size={30} />,
      label: t("support.call_us"),
      value: phone,
      href: `tel:${phone}`,
      external: false,
      dir: "ltr" as const,
    },
    email && {
      icon: <Mail size={30} />,
      label: t("support.email_us"),
      value: email,
      href: `mailto:${email}`,
      external: false,
      dir: "ltr" as const,
    },
    whatsapp?.status === 1 &&
      whatsapp.number && {
        icon: <MessageCircle size={30} />,
        label: t("support.whatsapp"),
        value: whatsapp.number,
        href: `https://wa.me/${whatsapp.number.replace(/\D/g, "")}`,
        external: true,
        dir: "ltr" as const,
      },
  ].filter(Boolean) as {
    icon: JSX.Element;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    dir?: "ltr";
  }[];

  return (
    <div className="container py-5 support-page">
      <div className="text-center mb-4">
        <h3 className="fw-bold">{t("support.title")}</h3>
        <p className="text-muted">{t("support.subtitle")}</p>
      </div>

      <div className="row g-3 justify-content-center">
        {items.map((item, idx) => {
          const card = (
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "rgba(105, 35, 15, 0.08)",
                  color: "var(--MainColor)",
                }}
              >
                {item.icon}
              </div>
              <h6 className="fw-semibold mb-1">{item.label}</h6>
              <span className="text-muted" dir={item.dir}>
                {item.value}
              </span>
            </Card>
          );

          return (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              {item.href ? (
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="text-decoration-none d-block h-100"
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </div>
          );
        })}

        {hasCoords && (
          <div className="col-12 col-md-8">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="support-map">
                <div ref={mapRef} className="support-map-canvas" />
                <div className={`map-actions ${showActions ? "show" : ""}`}>
                  <button
                    type="button"
                    className="map-action-btn"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    {copied ? t("support.copied") : t("support.share_location")}
                  </button>
                  <button
                    type="button"
                    className="map-action-btn"
                    onClick={() => window.open(googleMapsUrl, "_blank")}
                  >
                    <Navigation size={16} />
                    {t("support.open_maps")}
                  </button>
                </div>
              </div>
              {firstBranch?.address && (
                <div className="p-3 text-center">
                  <h6 className="fw-semibold mb-1">
                    <MapPin size={16} className="me-1" />
                    {t("support.address")}
                  </h6>
                  <span className="text-muted">{firstBranch.address}</span>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
