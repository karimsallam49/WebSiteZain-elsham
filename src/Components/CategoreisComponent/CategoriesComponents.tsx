
// import { CategoriesCrcyle } from '../CategoriesCircyle/CategoriesCrcyle';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
import './categories.css';
import { useTranslation } from 'react-i18next';
import CartSkeleton from '../../scelton/CartScelton';
import { SectionName } from '../SectionName/SectionName';
import { useEffect, useState } from 'react';
import { CategoriesSideList } from '../CategoriesList/CategoresList';
import type { Category } from '../../DTO/CategoriesDTO';
import MobileCategories from '../CategoriesMenu/CategoriesMenu';
import { useAppSelector } from '../../Hooks/hooks';

export const CategoriesComponents = ({ onSelectCategory,toggleGrid }: { toggleGrid:(action:boolean)=>void,onSelectCategory: (category: Category) => void }) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const { categories, loading, error } = useAppSelector((state)=>state.CategoriesSlice);


  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '400px', overflow: "hidden" }}>
        <CartSkeleton />
      </div>
    );

  if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

  return (
    <div className="container py-1 position-relative">
      <SectionName title={t("Categories")} />

      {isMobile ? (
        <div style={{ direction: "ltr", width: "100%" }}>
      <MobileCategories OnToggleGrid={toggleGrid}  categories={categories || []} onSelectCategory={onSelectCategory}/>
        </div>
      ) : (
        <CategoriesSideList categories={categories || []} onSelectCategory={onSelectCategory} />
      )}
    </div>
  );
};
