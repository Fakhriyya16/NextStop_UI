import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <Row>
            <Col lg="12" md="12">
              <h1 className="display-3 text-white">Welcome to the Admin Panel!</h1>
              <p className="text-white mt-0 mb-5" style={{ fontSize: '1.25rem' }}>
                Manage the system with ease—access places, cities, categories, and tags all from one place.
                Customize content, oversee user interactions, and maintain control effortlessly.
              </p>
              <p className="text-white mt-0" style={{ fontSize: '1.25rem' }}>
                Let's make the most out of today. Happy managing!
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Header;
