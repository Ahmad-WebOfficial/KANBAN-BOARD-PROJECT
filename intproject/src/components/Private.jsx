import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Private({ component: Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isLogin = localStorage.getItem("login");
    if (!isLogin) {
      navigate("/login", { replace: true }); 
    }
  }, [navigate]);

  const isLogin = localStorage.getItem("login");
  if (!isLogin) {
    return null; 
  }

  return <Component />;
}

export default Private;
