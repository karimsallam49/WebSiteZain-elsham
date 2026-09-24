import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { setLocation } from "../../store/User/userSlice";
import { addadress } from "../../store/Adress/AdressSlice";
import type { AddressDTO } from "../../DTO/AdressDTO";
import { reverseGeocode } from "../../utilities/leaflet";

const Geolocation = () => {
  const dispatch = useAppDispatch();
  const { UserData } = useAppSelector((state) => state.UserInfoSLice);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const formattedAddress = await reverseGeocode(latitude, longitude);

        if (!formattedAddress) {
          console.error("Geocoder failed: no results");
          return;
        }

        dispatch(setLocation(formattedAddress));

        const payload: AddressDTO = {
          id: null,
          address_type: "Home",
          contact_person_number: UserData?.phone
            ? `+20${UserData.phone.replace("+20", "")}`
            : "+200000000000",
          floor: null,
          house: null,
          road: "1",
          address: formattedAddress,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          created_at: null,
          updated_at: null,
          user_id: UserData ? UserData.id : null,
          is_guest: UserData ? 0 : 1,
          contact_person_name: UserData
            ? `${UserData.f_name} ${UserData.l_name}`
            : "Guest User",
          is_default: 1,
        };

        dispatch(addadress(payload));
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }, [dispatch, UserData]);

  return null;
};

export default Geolocation;
