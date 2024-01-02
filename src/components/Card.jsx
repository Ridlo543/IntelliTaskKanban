// components/Card/Card.jsx
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Dropdown from "./Dropdown";
import Modal from "./Modal";
import Tag from "./Tag";
import "../styles/Card.css";
import "../../bootstrap.css";
import CardDetails from "./CardDetails";
const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const calculateDaysRemaining = () => {
    const dateline = new Date(props.card.dateline);
    const now = new Date();
    const differenceInTime = dateline - now;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const differenceInHours = Math.floor(
      (differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600)
    );

    return {
      days: differenceInDays,
      hours: differenceInHours,
    };
  };

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="custom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{props.title}</p>
              <MoreHorizontal
                className="car__more"
                onClick={() => {
                  setDropdown(true);
                }}
              />
            </div>

            <div className="card__tags">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

            <div className="card__footer">
              {props.card.task.length !== 0 && (
                <div className="task">
                  <CheckSquare />
                  <span>
                    {props.card.task.length !== 0
                      ? `${
                          (props.card.task?.filter(
                            (item) => item.completed === true
                          )).length
                        } / ${props.card.task.length}`
                      : `${"0/0"}`}
                  </span>
                </div>
              )}
              <div className="time">
                <Clock />
                <span>
                  {calculateDaysRemaining().days > 0 && (
                    <span>{calculateDaysRemaining().days} days </span>
                  )}
                  {calculateDaysRemaining().hours > 0 && (
                    <span>{calculateDaysRemaining().hours} hours </span>
                  )}
                  {calculateDaysRemaining().days <= 0 &&
                    calculateDaysRemaining().hours <= 0 && <span>Overdue</span>}
                </span>
              </div>
            </div>

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
