import { useState } from "react";
import styled from "styled-components";
import AddTask from "./AddTask";
import Modal from "./Modal";
import Task from "./Task";
import { dateOptions } from "../config/dateConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const TaskList = ({ fetchApiPrivate, members, tasks, project_id }) => {
  const [currentModal, setCurrentModal] = useState("");
  const [currentTask, setCurrentTask] = useState(null);

  const modalOpenHandler = (event) => {
    const current = event.target.getAttribute("name");
    const task_id = event.target.id;

    if (current === "task") {
      setCurrentTask(tasks.find((task) => task._id === task_id));
    }

    setCurrentModal(current);
  };

  return (
    <ListContainer>
      {currentModal && (
        <Modal>
          {currentModal === "task" ? (
            <Task
              fetchApiPrivate={fetchApiPrivate}
              project_id={project_id}
              members={members}
              closeModal={setCurrentModal}
              task={currentTask}
            />
          ) : (
            <AddTask
              fetchApiPrivate={fetchApiPrivate}
              members={members}
              closeModal={setCurrentModal}
              project_id={project_id}
            />
          )}
        </Modal>
      )}
      <AddTaskCard onClick={modalOpenHandler} name="add-task">
        <div>
          <FontAwesomeIcon icon={faPlus} />
          Add New Task
        </div>
      </AddTaskCard>
      {tasks?.map((task) => {
        return (
          <TaskCard
            key={task._id}
            name="task"
            id={task._id}
            onClick={modalOpenHandler}
          >
            <div>{task.title}</div>
            <div>
              {new Date(task.endDate).toLocaleDateString("en-us", dateOptions)}
            </div>
            <div>{task.status}</div>
            <Assignees>
              {task.assignees.map((assignee, index) => {
                return (
                  <img
                    key={`${assignee._id}-${index}`}
                    src={
                      members?.find((member) => member.email === assignee)
                        .imageUrl
                    }
                    alt={
                      members?.find((member) => member.email === assignee).name
                    }
                  />
                );
              })}
            </Assignees>
          </TaskCard>
        );
      })}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;

  &:before {
    content: "";
    display: block;
    width: 95%;
    margin: auto;
    border-bottom: solid 1px black;
    position: absolute;
    top: 0;
  }
`;

const AddTaskCard = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  justify-items: center;
  width: 95%;
  height: 95px;
  margin-top: 15px;
  border-radius: 15px;
  border: solid 3px black;
  border-style: dashed;
  font-weight: 400;
  cursor: pointer;

  div {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  &:hover {
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.25);
    transition: all 0.3s;
  }
`;

const TaskCard = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  justify-items: center;
  width: 95%;
  height: 95px;
  margin-top: 15px;
  border-radius: 15px;
  border: solid 2px black;
  font-weight: 400;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }

  &:hover {
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.25);
    transition: all 0.3s;
  }
`;

const Assignees = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

export default TaskList;
