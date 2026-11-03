import { useAppSelector } from "./hooks";
import { haversineKm } from "../utilities/distance";
import type { Branch } from "../DTO/CongigDTO";

interface BranchCoverage {
  /** أقرب فرع للوكيشن الحالي — null لو مفيش لوكيشن أو فروع */
  nearest: Branch | null;
  /** المسافة بالكيلو لأقرب فرع */
  distanceKm: number | null;
  /** اليوزر بره نطاق التغطية بتاع أقرب فرع */
  outOfRange: boolean;
}

/* بيحسب أقرب فرع لإحداثيات العنوان المختار + هل هو بره نطاق التغطية بتاعه */
export const useBranchCoverage = (): BranchCoverage => {
  const { selectedAdress } = useAppSelector((state) => state.adressSlice);
  const { resturantdata } = useAppSelector(
    (state) => state.restaurantSettingsSlice
  );

  const userLat = Number(selectedAdress?.latitude);
  const userLng = Number(selectedAdress?.longitude);
  const hasUserCoords =
    Number.isFinite(userLat) &&
    Number.isFinite(userLng) &&
    (userLat !== 0 || userLng !== 0);

  const branches = resturantdata?.branches;
  if (!branches?.length || !hasUserCoords) {
    return { nearest: null, distanceKm: null, outOfRange: false };
  }

  let nearest = branches[0];
  let nearestKm = Infinity;
  for (const b of branches) {
    const d = haversineKm(
      userLat,
      userLng,
      Number(b.latitude),
      Number(b.longitude)
    );
    if (d < nearestKm) {
      nearestKm = d;
      nearest = b;
    }
  }

  return {
    nearest,
    distanceKm: nearestKm,
    outOfRange: nearestKm > (nearest.coverage ?? Infinity),
  };
};
