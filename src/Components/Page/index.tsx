import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { ErrorAlert, ErrorAlertError } from 'Components/ErrorAlert';
import Loading from 'Components/Modals/Loading';
import styles from './styles.module.css';

const Page: React.FC<{
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
  error?: ErrorAlertError;
  loading?: boolean;
  loadingMsg?: React.ReactNode;
}> = ({
  wide,
  children,
  title,
  heading,
  action,
  error,
  loading,
  loadingMsg,
}) => {
  useEffect(() => {
    if (title) document.title = `La Corazón - ${title}`;
  }, [title]);
  return (
    <>
      {loading && <Loading centered>{loadingMsg}</Loading>}
      <Container fluid>
        <Row>
          <Col sm="12" md={{ size: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
            <div className={classnames('clearfix', styles.spacing)}>
              <h1 className={styles.heading}>{heading}</h1>
              <div className={styles.action}>{action}</div>
            </div>
            <ErrorAlert error={error}>{heading}</ErrorAlert>
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Page;
