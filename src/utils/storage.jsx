const KEY = "smart_todo_v1";

export function loadTasks(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch(e){ return []; }
}
export function saveTasks(tasks){
  try { localStorage.setItem(KEY, JSON.stringify(tasks || [])); }
  catch(e){}
}
