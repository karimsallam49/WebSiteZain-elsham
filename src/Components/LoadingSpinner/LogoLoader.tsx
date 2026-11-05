import logo from "../../assets/image/logo-320.webp";

/* لودينج لوجو زين الشام — بيستخدم في كل الصفحات بدل السبينر */
const LogoLoader = ({ size = 140 }: { size?: number }) => (
  <>
    <style>{`
      .logo-loader-img {
        animation: logo-loader-pulse 1.4s ease-in-out infinite;
      }
      @keyframes logo-loader-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.07); opacity: 1; }
      }
    `}</style>
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <img
        className="logo-loader-img"
        src={logo}
        alt="loading"
        style={{ width: size, height: "auto", objectFit: "contain" }}
      />
    </div>
  </>
);

export default LogoLoader;
