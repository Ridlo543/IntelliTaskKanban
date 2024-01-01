// components/Board/Board.jsx

import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import CardDetails from "../Card/CardDetails/CardDetails"; // Import CardDetails
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";
import "../../../bootstrap.css";

export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [addCardModalShow, setAddCardModalShow] = useState(false); // State untuk menampilkan modal
  const [editLimit, setEditLimit] = useState(false);

  const handleEditLimit = () => {
    setEditLimit(true);
    setShow(true); // Aktifkan mode show agar input limit muncul
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") setShow(false);
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const handleAddCard = (value) => {
    // Menampilkan modal ketika menambahkan kartu
    setAddCardModalShow(true);

    // Propagate ke fungsi addCard dari parent
    props.addCard(value, props.id);
  };

  return (
    <div className="board">
      <div className="board__top">
        {show ? (
          <div>
            <input
              className="title__input"
              type={"text"}
              defaultValue={props.name}
              onChange={(e) => {
                props.setName(e.target.value, props.id);
              }}
            />

            <input
              className="limit__input"
              type={"text"}
              defaultValue={props.limit}
              onChange={(e) => {
                props.setLimit(parseInt(e.target.value) || 0, props.id);
                setEditLimit(false);
              }}
            />
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                setShow(true);
              }}
              onDoubleClick={handleEditLimit}
              className="board__title"
            >
              {props?.name || "Name of Board"}
              <span className="total__cards">
                {props.card && props.card.length ? props.card.length : 0} /{" "}
                {props.limit}
              </span>
            </p>
          </div>
        )}
        <div
          onClick={() => {
            setDropdown(true);
          }}
        >
          <MoreHorizontal />
          {dropdown && (
            <Dropdown
              className="board__dropdown"
              onClose={() => {
                setDropdown(false);
              }}
            >
              <p onClick={() => props.removeBoard(props.id)}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <Card
                bid={props.id}
                id={items.id}
                index={index}
                key={items.id}
                title={items.title}
                tags={items.tags}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={handleAddCard} // Menggunakan fungsi handleAddCard yang memunculkan modal
        />
      </div>
      {addCardModalShow && (
        <CardDetails
          onClose={() => setAddCardModalShow(false)} // Menutup modal saat onClose di CardDetails
          updateCard={props.updateCard}
          bid={props.id}
          card={props.card[props.card.length - 1]} // Mengirimkan data kartu terakhir
          removeCard={props.removeCard}
        />
      )}
    </div>
  );
}
