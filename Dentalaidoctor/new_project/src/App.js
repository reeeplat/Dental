import React, { useState } from "react";
import Login from "./Login";
import Signup from "./signup";
import ID_PDlost from "./ID_PDlost";
import Dashboard from "./Dashboard";

export default function App() {
  const [page, setPage] = useState("login"); 
  const [userToken, setUserToken] = useState(null);

  const handleLogin = (token) => {
    setUserToken(token);
    setPage("dashboard");  // 여기서 대시보드로 이동!
  };

  const handleLogout = () => {
    setUserToken(null);
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onSignupClick={() => setPage("signup")}
          onFindAccountClick={() => setPage("find")}
        />
      )}
      {page === "signup" && <Signup onBackToLogin={() => setPage("login")} />}
      {page === "find" && <ID_PDlost onBackToLogin={() => setPage("login")} />}
      {page === "dashboard" && <Dashboard onLogout={handleLogout} />}
    </>
  );
}






