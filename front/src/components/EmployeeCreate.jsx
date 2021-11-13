import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { StateContext } from '../context/StateContext';
// Query
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from '../queries';
// CSS
import styles from './EmployeeCreate.module.css';

const EmployeeCreate = ({ dataDepts }) => {
  const {
    name,
    setName,
    joinYear,
    setJoinYear,
    selectedDept,
    setSelectedDept,
    editedId,
    setEditedId
  } = useContext(StateContext);

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });

  const selectOption = dataDepts?.allDepartments.edges.map((dept) => (
    <option key={dept.node.id} value={dept.node.id}>
      {dept.node.deptName}
    </option>
  ));
  return (
    <>
      <div>
        <input
          className={styles.employeeCreate__input}
          placeholder="employee name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.employeeCreate__input}
          placeholder="year of join"
          type="number"
          value={joinYear}
          onChange={(e) => setJoinYear(e.target.value)}
        />
      </div>
      <select
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        <option value="">select</option>
        {selectOption}
      </select>
      <button
        disabled={!name || !joinYear || !selectedDept}
        className={styles.employeeCreate__btn}
        onClick={
          editedId
            ? async () => {
                try {
                  updateEmployee({
                    id: editedId,
                    name: name,
                    joinYear: joinYear,
                    department: selectedDept
                  });
                  setEditedId('');
                  setName('');
                  setJoinYear(2020);
                  setSelectedDept('');
                } catch (err) {
                  alert(err.message);
                }
              }
            : async () => {
                try {
                  createEmployee({
                    variables: {
                      name: name,
                      joinYear: joinYear,
                      department: selectedDept
                    }
                  });
                } catch (err) {
                  alert(err.message);
                }
                setName('');
                setJoinYear(2020);
                setSelectedDept('');
              }
        }
      >
        {editedId ? 'Update' : 'Create'}
      </button>
    </>
  );
};

export default EmployeeCreate;
