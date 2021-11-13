import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
// MUI
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
// Context
import { StateContext } from '../context/StateContext';
// Query
import { DELETE_EMPLOYEE, GET_EMPLOYEES } from '../queries';
// CSSP
import styles from './EmployeeList.module.css';

const EmployeeList = ({ dataEmployees }) => {
  const {
    setName,
    setJoinYear,
    setSelectedDept,
    setEditedId,
    dataSingleEmployee,
    getSingleEmployee
  } = useContext(StateContext);

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });

  return (
    <>
      <h3>Employee List</h3>
      <ul className={styles.employeeList__list}>
        {dataEmployees &&
          dataEmployees.allEmployees &&
          dataEmployees.allEmployees.edges.map((employee) => (
            <li key={employee.node.id} className={styles.employeeList__item}>
              <span>
                {employee.node.name} {' / '}
                {employee.node.joinYear} {' / '}
                {employee.node.department.deptName}
              </span>
              <div>
                <DeleteIcon
                  className={styles.employeeList__delete}
                  onClick={async () => {
                    try {
                      await deleteEmployee({
                        variables: {
                          id: employee.node.id
                        }
                      });
                      // TODO 削除したらcontextも初期化すべきでは？(edit -> deleteの流れだとformに値が残っる)
                    } catch (err) {
                      alert(err.message);
                    }
                    if (employee.node.id === dataSingleEmployee?.employee.id) {
                      await getSingleEmployee({
                        variables: {
                          id: employee.node.id
                        }
                      });
                    }
                  }}
                />
                <EditIcon
                  className={styles.employeeList__edit}
                  onClick={() => {
                    try {
                      setEditedId(employee.node.id);
                      setName(employee.node.name);
                      setJoinYear(employee.node.joinYear);
                      setSelectedDept(employee.node.department.id);
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                />
                <DragIndicatorIcon
                  className={styles.employeeList__edit}
                  onClick={async () => {
                    try {
                      await getSingleEmployee({
                        variables: {
                          id: employee.node.id
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

export default EmployeeList;
