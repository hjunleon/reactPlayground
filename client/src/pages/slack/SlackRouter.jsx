import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Slack from "./Slack";
import SlackCallback from "./SlackCallback/SlackCallback";


//The route need fullpath. Look at link below for different methods
// https://stackoverflow.com/questions/56711663/react-router-v5-0-nested-routes
export default function SlackRouter() {
  return (
    <Switch>
      <Route exact path="/slack">
        <Slack />
      </Route>
      <Route path="/slack/callback">
        <SlackCallback />
      </Route>
    </Switch>
  );
}
