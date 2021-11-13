import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
// MUI
import DeleteIcon from '@material-ui/icons/Delete';
// Context
import { StateContext } from '../context/StateContext';
// Query
import { CREATE_DEPT, DELETE_DEPT, GET_DEPTS, GET_EMPLOYEES } from '../queries';
// CSS
import styles from './DeptList.module.css';

const DeptList = ({ dataDepts }) => {
  const { deptName, setDeptName } = useContext(StateContext);
  const [createDept] = useMutation(CREATE_DEPT, {
    refetchQueries: [{ query: GET_DEPTS }]
  });
  const [deleteDept] = useMutation(DELETE_DEPT, {
    refetchQueries: [{ query: GET_DEPTS }, { query: GET_EMPLOYEES }]
  });

  return (
    <>
      <h3>Department List</h3>
      <input
        className={styles.deptList__input}
        placeholder="new department name"
        type="text"
        value={deptName}
        onChange={(e) => setDeptName(e.target.value)}
      />
      <button
        disabled={!deptName}
        onClick={async () => {
          try {
            await createDept({
              variables: {
                deptName: deptName
              }
            });
          } catch (err) {
            alert(err.message);
          }
          setDeptName('');
        }}
      >
        Create
      </button>
      <ul className={styles.deptList__list}>
        {dataDepts &&
          dataDepts.allDepartments &&
          dataDepts.allDepartments.edges.map((dept) => (
            <li key={dept.node.id} className={styles.deptList__item}>
              <span>{dept.node.deptName}</span>
              <div>
                <DeleteIcon
                  className={styles.deptList__delete}
                  onClick={async () => {
                    try {
                      deleteDept({
                        variables: {
                          id: dept.node.id
                        }
                      });
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                />
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default DeptList;
