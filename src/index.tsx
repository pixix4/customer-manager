/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { PreferencesContextProvider } from "./preferences";

render(
  () => (
    <PreferencesContextProvider>
      <App />
    </PreferencesContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
