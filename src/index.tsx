/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { TranslatorContextProvider } from "./lang/translate";

render(
  () => (
    <TranslatorContextProvider>
      <App />
    </TranslatorContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
