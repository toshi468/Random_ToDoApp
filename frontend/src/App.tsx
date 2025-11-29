import React, { useState } from 'react';

// --- 型定義 ---
interface Task {
  id: number;
  text: string;
  completed: boolean;
  minDuration: number;
  maxDuration: number;
  scheduledTime?: number;
  endTime?: number;
  duration?: number;
}

// --- スタイル (CSS) ---
const styles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #F4F7FA;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    min-height: 100vh;
  }

  .app-container {
    width: 375px;
    max-width: 100%;
    height: 812px;
    background-color: #FFFFFF;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .header {
    margin-bottom: 24px;
    text-align: center;
  }

  .header h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    color: #333;
    letter-spacing: -0.5px;
  }
  
  /* フォーム周り */
  .add-form {
    background-color: #F9F9F9;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .input-row {
    display: flex;
    gap: 8px;
  }

  .add-form input {
    padding: 12px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.2s;
    background-color: #FFFFFF;
    color: #333333; 
  }
  
  .add-form input:focus {
    outline: none;
    border-color: #007AFF;
    background-color: #FFFFFF;
    color: #333333;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }

  /* --- 追加ボタン (基準サイズ) --- */
  .add-form button {
    background-color: #007AFF;
    color: white;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    padding: 12px; /* 高さの基準 */
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }
  
  .add-form button:hover {
    background-color: #0051D5;
    transform: translateY(-1px);
  }

  /* --- ★ 開閉ボタン (サイズ調整) --- */
  .toggle-pool-button {
    background-color: transparent;
    color: #666;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #E5E5EA;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    
    width: calc(100% - 32px); /* フォームのpadding(16px*2)分を引く */
    margin: 0 auto; /* 中央揃え */
    
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  
  .toggle-pool-button:hover {
    background-color: #F0F0F5;
    color: #333;
  }

  /* --- ★ タスクプール一覧 (幅合わせ) --- */
  .task-pool-container {
    max-height: 0;
    opacity: 0;
    overflow-y: auto;
    background-color: #F4F7FA; 
    border-radius: 12px;
    
    /* ★幅と位置をボタンに合わせる */
    width: calc(100% - 32px);
    margin: 8px auto 0 auto;
    
    padding: 0 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .task-pool-container.open {
    max-height: 150px;
    opacity: 1;
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .task-pool-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFF;
    padding: 10px 14px; 
    border-radius: 8px;
    margin-bottom: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    border: 1px solid transparent;
  }
  
  .task-pool-name {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  .task-pool-duration {
    font-size: 11px;
    color: #888;
    background-color: #F0F0F0;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
  }

  .pool-delete-button {
    background: #EEE;
    color: #999;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pool-delete-button:hover {
    background-color: #FF3B30;
    color: white;
  }

  /* --- ★ 生成ボタン (サイズ調整) --- */
  .generate-button {
    background: linear-gradient(135deg, #34C759, #30B753);
    color: white;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    padding: 12px; /* ★高さを12pxに統一 */
    cursor: pointer;
    
    /* ★幅をフォーム内のボタンに合わせる調整 */
    width: calc(100% - 32px); /* フォームのpadding(16px*2)分を引く */
    margin: auto auto 16px auto; /* 中央揃え + 下マージン */
    
    box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
    transition: all 0.2s;
  }
  
  .generate-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(52, 199, 89, 0.4);
  }

  /* Todoリストエリア */
  .todo-list {
    flex-grow: 1;
    overflow-y: auto;
    margin-top: 16px;
    padding-bottom: 20px;
  }

  .todo-item {
    background-color: #FFFFFF;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #F0F0F0;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
  }
  
  .todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #CCC;
  }
  
  .todo-item.completed {
    opacity: 0.7;
    background-color: #FAFAFA;
  }

  .checkbox {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #007AFF;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 14px;
    color: white;
  }

  .checkbox.completed {
    background-color: #007AFF;
  }

  .todo-details {
    flex-grow: 1;
  }

  .todo-time {
    font-size: 13px;
    font-weight: 700;
    color: #007AFF;
    margin: 0;
  }
  
  .todo-duration {
    font-size: 11px;
    color: #999;
    margin: 2px 0 0 0;
  }

  .todo-text {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 4px 0 0 0;
  }

  .delete-button {
    background: transparent;
    color: #CCC;
    border: none;
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .delete-button:hover {
    background-color: #FFF0F0;
    color: #FF3B30;
  }
`;

// --- ヘルパー関数 ---
const formatTime = (timestamp?: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
};

const getRandomDuration = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function shuffleArray<T>(array: T[]): T[] {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// --- モックデータ ---
const initialMockData: Task[] = [
  { id: 1, text: "デザイン確認", completed: false, minDuration: 10, maxDuration: 30 },
  { id: 2, text: "Reactの勉強", completed: true, minDuration: 45, maxDuration: 60 },
  { id: 3, text: "休憩", completed: false, minDuration: 5, maxDuration: 15 },
];


// --- Appコンポーネント ---
function App() {
  const [taskPool, setTaskPool] = useState<Task[]>(initialMockData);
  const [todayTodos, setTodayTodos] = useState<Task[]>([]);
  
  const [inputText, setInputText] = useState("");
  const [inputMinDuration, setInputMinDuration] = useState("");
  const [inputMaxDuration, setInputMaxDuration] = useState("");

  const [isPoolOpen, setIsPoolOpen] = useState(true);

  // タスク追加
  const handleAddTaskToPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !inputMinDuration || !inputMaxDuration) {
      alert("すべての項目を入力してください");
      return;
    }
    const min = parseInt(inputMinDuration, 10);
    const max = parseInt(inputMaxDuration, 10);

    if (min > max) {
      alert("上限は下限以上にしてください");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: inputText,
      completed: false,
      minDuration: min,
      maxDuration: max,
    };

    setTaskPool([newTask, ...taskPool]);
    setInputText("");
    setInputMinDuration("");
    setInputMaxDuration("");
  };
  
  // 削除
  const handleDeleteFromPool = (id: number) => {
    setTaskPool(taskPool.filter(task => task.id !== id));
  };
  
  // リスト生成
  const handleGenerateList = () => {
    if (taskPool.length === 0) {
        alert("タスクがありません");
        return;
    }
    const shuffledPool = shuffleArray(taskPool);
    let currentStartTime = Date.now();
    const generatedList: Task[] = [];
    
    for (const task of shuffledPool) {
      const durationInMinutes = getRandomDuration(task.minDuration, task.maxDuration);
      const durationInMs = durationInMinutes * 60 * 1000;
      const endTime = currentStartTime + durationInMs;
      
      generatedList.push({
        ...task,
        scheduledTime: currentStartTime,
        endTime: endTime,
        duration: durationInMinutes
      });
      currentStartTime = endTime;
    }
    setTodayTodos(generatedList);
  };
  
  // 完了切り替え
  const handleToggleComplete = (id: number) => {
    setTodayTodos(todayTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteFromList = (id: number) => {
    setTodayTodos(todayTodos.filter(todo => todo.id !== id));
  };

  return (
    <>
      <style>{styles}</style>
      
      <div className="app-container">
        <div className="header">
          <h1>Todoアプリ</h1>
        </div>

        {/* フォーム */}
        <form className="add-form" onSubmit={handleAddTaskToPool}>
          <input
            type="text"
            placeholder="新しいタスクを入力"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="input-row">
            <input
              type="number"
              min="0"
              placeholder="最短(分)"
              value={inputMinDuration}
              onChange={(e) => setInputMinDuration(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="最長(分)"
              value={inputMaxDuration}
              onChange={(e) => setInputMaxDuration(e.target.value)}
            />
          </div>
          <button type="submit">＋ タスクを追加</button>
        </form>
        
        {/* アコーディオン */}
        <button className="toggle-pool-button" onClick={() => setIsPoolOpen(!isPoolOpen)}>
          <span>タスク ({taskPool.length}件)</span>
          <span style={{fontSize: '12px'}}>{isPoolOpen ? '▲ 閉じる' : '▼ 開く'}</span> 
        </button>

        <div className={`task-pool-container ${isPoolOpen ? 'open' : ''}`}>
          {taskPool.length === 0 ? (
            <p style={{textAlign: 'center', color: '#AAA', fontSize: '12px', padding: '20px'}}>
              タスクがありません
            </p>
          ) : (
            taskPool.map(task => (
              <TaskPoolItem 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteFromPool} 
              />
            ))
          )}
        </div>

        {/* リスト生成ボタン */}
        {taskPool.length > 0 && (
          <button className="generate-button" onClick={handleGenerateList}>
            今日のスケジュールを作成
          </button>
        )}

        {/* Todoリスト */}
        <div className="todo-list">
          {todayTodos.length === 0 && (
            <p style={{textAlign: 'center', color: '#CCC', fontSize: '14px', marginTop: '40px'}}>
              ボタンを押してスケジュールを作成しよう
            </p>
          )}
          {todayTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleComplete}
              onDelete={handleDeleteFromList}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// --- 子コンポーネント ---
function TaskPoolItem({ task, onDelete }: { task: Task; onDelete: (id: number) => void }) {
  return (
    <div className="task-pool-item">
      <div style={{display:'flex', alignItems:'center'}}>
        <p className="task-pool-name">{task.text}</p>
        <span className="task-pool-duration">
          {task.minDuration}~{task.maxDuration}分
        </span>
      </div>
      <button className="pool-delete-button" onClick={() => onDelete(task.id)}>
        ×
      </button>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }: { todo: Task; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div
        className={`checkbox ${todo.completed ? 'completed' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? '✔' : ''}
      </div>

      <div className="todo-details">
        <p className="todo-time">
          {formatTime(todo.scheduledTime)}
        </p>
        <p className="todo-text">{todo.text}</p>
        <p className="todo-duration">
          予定: {todo.duration} 分
        </p>
      </div>
      
      <button className="delete-button" onClick={() => onDelete(todo.id)}>
        🗑️
      </button>
    </div>
  );
}

export default App;