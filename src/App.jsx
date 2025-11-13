import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { loadTasks, saveTasks } from "./utils/storage";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

function todayISO(){ 
  const d = new Date(); d.setHours(0,0,0,0); return d.toISOString();
}

export default function App(){
  const [tasks, setTasks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("due"); // due | priority

  useEffect(()=> setTasks(loadTasks()), []);
  useEffect(()=> saveTasks(tasks), [tasks]);

  function addOrUpdate(task){
    if(task.id){
      setTasks(prev => prev.map(p => p.id === task.id ? {...task} : p));
    } else {
      setTasks(prev => [{ id: uuidv4(), title: task.title, desc: task.desc, due: task.due || null, priority: task.priority || "Medium", completed: false }, ...prev]);
    }
    setEditItem(null);
  }

  function toggle(id){
    setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  }

  function remove(id){
    if(!confirm("Delete this task?")) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    if(editItem && editItem.id === id) setEditItem(null);
  }

  const filtered = useMemo(()=>{
    let res = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.desc||"").toLowerCase().includes(query.toLowerCase()));
    if(filter === "Today") res = res.filter(t => t.due && new Date(t.due).toDateString() === new Date().toDateString());
    if(filter === "This Week"){
      const now = new Date(); const end = new Date(); end.setDate(now.getDate()+7);
      res = res.filter(t => t.due && new Date(t.due) >= now && new Date(t.due) <= end);
    }
    if(filter === "Completed") res = res.filter(t => t.completed);
    if(filter === "High") res = res.filter(t => t.priority === "High");
    // sort
    if(sort === "due") res.sort((a,b)=>{
      if(!a.due) return 1;
      if(!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    });
    if(sort === "priority") {
      const score = p => p==="High"?0:p==="Medium"?1:2;
      res.sort((a,b)=> score(a.priority) - score(b.priority));
    }
    return res;
  },[tasks, query, filter, sort]);

  return (
    <div className="todo-app container">
      <header>
        <h1>✔️ Smart To-Do List</h1>
        <p className="subtitle">Simple. Smart. Stylish — Save tasks, set due dates, prioritize and focus.</p>
      </header>

      <div className="top">
        <div className="search">
          <input placeholder="Search tasks..." value={query} onChange={e=>setQuery(e.target.value)} />
        </div>

        <div className="controls">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>Completed</option>
            <option>High</option>
          </select>

          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="due">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>
      </div>

      <div className="grid">
        <div className="col left">
          <div className="card">
            <TaskForm onSave={addOrUpdate} editItem={editItem} onCancel={()=>setEditItem(null)} />
          </div>

          <div className="card">
            <h3>Tasks</h3>
            <TaskList tasks={filtered} onToggle={toggle} onEdit={t=>setEditItem(t)} onDelete={remove} />
          </div>
        </div>

        <div className="col right">
          <div className="card stats">
            <h3>Overview</h3>
            <p>Total: <strong>{tasks.length}</strong></p>
            <p>Completed: <strong>{tasks.filter(t=>t.completed).length}</strong></p>
            <p>High priority: <strong>{tasks.filter(t=>t.priority==="High").length}</strong></p>
            <p>Due today: <strong>{tasks.filter(t=>t.due && new Date(t.due).toDateString() === new Date().toDateString()).length}</strong></p>
          </div>

          <div className="card help">
            <h4>Quick tips</h4>
            <ul>
              <li>Click checkbox to mark complete</li>
              <li>Use search & filters to find tasks</li>
              <li>Edit tasks quickly with the ✏️ button</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="muted">Built with ❤️ — localStorage powered — ready to push to GitHub</footer>
    </div>
  );
}
