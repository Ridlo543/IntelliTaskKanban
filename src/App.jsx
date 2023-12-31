import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "use-local-storage";

import Editable from "./components/Editable/Editable";
import Navbar from "./components/Navbar/Navbar";
import Board from "./components/Board/Board";
import { sortCardsByName } from "./utils/algorithm";

import "./App.css";
import "../bootstrap.css";

function App() {
  const [data, setData] = useState(
    localStorage.getItem("data-kanban")
      ? JSON.parse(localStorage.getItem("data-kanban"))
      : []
  );
  const [sortOrder, setSortOrder] = useState("asc");

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const dragCardInSameBoard = (source, destination) => {
    let tempData = Array.from(data);
    // console.log("Data", tempData);
    const index = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    // console.log(tempData[index], index);
    let [removedCard] = tempData[index].card.splice(source.index, 1);
    tempData[index].card.splice(destination.index, 0, removedCard);
    setData(tempData);
  };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
      dateline: new Date(),
    });
    setData(tempData);
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title, limit) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
      limit: limit || 0, // Set the default limit to 0
    });
    setData(tempData);
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // Mendapatkan indeks dari board sumber dan tujuan
    const sourceBoardIdx = data.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    const destinationBoardIdx = data.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );

    // Mengecek apakah penambahan kartu akan melebihi batas yang ditetapkan
    if (
      destinationBoardIdx >= 0 &&
      data[destinationBoardIdx].card.length >= data[destinationBoardIdx].limit
    ) {
      // Jika melebihi batas, berhenti di sini atau lakukan penanganan yang sesuai
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Jika sumber dan tujuan memiliki droppableId yang sama, panggil fungsi dragCardInSameBoard
      dragCardInSameBoard(source, destination);
    } else {
      // Jika sumber dan tujuan memiliki droppableId yang berbeda, cek batas sebelum memindahkan kartu
      if (
        destinationBoardIdx >= 0 &&
        data[destinationBoardIdx].card.length < data[destinationBoardIdx].limit
      ) {
        // Hanya pindahkan kartu jika belum mencapai batas
        setData(dragCardInBoard(source, destination));
      }
    }
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filterAndSortData = () => {
    // Menyalin data asli
    let sortedData = [...data];

    // Mengurutkan data berdasarkan nama kartu
    sortedData.forEach((board) => {
      board.card = sortCardsByName(board.card, sortOrder);
    });

    // Mengembalikan data yang telah diurutkan
    return sortedData;
  };

  const sortedData = filterAndSortData();

  useEffect(() => {
    localStorage.setItem("data-kanban", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} handleSortChange={handleSortChange} />
        <div className="app_outer">
          <div className="app_boards">
            {sortedData.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
                limit={item.limit}
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={(title, limit) => addBoard(title, limit)}
              placeholder={"Enter Board Title"}
              limitEnabled={true}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
