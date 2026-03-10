import { Layout } from "antd";
import AppRoutes from "./routes/appRoutes";
import Navbar from "./components/navbar/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./services/navigation/navigationRef";
import { useValidateToken } from "./services/queries/authQueries";

function App() {
  const { refetch: validateToken } = useValidateToken(); // ✅ correct
  const navigate = useNavigate();

  useEffect(() => {
    const initApp = async () => {
      await setNavigator(navigate);

      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          await validateToken(); // now this works
        } catch (err) {
          console.log("Token invalid", err);
        }
      }

      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
        },
        (error) => {
          console.log("Location permission denied:", error);
        }
      );
    };

    initApp();
  }, []);

  return (
    <Layout>
      {/* <Navbar /> */}
      <AppRoutes />
    </Layout>
  );
}

export default App;