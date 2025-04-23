import { useEffect, useState } from "react";
import UserDashboardView from "../templates/views/userDashboard/userDashboardView";
import { validateToken } from "../services/hooks/validateToken";

export default function UserDashboard() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      const username = await validateToken();
      setUsername(username);
    };

    fetchUsername();
  });
  return <UserDashboardView username={username} />;
}
