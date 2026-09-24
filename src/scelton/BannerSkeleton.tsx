import ContentLoader from "react-content-loader";
import { Container } from "react-bootstrap";

const BannerSkeleton = () => {
  return (
    <Container className="my-4">
      <ContentLoader
        speed={2}
        width="100%"
        height={250}
        viewBox="0 0 1000 250"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="12" ry="12" width="1000" height="250" />
      </ContentLoader>
    </Container>
  );
};

export default BannerSkeleton;
