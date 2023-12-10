import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";

import "leaflet/dist/leaflet.css";
import "./scss/app.scss";
import { Provider } from "react-redux";
import store from "../store";
import { UserProvider } from "@/context/authContext";
import AuthRoutes from "@/context/AuthRoutes";

export default function App({ Component, pageProps }) {

  return (
    <>
      <Provider store={store}>
        <UserProvider>
          <AuthRoutes>
            <Component {...pageProps} />
          </AuthRoutes>
        </UserProvider>
      </Provider>
    </>
  );
}
