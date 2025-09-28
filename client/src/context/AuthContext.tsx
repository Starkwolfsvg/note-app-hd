import React, { createContext, useContext, useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  dob?: string;
}

interface AuthContextProps {
  accessToken: string | null;
  userData: UserData | null;
  setAccessToken: (token: string | null, isPersistent?: boolean) => void;
  setUserData: (data: UserData | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  });

  const [userData, setUserDataState] = useState<UserData | null>(() => {
    const savedUserData =
      localStorage.getItem("userData") || sessionStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  });

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      const storage = localStorage.getItem("authToken")
        ? localStorage
        : sessionStorage;
      storage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
      sessionStorage.removeItem("userData");
    }
  };

  const setAccessToken = (
    token: string | null,
    isPersistent: boolean = false
  ) => {
    setAccessTokenState(token);
    setIsAuthenticated(Boolean(token));

    if (token) {
      if (isPersistent) {
        localStorage.setItem("authToken", token);
        sessionStorage.removeItem("authToken");
      } else {
        sessionStorage.setItem("authToken", token);
        localStorage.removeItem("authToken");
      }
    } else {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserData(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const savedUserData =
        localStorage.getItem("userData") || sessionStorage.getItem("userData");

      setAccessTokenState(token);
      setIsAuthenticated(Boolean(token));
      setUserDataState(savedUserData ? JSON.parse(savedUserData) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userData,
        setAccessToken,
        setUserData,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
