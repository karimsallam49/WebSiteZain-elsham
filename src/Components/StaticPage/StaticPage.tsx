// src/Components/StaticPage/StaticPage.tsx
import React from "react";
import "./StaticPage.css";

interface StaticPageProps {
  title?: string;
  content: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, content }) => {
  return (
    <div className="container py-4 static-page">
      {title && <h3 className="text-center mb-4 fw-bold">{title}</h3>}
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default StaticPage;
