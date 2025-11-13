import React from "react";
import { format } from "date-fns";

function formatDate(iso){
  if(!iso) return "No due";
  try{ return format(new Date(iso), "dd MMM yyyy"); }catch(e){ return "Invalid date"; }
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }){
  if(!tasks || tasks.length===0) return <div className="empty">No tasks yet — add one!</div>;

  return (
    <div className="task-list">
      {tasks.map(t=>(
        <div key={t.id} className={`task-card ${t.completed ? "done": ""}`}>
          <div className="left">
            <input type="checkbox" checked={t.completed} onChange={()=>onToggle(t.id)} />
          </div>

          <div className="mid">
            <div className="title">{t.title}</div>
            <div className="meta">{t.desc || <em>No description</em>}</div>
            <div className="tags">
              <span className={`pill priority ${t.priority.toLowerCase()}`}>{t.priority}</span>
              <span className="pill due">{formatDate(t.due)}</span>
            </div>
          </div>

          <div className="right">
            <button className="icon" onClick={()=>onEdit(t)}>✏️</button>
            <button className="icon" onClick={()=>onDelete(t.id)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}
