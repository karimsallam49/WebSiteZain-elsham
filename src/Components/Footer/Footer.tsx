import { ResturantIMG } from "../../EndPoints/EndPoints";
import { useAppSelector } from "../../Hooks/hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FooterBackground from "../../assets/image/footerbg.jpg";
import FacebookIcon from "../../assets/icon/facebook.png";
import InstagramIcon from "../../assets/icon/instagram.png";
import TwitterIcon from "../../assets/icon/twitter.png";
import AppStoreIcon from "../../assets/icon/app-store.png";
import PlayStoreIcon from "../../assets/icon/icons8-google-play-store-48.png";
import { isAndroid, isIOS } from "react-device-detect";
import "./FooterStyle.css";

const Footer = () => {
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const logoImage = `${ResturantIMG}/${resturantdata?.restaurant_logo}`;
  const { t, i18n } = useTranslation();

  const direction = i18n.dir();

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return FacebookIcon;
      case "instagram":
        return InstagramIcon;
      case "twitter":
        return TwitterIcon;
      default:
        return null;
    }
  };

  return (
    <div
      className="footer-Container justify-content-center text-center text-lg-start text-white"
      style={{
        backgroundImage: `url(${FooterBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        direction: direction,
      }}
    >
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ height: "80%" }}
      >
        <div className="row w-100">
          <div className="col-12 col-lg-4 col-sm-6">
            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
              <img
                className="object-fit-contain mb-2"
                width={250}
                src={logoImage}
                alt=""
              />

              {/* Social Media */}
              {resturantdata?.social_media_link && (
                <div className="d-flex flex-column gap-2 mb-2">
                  <div className="w-100 d-block">{t("followUs")}</div>
                  <div className="d-flex gap-2">
                    {resturantdata?.social_media_link
                      ?.filter((item) => item.status === 1)
                      .map((item) => {
                        const icon = getSocialIcon(item.name);
                        if (!icon) return null;
                        return (
                          <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={icon} alt={item.name} width={30} height={30} />
                          </a>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* App Download */}
              {(isIOS || isAndroid) && (
                <div className="d-flex flex-column align-items-center gap-2 mt-2">
                  <div>{t("downloadApp")}</div>
                  <div className="d-flex gap-2">
                    {isIOS && resturantdata?.app_store_config?.status && resturantdata.app_store_config.link && (
                      <a
                        href={resturantdata.app_store_config.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={AppStoreIcon} alt="App Store" width={50} />
                      </a>
                    )}
                    {isAndroid && resturantdata?.play_store_config?.status && resturantdata.play_store_config.link && (
                      <a
                        href={resturantdata.play_store_config.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={PlayStoreIcon} alt="Play Store" width={50} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-3 col-sm-6">
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <h4>{t("account.myAccount")}</h4>
              </li>
              <li>
                <Link to="/Profile" className="text-decoration-none text-light">
                  {t("account.profile")}
                </Link>
              </li>
              <li>
                <Link to="/MyOrders" className="text-decoration-none text-light">
                  {t("account.orders")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-lg-3 col-sm-6">
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/ContactUs" className="text-decoration-none text-light">
                  {t("info.contactUs")}
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-decoration-none text-light">
                  {t("info.terms")}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-decoration-none text-light">
                  {t("info.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-decoration-none text-light">
                  {t("info.about")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footerText w-100 text-light text-center">
        {resturantdata?.footer_copyright_text}
      </div>
    </div>
  );
};

export default Footer;
