import { useAppSelector } from "../../Hooks/hooks";
import FacebookIcon from "../../assets/icon/facebook.png";
import InstagramIcon from "../../assets/icon/instagram.png";
import TwitterIcon from "../../assets/icon/twitter.png";
import AppStoreIcon from "../../assets/icon/app-store.png";
import PlayStoreIcon from "../../assets/icon/icons8-google-play-store-48.png";
import { isAndroid, isIOS as detectIOS } from "react-device-detect";

const MobileSocialMedia = () => {
  const { resturantdata } = useAppSelector((state) => state.restaurantSettingsSlice);
  const isIOS = detectIOS || /iPad|iPhone|iPod/.test(navigator.userAgent);


  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return FacebookIcon;
      case "instagram":
        return InstagramIcon;
      case "twitter":
        return TwitterIcon;
      default:
        return null;
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">

      {resturantdata?.social_media_link
        ?.filter((item) => item.status === 1)
        .map((item) => {
          const icon = getSocialIcon(item.name);
          if (!icon) return null;
          return (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              className="border-1"
              rel="noopener noreferrer"
            >
              <img className="border-1" src={icon} alt={item.name} width={30} height={30} />
            </a>
          );
        })}

    
     {isIOS && resturantdata?.app_store_config && (
  <a href={resturantdata.app_store_config.link} target="_blank" rel="noopener noreferrer">
    <img src={AppStoreIcon} alt="App Store" width={30} />
  </a>
)}

      {isAndroid && resturantdata?.play_store_config && resturantdata.play_store_config.link && (
        <a href={resturantdata.play_store_config.link} target="_blank" rel="noopener noreferrer">
          <img src={PlayStoreIcon} alt="Play Store" width={30} />
        </a>
      )}
    </div>
  );
};

export default MobileSocialMedia;
