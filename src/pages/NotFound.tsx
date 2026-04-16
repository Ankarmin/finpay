import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6 py-10">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-foreground">No encontramos esta pantalla</p>
        <p className="mb-6 text-sm text-muted-foreground">Puedes volver al inicio o abrir ayuda para retomar tu camino.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/help">Ir a ayuda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
