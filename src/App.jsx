import AuthBootstrap from "./components/app/AuthBootstrap";
import ToastProvider from "./components/ui/ToastProvider";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <ToastProvider>
      <AuthBootstrap>
        <AppRouter />
      </AuthBootstrap>
    </ToastProvider>
  );
}