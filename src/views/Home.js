import "./Home.css";
import { useEffect, useState } from "react";
import localforage from "localforage";
import startDayOfWeek from "date-fns/startOfWeek";
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import empty from "../assets/no-tasks.png";
import title from "../assets/JOURNYE-slogan.png";
import Slider from "react-slider";

function Home(props) {
  const [tasks, setTasks] = useState([]);
  const [isOverlay, setOverlay] = useState(false);
  const [currTasks, setCurrTasks] = useState({ halfTask: "", fullTask: "" });
  const [isDel, setDel] = useState(false);
  const [week, setWeek] = useState();
  const [isInfo, setInfo] = useState(false);
  const [isActive, setButtonState] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedValue, setSelectedValue] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState(null);


  const handleSliderChange = (value) => {
    setSelectedValue(value);
  };

  const handleCircleClick = (index) => {
    console.log('Circle clicked with index:', index);
    setSelectedCircleIndex(index);
    setShowSlider(true);
    console.log('showSlider:', showSlider);
    console.log('selectedCircleIndex:', selectedCircleIndex);
  };

  const addTask = () => {
    let newTasks = tasks.slice();
    const taskObj = {
      halfTask: currTasks.halfTask,
      fullTask: currTasks.fullTask,
      section: currTasks.section,
      consistency: [0, 0, 0, 0, 0, 0, 0],
      id: newTasks.length,
    };
    newTasks.push(taskObj);
    setTasks(newTasks);
    setOverlay();
  };

  const editHalfTask = (val, key) => {
    let newTasks = tasks.slice();
    for (let i = 0; i < newTasks.length; i++) {
      if (newTasks[i] != null) {
        if (newTasks[i].id === key) {
          newTasks[i].halfTask = val;
          break;
        }
      }
    }

    setTasks(newTasks);
  };

  const editFullTask = (val, key) => {
    let newTasks = tasks.slice();
    for (let i = 0; i < newTasks.length; i++) {
      if (newTasks[i] != null) {
        if (newTasks[i].id === key) {
          newTasks[i].fullTask = val;
          break;
        }
      }
    }
    setTasks(newTasks);
  };

  const delTask = (key) => {
    let newTasks = tasks.slice();
    for (let i = 0; i < newTasks.length; i++) {
      if (newTasks[i] != null) {
        if (newTasks[i].id === key) {
          delete newTasks[i];
        }
      }
    }
    setTasks(newTasks);
  };

  const showDelButton = (e) => {
    e.preventDefault();
    setDel(!isDel);
    setButtonState(!isActive);
  };

  const changeHalfTask = (e) => {
    e.preventDefault();
    const task = e.target.value;
    const currFullTask = currTasks.fullTask;
    const taskObj = { halfTask: task, fullTask: currFullTask };
    setCurrTasks(taskObj);
  };

  const changeFullTask = (e) => {
    e.preventDefault();
    const task = e.target.value;
    const currHalfTask = currTasks.halfTask;
    const taskObj = { halfTask: currHalfTask, fullTask: task };
    setCurrTasks(taskObj);
  };

  const switchOverlay = () => {
    const currOverlay = !isOverlay;
    setOverlay(currOverlay);
  };

  const showInfo = () => {
    const currInfo = !isInfo;
    setInfo(currInfo);
  };

  useEffect(() => {
    localforage.setItem("myTasks", tasks);
  }, [tasks]);

  useEffect(() => {
    localforage.getItem("myTasks").then(function (val) {
      var curr = new Date();
      var start = startDayOfWeek(curr, { weekStartsOn: 1 });
      var last = lastDayOfWeek(curr, { weekStartsOn: 1 });

      setWeek(start.toDateString() + "-" + last.toDateString());

      if (val == null) {
        return;
      }

      setTasks(val);
    });
  }, []);

  let taskItems;
  let taskItemsBySection = {};

  if (tasks != null) {
    tasks.forEach((elem) => {
      if (!taskItemsBySection[elem.section]) {
        taskItemsBySection[elem.section] = [];
      }
      taskItemsBySection[elem.section].push(elem);
    });
  }

  taskItems = Object.keys(taskItemsBySection).map((section) => {
    const sectionTasks = taskItemsBySection[section].map((elem, index) => {

      return (
        <div className="task-item-container" key={elem.id}>
          <div className="task-item">
            {isDel && (
              <div
                className="del-button"
                onClick={() => {
                  delTask(elem.id);
                }}
              >
                <span role="img" aria-label="Delete" style={{ color: 'black', cursor: 'pointer' }}>
                  ✖
                </span>
              </div>
            )}
            <input
              maxLength={20}
              className="task-name"
              placeholder="Enter progress here"
              onChange={(e) => {
                editHalfTask(e.target.value, elem.id);
              }}
              defaultValue={elem.halfTask}
            />
            <input
              maxLength={20}
              className="task-full"
              placeholder="Enter goal here"
              onChange={(e) => {
                editFullTask(e.target.value, elem.id);
              }}
              defaultValue={elem.fullTask}
            />
            {elem.consistency.map((day, ind) => (
              <div className="circle-container" key={ind}>
                <div
                  className="circle"
                  style={{ borderColor: calculateBorderColor(selectedValue) }}
                  onClick={() => handleCircleClick(ind)}>
                  <span className="circle-value" data-value={selectedValue}>{selectedValue}</span>
                </div>
                {showSlider && ind === selectedCircleIndex ? (
                  <div className="slider-container">
                    <Slider
                      value={selectedValue}
                      min={0}
                      max={10}
                      onChange={handleSliderChange}
                      onAfterChange={(value) => {
                        setSelectedValue(value);
                        setShowSlider(false);
                      }}
                      className="slider"
                      thumbClassName="slider-thumb"
                      renderThumb={(props, state) => (
                        <div {...props}>
                          <span className="selected-value">{state.valueNow}</span>
                        </div>
                      )}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );
    });
    return (
      <div key={section}>
        <div className="section-header">{selectedSection || section}</div>
        {sectionTasks}
      </div>
    );
  });

  function calculateBorderColor(value) {
    if (value === 0) {
      return "#8e8e8e";
    } else if (value >= 1 && value <= 3) {
      return "#bddcd9";
    } else if (value >= 4 && value <= 6) {
      return "#85afad";
    } else if (value >= 7 && value <= 9) {
      return "#4d8281";
    } else if (value === 10) {
      return "#155655";
    }
  }

  const changeSection = (e) => {
    e.preventDefault();
    const section = e.target.value;
    const taskObj = { ...currTasks, section };
    setCurrTasks(taskObj);
  }

  if (taskItems.every((elem) => elem === undefined)) {
    taskItems = (
      <div className="empty">
        <img src={empty} alt="No tasks" />
      </div>
    );
  } else {
    const taskCopy = taskItems.slice();
    taskItems = <div className="tasks">{taskCopy}</div>;
  }

  return (
    <div className="main">
      <button className="overlay-button" onClick={showInfo}>
        i
      </button>
      {isOverlay && (
        <div className="overlay">
          <button
            className="overlay-button"
            onClick={switchOverlay}
            style={{ fontFamily: "sans-serif" }}
          >
            x
          </button>
          <div className="add-task">
            Section:
            <br></br>
            <select className="section-dropdown" onChange={changeSection}>
              <option value="none" selected disabled hidden>Select section here</option>
              <option value="sleep">Sleep</option>
              <option value="exercise">Exercise</option>
              <option value="food">Food</option>
              <option value="work">Work</option>
            </select>
            Goal:
            <br></br>
            <input className="task-desc" onChange={changeFullTask} placeholder="Enter goal here"></input>
            <button className="add-button" onClick={addTask}>
              Add
            </button>
          </div>
        </div>
      )}
      {isInfo && (
        <div className="overlay">
          Info
          <button className="overlay-button" onClick={showInfo}>
            i
          </button>
          <div className="overlay-list">
            <div className="heading">Info</div>
            <ul>
              <li>
                The basic premise is that you have habits you want to track,
                for which you set weekly goals.
              </li>
              <li>
                Starting with each day, you set a goal and at the end of the
                day you note down how much you were able to get done.
              </li>
              <li>
                You also score yourself on a scale of 0-10 based on your level
                of satisfaction in completing a particular goal.
              </li>
              <li>
                Daily scores should be updated regularly as changes after the
                day has passed are restricted.
              </li>
              <li>Goals get reset on every Monday.</li>
            </ul>
            <div style={{ textAlign: "center" }}>
              Created with ❤ by{" "}
              <a
                href="https://aashayk18-portfolio.vercel.app/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aashay K.
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="title">
        <img
          src={title}
          alt="JOURNYE Slogan"
          width={"375px"}
          height={"250px"}
        />
      </div>
      <div className="tracker">
        <div className="week">{week}</div>
        <div className="buttons">
          <button className="add" onClick={switchOverlay}>
            Add Goal <span style={{ fontWeight: "bolder" }}>+</span>
          </button>
          <button
            className={isActive ? "del-clicked" : "del"}
            onClick={showDelButton}
          >
            Delete Goal <span style={{ fontWeight: "bolder" }}>-</span>
          </button>
        </div>
        <div className="task-header">
          <div>Goals</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        {taskItems}
      </div>
    </div>
  );
}

export default Home;
