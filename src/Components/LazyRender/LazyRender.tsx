import { memo, useEffect, useRef, useState, type ReactNode } from "react";

interface LazyRenderProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  className?: string;
}

const LazyRender = ({
  children,
  minHeight = 200,
  rootMargin = "400px",
  className,
}: LazyRenderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: "100%", minHeight: visible ? undefined : minHeight }}
    >
      {visible ? children : null}
    </div>
  );
};

export default memo(LazyRender);
