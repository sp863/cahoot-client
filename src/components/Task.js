import { useEffect, useState } from "react";
import styled from "styled-components";
import useProjectMutation from "../hooks/project-mutation-hook";

const Task = ({ fetchApiPrivate, members, closeModal, task }) => {
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
      task_id: task._id,
      taskData,
    });

    closeModal("");
  };

  return (
    <TaskFormContainer>
      <ModalCloseButton onClick={() => closeModal("")}>X</ModalCloseButton>
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
        <div>
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

const AssigneesContainer = styled.div``;

const Member = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
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

export default Task;
