import AuthBootstrap from "./components/app/AuthBootstrap";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <AuthBootstrap>
      <AppRouter />
    </AuthBootstrap>
  );
}
