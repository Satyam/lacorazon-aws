import React from 'react';
import { Container, Row, Col } from 'reactstrap';
// import { ApolloError } from '@apollo/client';

// import GqlError from 'Components/GqlError';
import styles from './styles.module.css';

const Page: React.FC<{
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
  error?: string;
}> = ({ wide, children, title, heading, action, error }) => {
  if (title) document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className={styles.spacing}>
            <h1 className={styles.heading}>{heading}</h1>
            <div className={styles.action}>{action}</div>
          </div>
          <div className={styles.clear}>{error}</div>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
