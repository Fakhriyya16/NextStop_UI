import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Media } from "reactstrap";
import { getUser } from "../../../utils/auth"; 

const AdminNavbar = (props) => {
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <Link
          className="h4 mb-0 text-black text-uppercase d-none d-lg-inline-block"
          to="/"
        >
          Back to Home Page
        </Link>
        <Nav className="align-items-center ml-lg-auto" navbar>
          {user && (
            <Media className="align-items-center">
              <Media className="ml-2 d-none d-lg-block">
                <span className="mb-0 text-sm font-weight-bold username-db">
                  {user.name} {user.surname}
                </span>
              </Media>
            </Media>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
