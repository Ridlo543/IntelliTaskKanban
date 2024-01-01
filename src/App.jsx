// app.jsx

import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "use-local-storage";

import Editable from "./components/Editable/Editable";
import Navbar from "./components/Navbar/Navbar";
import Board from "./components/Board/Board";

import "./App.css";
import "../bootstrap.css";

function App() {
  const [data, setData] = useState(
    localStorage.getItem("data-kanban")
      ? JSON.parse(localStorage.getItem("data-kanban"))
      : []
  );

  ///////////////////////////////////////////////////
  // Algoritma Greedy

  // State untuk pilihan algoritma Greedy dan hasil distribusi tasks
  const [selectedGreedyOption, setSelectedGreedyOption] = useState("Weight");
  const [greedyResults, setGreedyResults] = useState({
    progressTasks: [],
    todoTasks: [],
  });

  // Fungsi untuk mengubah pilihan algoritma Greedy dan menerapkan algoritma tersebut
  const handleGreedyOptionChange = (event) => {
    setSelectedGreedyOption(event.target.value);
    applyGreedyAlgorithm(event.target.value);
  };

  // Fungsi untuk menghitung profit suatu task berdasarkan batas waktu dan tingkat kesulitan
  const calculateProfit = (task) => {
    // Menghitung selisih hari antara tanggal batas waktu dan tanggal saat ini
    const currentDate = new Date();
    const daysLeft = Math.max(
      1,
      (new Date(task.dateline) - currentDate) / (1000 * 60 * 60 * 24)
    );

    // Menghitung profit berdasarkan formula yang diberikan
    const profit =
      (1 / daysLeft) * (task.tingkatKemampuan / task.tingkatKesulitan);
    return profit;
  };

  // Fungsi untuk menghitung density (profit per unit waktu) suatu task
  const calculateProfitDensity = (task) => {
    // Menghitung density berdasarkan profit dan durasi pengerjaan task
    const density = calculateProfit(task) / task.durasiPengerjaan;
    console.log(density); // Log ke konsol untuk debug atau pemantauan
    return density;
  };

  /**
   * Function untuk menerapkan algoritma Greedy pada tasks.
   * @param {string} greedyOption - Pilihan algoritma Greedy ("Weight", "Profit", atau "Density").
   * @param {number} manualCapacity - Kapasitas pengerjaan manual (opsional), default: 8 jam.
   */
  const applyGreedyAlgorithm = (greedyOption, manualCapacity) => {
    // Mengurutkan tasks berdasarkan pilihan algoritma Greedy
    const sortedTasks = data
      .flatMap((board) => board.card)
      .sort((a, b) => {
        if (greedyOption === "Weight") {
          return b.tingkatKemampuan - a.tingkatKemampuan;
        } else if (greedyOption === "Profit") {
          return b.profit - a.profit;
        } else if (greedyOption === "Density") {
          return calculateProfitDensity(b) - calculateProfitDensity(a);
        }
        return 0;
      });

    // Mengatur ulang tasks progress dan todo
    setGreedyResults({
      progressTasks: [],
      todoTasks: [],
    });

    // Mendistribusikan tasks ke progress dan todo berdasarkan kapasitas (8 jam)
    let remainingCapacity = manualCapacity || 8; // default 8 jam
    sortedTasks.forEach((task) => {
      if (remainingCapacity >= task.durasiPengerjaan) {
        // Jika masih ada kapasitas, tambahkan task ke progressTasks
        setGreedyResults((prev) => ({
          ...prev,
          progressTasks: [...prev.progressTasks, task],
        }));
        remainingCapacity -= task.durasiPengerjaan;
      } else {
        // Jika kapasitas telah terpenuhi, tambahkan task ke todoTasks
        setGreedyResults((prev) => ({
          ...prev,
          todoTasks: [...prev.todoTasks, task],
        }));
      }
    });
  };

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

  const setLimit = (limit, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].limit = limit;
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
    let [removedCard] = tempData[0].card.splice(source.index, 1);
    tempData[0].card.splice(destination.index, 0, removedCard);
    setData(tempData);
  };

  // ...

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];

    const newCard = {
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
      dateline: new Date(),
      tingkatKemampuan: "5",
      tingkatKesulitan: "5",
      tingkatUrgensi: "5",
      durasiPengerjaan: "1",
    };

    newCard.profit = calculateProfit(newCard);
    tempData[index].card.push(newCard);
    setData(tempData);
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    // Update card properties
    tempBoards[index].card[cardIndex] = {
      ...card,
      profit: calculateProfit(card),
    };

    console.log(tempBoards);
    setData(tempBoards);
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

  useEffect(() => {
    localStorage.setItem("data-kanban", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <Navbar
          switchTheme={switchTheme}
          theme={theme}
          handleGreedyOptionChange={handleGreedyOptionChange}
          applyGreedyAlgorithm={applyGreedyAlgorithm}
        />

        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                setLimit={setLimit} // Tambahkan prop setLimit di sini
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
        {/* Tampilkan progress tasks */}
        <div className="task-container">
          <h3>PROGRESS:</h3>
          <div className="task-list">
            {greedyResults.progressTasks.map((task) => (
              <div key={task.id} className="task-item">
                {task.title}
              </div>
            ))}
          </div>
          <h3>TODO:</h3>
          <div className="task-list">
            {greedyResults.todoTasks.map((task) => (
              <div key={task.id} className="task-item">
                {task.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
export default App;
