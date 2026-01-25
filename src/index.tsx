/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { TranslationContextProvider } from "./translation";

render(
  () => (
    <TranslationContextProvider>
      <App />
    </TranslationContextProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
