import { useEffect, useState } from "react";
import { validateToken } from "../services/hooks/validateToken";
import { Outlet } from "react-router-dom";

export default function Administrators() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      const username = await validateToken({ admin: true });
      setUsername(username);
    };

    fetchUsername();
  }, []);

  return <Outlet context={{ username }} />;
}
