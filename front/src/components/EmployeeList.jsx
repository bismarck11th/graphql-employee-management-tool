import React from 'react';
// CSS
import styles from './EmployeeList.module.css';

const EmployeeList = ({ dataEmployees }) => {
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
            </li>
          ))}
      </ul>
    </>
  );
};

export default EmployeeList;
