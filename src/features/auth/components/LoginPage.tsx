import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/movies" replace />;
  }

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(values.username, values.password);

      if (result.success) {
        navigate("/movies");
      } else {
        setError(result.message);
      }
    } catch (error: unknown) {
      console.error("Unexpected login error:", error);
      setError("Error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
  );
}
