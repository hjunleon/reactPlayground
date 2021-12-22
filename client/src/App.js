import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import ArtGallery from './pages/3D-Catalogue/3dcatalogue';
import Mailbox from './pages/Mailbox/Mailbox'
// import Slack from './pages/slack/Slack'
import SlackRouter from './pages/slack/SlackRouter'   //Can create another dedicated router folder
import Zoom from './pages/zoom/Zoom'
import Storage from './pages/web3FileStorage/Web3Storage'

import Trying3D from './pages/trying3D/Trying3D'
import Webgl_materials_variations_toon from './pages/trying3D/webgl-materials-variations-toon/Webgl_materials_variations_toon'
import Caustics from './pages/trying3D/water/caustics/Caustics'
import Noise from './pages/trying3D/noise/Noise'
import Test_fresnel from "./pages/trying3D/test_fresnel/Test_fresnel";
import Test_Lambert from "./pages/trying3D/test_lambert/Test_Lambert";
import Test_Three_Integrate from "./pages/trying3D/test_three_integrate/Test_Integrate";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Register />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/" /> : <Messenger />}
        </Route>
        <Route path="/profile/:username">
          <Profile />
        </Route>
        <Route path="/3D-Catalogue/:username">
          <ArtGallery />
        </Route>
        <Route path="/mailbox/:username">
          <Mailbox />
        </Route>
        <Route path="/slack">
          <SlackRouter />
        </Route>
        <Route path="/zoom">
          <Zoom />
        </Route>
        <Route path="/trying3D">
          <Trying3D />
        </Route>
        <Route path="/debugOutlines">
          <Webgl_materials_variations_toon />
        </Route>
        <Route path="/waterCaustics">
          <Caustics />
        </Route>
        <Route path="/noisy3D">
          <Noise />
        </Route>
        <Route path="/test_fresnel">
          <Test_fresnel />
        </Route>
        <Route path="/test_lambert">
          <Test_Lambert />
        </Route>
        <Route path="/test_3_integrate">
          <Test_Three_Integrate />
        </Route>
        <Route path="/web3Storage">
          <Storage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
