import ContentLoader from "react-content-loader";
import { Row, Col } from "react-bootstrap";

const ProductSkeleton = () => {
  const renderList = Array(3)
    .fill(0)
    .map((_, idx) => (
      <Col
        key={idx}
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex justify-content-center mb-4 mt-3"
      >
        <div style={{ width: "100%", maxWidth: "200px" }}>
          <ContentLoader
            speed={2}
            width={200}
            height={300}
            viewBox="0 0 200 300"
            backgroundColor="#f3f3f3"
            foregroundColor="#e0e0e0"
          >
            <rect x="0" y="0" rx="10" ry="10" width="200" height="150" />

            <rect x="10" y="160" rx="4" ry="4" width="140" height="12" />
            <rect x="10" y="180" rx="4" ry="4" width="100" height="10" />

            <rect x="10" y="200" rx="4" ry="4" width="80" height="10" />

            <rect x="10" y="230" rx="6" ry="6" width="180" height="40" />
          </ContentLoader>
        </div>
      </Col>
    ));

  return (
    <div className="mt-4">
      <Row>{renderList}</Row>
    </div>
  );
};

export default ProductSkeleton;
