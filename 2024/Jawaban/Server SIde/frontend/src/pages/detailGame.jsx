import { useEffect } from "react";
import { validateToken } from "../services/hooks/validateToken";
import DetailGameView from "../templates/views/userDashboard/detailGameView";

export default function DetailGame() {
  useEffect(() => {
    const validate = async () => {
      await validateToken();
    };

    validate();
  });

  return <DetailGameView />;
}
