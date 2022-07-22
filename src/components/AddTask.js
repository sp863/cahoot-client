import { useState } from "react";
import styled from "styled-components";
import useProjectMutation from "../hooks/project-mutation-hook";

const AddTask = ({ fetchApiPrivate, members, closeModal, project_id }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState([]);

  const { createTaskMutation } = useProjectMutation();

  const chooseAssigneeHandler = (event) => {
    if (!event.target.id) return;
    if (assignees.includes(event.target.id)) return;

    setAssignees((previous) => [...previous, event.target.id]);
  };

  const addTaskHandler = (event) => {
    event.preventDefault();

    const taskData = {
      title,
      description,
      status,
      endDate,
      assignees,
      belongsToProject: project_id,
    };

    createTaskMutation.mutate({
      fetchApiPrivate,
      project_id,
      taskData,
    });
  };

  return (
    <TaskFormContainer>
      <ModalCloseButton onClick={() => closeModal("")}>X</ModalCloseButton>
      <TaskForm onSubmit={addTaskHandler}>
        <InputContainer>
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            onChange={(event) => setTitle(event.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            type="text"
            onChange={(event) => setDescription(event.target.value)}
          />
        </InputContainer>
        <div>
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            onChange={(event) => setEndDate(event.target.value)}
          />
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="1">Not Started</option>
            <option value="2">In Progress</option>
            <option value="3">Completed</option>
          </select>
        </div>
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
                <p>{member.name}</p>
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
          Add Task
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
  gap: 7px;
`;

const Member = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  p {
    font-size: 12px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: -3%;
  right: -2%;
`;

const TaskForm = styled.form`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  textarea {
    height: 100%;
  }
`;

export default AddTask;
