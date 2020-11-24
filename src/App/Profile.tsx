import React from 'react';
import { auth } from 'Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
const Profile = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading>Cargando datos usuario</Loading>;
  if (error) {
    return <Alert>Error: {error}</Alert>;
  }

  return (
    <>
      <img src={user.photoURL} alt="Profile" />

      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default Profile;
