// import AppImg from "../../assets/logomashhoor.png";
import AppleStore from "../../assets/game.png";
import google from "../../assets/google-play.png";
import { useTranslation } from "react-i18next";
import { isAndroid, isIOS } from 'react-device-detect';

export const AppFooter = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-dark text-white py-1 mt-5">
      <div className="container text-center">
        {/* <img
          src={AppImg}
          alt="Brand Logo"
          style={{
            width: "140px",
            height: "auto",
            marginBottom: "1.5rem",
          }}
        /> */}

        <p className="mb-4 fw-semibold ">{t("DownloadText")}</p>

        <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
          {
            !isIOS&&(
   <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={AppleStore}
              alt="Download on the App Store"
              style={{ height: "50px", maxWidth: "110px",objectFit:"contain" }}
              className="img-fluid"
            />
          </a>
            )
          }
       {
        !isAndroid&&(
 <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={google}
              alt="Get it on Google Play"
              style={{ height: "50px", maxWidth: "110px",objectFit:"contain" }}
              className="img-fluid"
            />
          </a>
        )
       }

       {
        !isIOS&&!isAndroid&&(
           <>
            <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={AppleStore}
              alt="Download on the App Store"
              style={{ height: "50px", maxWidth: "110px",objectFit:"contain" }}
              className="img-fluid"
            />
          </a>
           <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={google}
              alt="Get it on Google Play"
              style={{ height: "50px", maxWidth: "110px",objectFit:"contain" }}
              className="img-fluid"
            />
          </a>
           </>
        )
       }
         
        </div>

        <p className="small mb-0 text-secondary">
          {t("RightsReserved", { year: currentYear })}
        </p>
      </div>
    </footer>
  );
};
