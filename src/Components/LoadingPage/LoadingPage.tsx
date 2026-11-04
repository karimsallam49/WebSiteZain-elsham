import LogoLoader from "../LoadingSpinner/LogoLoader";

const LoadingPage = () => (
  <div className="d-flex align-items-center justify-content-center vh-100 vw-100">
    <LogoLoader size={160} />
  </div>
);

export default LoadingPage;
