import type { ReactNode } from "react";
import { useAppSelector } from "../../Hooks/hooks";
import NotLoginComponent from "../NotLoginComponent/NotLoginComponent";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);

  return (
    <>
      {OTPToken ? (
        children
      ) : (
        <NotLoginComponent />
      )}
    </>
  );
};

export default ProtectedRoutes;
