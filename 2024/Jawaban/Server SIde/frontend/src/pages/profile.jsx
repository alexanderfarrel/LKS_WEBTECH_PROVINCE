import { useEffect } from "react";
import ProfileView from "../templates/views/userDashboard/profileView";
import { validateToken } from "../services/hooks/validateToken";

export default function Profile() {
  useEffect(() => {
    const validate = async () => {
      await validateToken();
    };

    validate();
  });
  return <ProfileView />;
}
