import React, { useEffect, useRef } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import routes from "../routes.js";

const Admin = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken.role.includes("Admin")) {
          navigate("/notauthorized", { replace: true }); 
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
        navigate("/notauthorized", { replace: true });
      }
    } else {
      navigate("/notauthorized", { replace: true });
    }
  }, [navigate]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar {...props} brandText={getBrandText(props?.location?.pathname)} />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid></Container>
      </div>
    </>
  );
};

export default Admin;
