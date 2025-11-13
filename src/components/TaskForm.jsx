import React, { useEffect, useState } from "react";

export default function TaskForm({ onSave, editItem, onCancel }){
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(()=>{
    if(editItem){
      setTitle(editItem.title);
      setDesc(editItem.desc || "");
      setDue(editItem.due ? editItem.due.split("T")[0] : "");
      setPriority(editItem.priority || "Medium");
    } else {
      setTitle(""); setDesc(""); setDue(""); setPriority("Medium");
    }
  },[editItem]);

  function submit(e){
    e.preventDefault();
    if(!title.trim()) return alert("Please enter task title");
    onSave({
      ...editItem,
      title: title.trim(),
      desc: desc.trim(),
      due: due ? new Date(due).toISOString() : null,
      priority
    });
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" />
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description (optional)"></textarea>
      <div className="row">
        <input type="date" value={due} onChange={e=>setDue(e.target.value)} />
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn"> {editItem ? "Save Task" : "Add Task"} </button>
        {editItem && <button type="button" className="btn alt" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
