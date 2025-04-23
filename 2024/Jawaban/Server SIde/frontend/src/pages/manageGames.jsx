import { useEffect, useState } from "react";
import ManageGamesView from "../templates/views/userDashboard/manageGamesView";
import { validateToken } from "../services/hooks/validateToken";

export default function ManageGames() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      const response = await validateToken();
      setUsername(response);
    };

    fetchUsername();
  }, []);
  return <ManageGamesView username={username} />;
}
