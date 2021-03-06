import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useLocalStorage from "use-local-storage";
import _ from "lodash";
import { v4 } from "uuid";

// import Check from "./images/icon-check.svg";

const item = {
  id: v4(),
  name: "Clean the house",
};

const item2 = {
  id: v4(),
  name: "Wash the car",
};

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const [text, setText] = useState("");
  const [state, setState] = useState({
    todo: {
      items: [item, item2],
    },
  });

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      setState((prev) => {
        return {
          ...prev,
          todo: {
            items: [
              {
                id: v4(),
                name: text,
              },
              ...prev.todo.items,
            ],
          },
        };
      });
      setText("");
    }
  };

  const count = state.todo.items.length;

  return (
    <div className="App" data-theme={theme}>
      <div className="main-image-container">
        <div className="text-container">
          <h1 className="title">TO DO</h1>
          <img
            id="toggle-icon"
            className="icon"
            onClick={() => toggle()}
            alt="icon"
          />
        </div>

        <div className="input-container">
          <input
            id="typer"
            type="text"
            value={text}
            onKeyDown={handleKeyDown}
            onChange={(e) => setText(e.target.value)}
            placeholder="Create a new todo..."
          />
        </div>

        <div className="draggable-section">
          <DragDropContext onDragEnd={handleDragEnd}>
            {_.map(state, (data, key) => {
              return (
                <div key={key} className={"column"}>
                  <Droppable droppableId={key}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={"droppable-col"}
                        >
                          {data.items.map((el, index) => {
                            return (
                              <Draggable
                                key={el.id}
                                index={index}
                                draggableId={el.id}
                              >
                                {(provided, snapshot) => {
                                  console.log(snapshot);
                                  return (
                                    <div
                                      // className={`item ${
                                      //   snapshot.isDragging && "dragging"
                                      // }`}
                                      className="item-container"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div
                                        // key={index}
                                        className="circle"
                                        // onClick={(index) =>
                                        //   setChecked(!checked)
                                        // }
                                        // style={
                                        //   checked
                                        //     ? {
                                        //         backgroundColor:
                                        //           "hsl(220, 98%, 61%)",
                                        //       }
                                        //     : { backgroundColor: "transparent" }
                                        // }
                                      >
                                        {/* {checked && (
                                          <img
                                            className="checkmark"
                                            src={Check}
                                            alt="icon"
                                          /> */}
                                        {/* )} */}
                                      </div>
                                      <div className="text-item-container">
                                        {el.name}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div className="filter-container">
          <div className="filter">
            <p className="filter-heading" id="remaining">
              {count} items remaining
            </p>
            <button className="filter-heading" id="all">
              All
            </button>
            <button className="filter-heading" id="active">
              Active
            </button>
            <button className="filter-heading" id="completed">
              Completed
            </button>
            <button className="filter-heading" id="clear">
              Clear Completed
            </button>
          </div>
        </div>
        <div className="help-text">
          <p>Drag and drop to reorder list</p>
        </div>
      </div>
    </div>
  );
}

export default App;
