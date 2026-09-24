import ContentLoader from "react-content-loader";
import { Row, Col } from "react-bootstrap";

const CategorySkeleton = () => {
  return (
    <Row className="g-3">
      {[...Array(4)].map((_, index) => (
        <Col xs={4} sm={3} md={2} key={index} className="text-center">
          <ContentLoader
            speed={2}
            width={120}
            height={150}
            viewBox="0 0 120 150"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            {/* دائرة الصورة */}
            <circle cx="60" cy="60" r="50" />

            {/* مستطيل العنوان */}
            <rect x="20" y="120" rx="4" ry="4" width="80" height="10" />
          </ContentLoader>
        </Col>
      ))}
    </Row>
  );
};

export default CategorySkeleton;
