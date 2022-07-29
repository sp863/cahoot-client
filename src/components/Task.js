import { useEffect, useState } from "react";
import styled from "styled-components";
import useProjectMutation from "../hooks/project-mutation-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Task = ({ fetchApiPrivate, project_id, members, closeModal, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState([]);

  const { updateTaskMutation } = useProjectMutation();

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEndDate(task.endDate);
    setAssignees(task.assignees);
  }, [task]);

  const chooseAssigneeHandler = (event) => {
    if (!event.target.id) return;
    if (assignees.includes(event.target.id)) return;

    setAssignees((previous) => [...previous, event.target.id]);
  };

  const editTaskHandler = (event) => {
    event.preventDefault();

    const taskData = {
      title,
      description,
      status,
      endDate,
      assignees,
    };

    updateTaskMutation.mutate({
      fetchApiPrivate,
      project_id,
      task_id: task._id,
      taskData,
    });

    closeModal("");
  };

  return (
    <TaskFormContainer>
      <StyledCloseIcon icon={faXmark} onClick={() => closeModal("")} />
      <TaskForm onSubmit={editTaskHandler}>
        <InputContainer>
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            defaultValue={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            type="text"
            defaultValue={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </InputContainer>
        <DateStatusInput>
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            defaultValue={endDate.split("T")[0]}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </DateStatusInput>
        <AssigneesContainer id="assignees">
          <label htmlFor="assignees">Assignees</label>
          {members.map((member) => {
            return (
              <Member key={member._id}>
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  id={member.email}
                  onClick={chooseAssigneeHandler}
                />
                <div>{member.name}</div>
              </Member>
            );
          })}
        </AssigneesContainer>
        <button
          type="submit"
          disabled={
            !status || !title || !description || !endDate || !assignees.length
          }
        >
          Edit Task
        </button>
      </TaskForm>
    </TaskFormContainer>
  );
};

const TaskFormContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;

const AssigneesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const DateStatusInput = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const Member = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 12px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
  padding: 5px 10px;
  color: var(--primary_color);
  position: absolute;
  top: -2%;
  right: -2%;

  &:hover {
    transition: all 0.2s;
    font-size: 25px;
  }
`;

const TaskForm = styled.form`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  label {
    font-weight: 500;
  }

  button {
    width: 40%;
    padding: 10px;
    border-radius: 10px;
    border: solid 1px var(--primary-color);
    background-color: var(--primary-color);
    color: white;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: white;
      border: solid 1px var(--primary-color);
      transition: all 0.3s;
      color: var(--primary-color);
    }

    &:disabled {
      background-color: #adb5bd;
      color: #868e96;
    }

    &[disabled]:hover {
      background-color: #adb5bd;
      color: #868e96;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
  }

  input {
    width: 350px;
  }

  textarea {
    width: 350px;
    height: 100px;
  }
`;

export default Task;
