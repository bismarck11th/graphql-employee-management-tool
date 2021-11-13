import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
// MUI
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import { CREATE_USER, GET_TOKEN } from '../queries';
// CSS
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [createUser] = useMutation(CREATE_USER);
  const [getToken] = useMutation(GET_TOKEN);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
      } else {
        window.location.href = 'employees';
      }
    }
  }, []);

  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const result = await getToken({
          variables: { username: username, password: password }
        });
        localStorage.setItem('token', result.data.tokenAuth.token);
        result.data.tokenAuth.token && (window.location.href = '/employees');
      } catch (err) {
        alert(err.message);
      }
    } else {
      try {
        await createUser({
          variables: { username: username, password: password }
        });
        const result = await getToken({
          variables: { username: username, password: password }
        });
        localStorage.setItem('token', result.data.tokenAuth.token);
        result.data.tokenAuth.token && (window.location.href = '/employees');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className={styles.auth}>
      <form onSubmit={authUser}>
        <div className={styles.auth__input}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.auth__input}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Create new user'}</button>
        <div>
          <FlipCameraAndroidIcon
            className={styles.auth__toggle}
            onClick={() => setIsLogin(!isLogin)}
          />
        </div>
      </form>
    </div>
  );
};

export default Auth;
