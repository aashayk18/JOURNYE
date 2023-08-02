import "./Home.css"
import { useEffect, useState } from "react";
import localforage, { LOCALSTORAGE } from "localforage";
import startDayOfWeek from "date-fns/startOfWeek";
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import empty from "../assets/confused-2.png"
function Home(props) {

    const [tasks, setTasks] = useState([]);
    const [isOverlay, setOverlay] = useState(false);
    const [currTasks, setCurrTasks] = useState({ halfTask: "", fullTask: "" });
    const [isDel, setDel] = useState(false);
    const [week, setWeek] = useState();
    const [isInfo, setInfo] = useState(false);
    const [isActive, setButtonState] = useState(false);

    const addTask = () => {
        let newTasks = tasks.slice();
        const taskObj = { halfTask: currTasks.halfTask, fullTask: currTasks.fullTask, consistency: [0, 0, 0, 0, 0, 0, 0], id: newTasks.length }
        newTasks.push(taskObj);
        setTasks(newTasks)
        setOverlay()
    }

    const editHalfTask = (val, key) => {
        let newTasks = tasks.slice();
        for (let i = 0; i < newTasks.length; i++) {
            if (newTasks[i] != null) {
                if (newTasks[i].id == key) {
                    newTasks[i].halfTask = val
                    break
                }
            }
        }

        setTasks(newTasks);
    }

    const editFullTask = (val, key) => {
        let newTasks = tasks.slice();
        for (let i = 0; i < newTasks.length; i++) {
            if (newTasks[i] != null) {
                if (newTasks[i].id == key) {
                    newTasks[i].fullTask = val
                    break
                }
            }

        }
        setTasks(newTasks);
    }

    const updateConsistency = (key, day, val) => {
        let newTasks = tasks.slice();
        const today = new Date()
        const currDay = today.getDay();
        if (currDay != day) {
            return
        }

        for (let i = 0; i < newTasks.length; i++) {
            if (newTasks[i] != undefined) {
                console.log(newTasks)
                if (newTasks[i].id == key) {
                    newTasks[i].consistency[day] = val
                    console.log(newTasks)

                    break
                }
            }

        }
        console.log(newTasks)
        setTasks(newTasks);

    }

    const delTask = (key) => {
        let newTasks = tasks.slice();
        for (let i = 0; i < newTasks.length; i++) {
            if (newTasks[i] != null) {
                if (newTasks[i].id == key) {
                    delete (newTasks[i]);
                }
            }
        }
        setTasks(newTasks);
    }

    const showDelButton = (e) => {
        e.preventDefault()
        setDel(!isDel)
        setButtonState(!isActive)

    }

    const changeHalfTask = (e) => {
        e.preventDefault()
        const task = e.target.value
        const currFullTask = currTasks.fullTask;
        const taskObj = { halfTask: task, fullTask: currFullTask }
        setCurrTasks(taskObj)

    }

    const changeFullTask = (e) => {
        e.preventDefault()
        const task = e.target.value
        const currHalfTask = currTasks.halfTask;
        const taskObj = { halfTask: currHalfTask, fullTask: task }
        setCurrTasks(taskObj)

    }

    const switchOverlay = () => {
        const currOverlay = !isOverlay
        setOverlay(currOverlay)
    }

    const showInfo = () => {
        const currInfo = !isInfo
        setInfo(currInfo)
    }

    // Save tasks whenever tasks changes to localStorage
    useEffect(() => {
        localforage.setItem("myTasks", tasks);
        console.log(tasks)
        console.log("Tasks changing")
    }, [tasks])

    // Fetch tasks on Component Mount   
    useEffect(() => {
        localforage.getItem("myTasks").then(function (val) {


            var curr = new Date();
            var start = startDayOfWeek(curr);
            var last = lastDayOfWeek(curr);
            setWeek(start.toDateString() + "-" + last.toDateString());
            if (val == null) {
                return
            }
            if (curr.getDay() == 0) {
                const first_time = localStorage.getItem("first");

                if (!first_time) {

                    let newTasks = val.slice()

                    for (let i = 0; i < newTasks.length; i++) {

                        if (newTasks[i] != null) {
                            newTasks[i].consistency = [0, 0, 0, 0, 0, 0, 0];
                        }

                    }
                    localStorage.setItem("first", true)
                    setTasks(newTasks);
                    return
                }
            }

            if (curr.getDay() == 1) {
                const first_time = localStorage.getItem("first");
                if (first_time) {
                    localStorage.removeItem("first")
                }
            }

            setTasks(val)
        })


    }, [])





    let taskItems;
    if (tasks != null) {
        taskItems = tasks.map((elem, index) => {
            return (
                <div className="task-item" key={elem.id}>
                    <input maxLength={20} className="task-name" placeholder="Enter half-task here" onChange={(e) => { editHalfTask(e.target.value, elem.id) }} defaultValue={elem.halfTask}>
                    </input>
                    <input maxLength={20} className="task-full" placeholder="Enter full-task here" defaultValue={elem.fullTask} onChange={(e) => { editFullTask(e.target.value, elem.id) }}>
                    </input>
                    {elem.consistency.map((day, ind) => {
                        if (day == 0) {
                            return (
                                <div className="circle" onClick={() => { updateConsistency(elem.id, ind, 1) }}></div>
                            )
                        }
                        else if (day == 1) {
                            return (
                                <div className="circle" onClick={() => { updateConsistency(elem.id, ind, 2) }}>
                                    <div className="one"></div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="circle" onClick={() => { updateConsistency(elem.id, ind, 0) }}>
                                    <div className="one"></div>
                                    <div className="two"></div>
                                </div>
                            )
                        }

                    })}
                    {isDel && <button className="del-button" onClick={() => { delTask(elem.id) }}>Delete Task </button>}
                </div>
            )
        })
    }


    if(taskItems.every(elem => elem===undefined)){
        taskItems = (<div className="empty"><img src={empty}></img> </div>)
    }
    else{
        const taskCopy = taskItems.slice()
        taskItems = <div className="tasks">{taskCopy}</div>
    }

    return (
        <div className="main">
            <button className="overlay-button" onClick={showInfo}>i</button>
            {isOverlay && <div className="overlay">
                <button className="overlay-button" onClick={switchOverlay} style={{ fontFamily: "sans-serif" }}>x</button>
                <div className="add-task">
                    Half Task:<br></br>
                    <input className="task-desc" onChange={changeHalfTask}></input>
                    Full Task:<br></br>
                    <input className="task-desc" onChange={changeFullTask}></input>
                    <button className="add-button" onClick={addTask}>Add</button>

                </div>
            </div>}
            {isInfo && <div className="overlay">Info
                <button className="overlay-button" onClick={showInfo}>i </button>
                <div className="overlay-list">
                        <div className="heading">  Info <br></br> </div>
                        <ul>
                            <li>The premise of this app is based on this <a href="https://youtu.be/fSwpe8r50_o" target={"_blank"}>video.</a></li>
                            <li>A unfilled circle denotes no progress , A half filled circle denotes a half task and a fufilled circle denotes a full task.</li>
                            <li>Consistency should be updated regularly as changes after the day has passed is restricted.  </li>
                            <li>Tasks get reset on every Sunday. </li>

                        </ul>
                      <div style={{textAlign:"center"}} > Developed by <a href="https://ranjan210.github.io/" className="link" target="_blank">Ranjan</a></div>
                    </div>
            </div>}

            <div className="title">
                Consistency Tracker
            </div>
            <div className="tracker">
                <div className="week">{week}</div>
                <div className="buttons">
                    <button className="add" onClick={switchOverlay}>Add Task <span style={{ fontWeight: "bolder" }}>+</span></button>
                    <button className={isActive ? "add-clicked" : "add"} onClick={showDelButton}>Delete Task <span style={{ fontWeight: "bolder" }}>-</span>   </button>
                </div>


                <div className="task-header">
                    <div >Task</div>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>

                </div>
                    {taskItems}
            </div>
        </div>
    )
}

export default Home;