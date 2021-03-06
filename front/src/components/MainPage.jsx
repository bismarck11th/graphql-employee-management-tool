import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
// MUI
import { Grid } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// Query
import { GET_EMPLOYEES, GET_DEPTS } from '../queries';
// Components
import {
  DeptList,
  EmployeeCreate,
  EmployeeDetails,
  EmployeeList,
  FilterByAnd,
  FilterByName,
  Pagination
} from './';
// CSS
import styles from './MainPage.module.css';

const MainPage = () => {
  const {
    loading: loadingDepts,
    data: dataDepts,
    error: errorDepts
  } = useQuery(GET_DEPTS);

  const {
    loading: loadingEmployees,
    data: dataEmployees,
    error: errorEmployees
  } = useQuery(GET_EMPLOYEES);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
      }
    } else {
      window.location.href = '/';
    }
  }, [errorEmployees, errorDepts]);

  if (loadingEmployees || loadingDepts) return <h1>Loading from server</h1>;
  else if (errorEmployees || errorDepts)
    return (
      <>
        <h1>Employee data fetch error : {errorEmployees.message}</h1>
        <h1>Department data fetch error : {errorDepts.message}</h1>
      </>
    );

  return (
    <div className={styles.mainPage}>
      <h1>
        GraphQL Employee Management Tool
        <ExitToAppIcon
          className={styles.mainPage__out}
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
        />
      </h1>
      <EmployeeCreate dataDepts={dataDepts} />
      <Grid container>
        <Grid item xs={5}>
          <EmployeeList dataEmployees={dataEmployees} />
        </Grid>
        <Grid item xs={4}>
          <EmployeeDetails />
        </Grid>
        <Grid item xs={3}>
          <DeptList dataDepts={dataDepts} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <FilterByName />
        </Grid>
        <Grid item xs={3}>
          <FilterByAnd />
        </Grid>
        <Grid item xs={7}>
          <Pagination />
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
