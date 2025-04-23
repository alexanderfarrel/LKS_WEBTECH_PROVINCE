import { useEffect, useState } from "react";
import DiscoverGamesView from "../templates/views/userDashboard/discoverGamesView";
import { validateToken } from "../services/hooks/validateToken";

export default function DiscoverGames() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      const username = await validateToken();
      setUsername(username);
    };

    fetchUsername();
  }, []);
  return <DiscoverGamesView username={username} />;
}
