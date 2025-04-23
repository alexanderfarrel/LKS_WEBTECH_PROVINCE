import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Notfound from "./pages/notfound";
import Administrators from "./pages/administrators";
import UserDashboard from "./pages/userDashboard";
import { Toaster } from "sonner";
import AdministratorsView from "./templates/views/administrators/administratorsView";
import ListAdminsView from "./templates/views/administrators/listAdminsView";
import ListUsersView from "./templates/views/administrators/listUsersView";
import UsersFormView from "./templates/views/administrators/usersForm";
import Profile from "./pages/profile";
import DetailGameView from "./templates/views/userDashboard/detailGameView";
import DetailGame from "./pages/detailGame";
import ManageGames from "./pages/manageGames";
import ManageGameFormView from "./templates/views/userDashboard/manageGameFormView";
import DiscoverGames from "./pages/discoverGames";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        <Route path="/administrators" element={<Administrators />}>
          <Route index element={<AdministratorsView />}></Route>
          <Route path="list-admins" element={<ListAdminsView />}></Route>
          <Route path="list-users" element={<ListUsersView />}></Route>
          <Route path="users-form" element={<UsersFormView />}></Route>
        </Route>

        <Route path="/" element={<UserDashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/detail-game" element={<DetailGame />}></Route>
        <Route path="/manage-games" element={<ManageGames />}></Route>
        <Route
          path="/manage-game-form"
          element={<ManageGameFormView />}
        ></Route>
        <Route path="/discover-games" element={<DiscoverGames />}></Route>

        <Route path="*" element={<Notfound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
