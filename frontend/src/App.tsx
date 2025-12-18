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

interface TaskApi {
  id: number;
  text: string;
  completed: boolean;
  min_duration: number;
  max_duration: number;
}

interface GeneratedTask extends TaskApi {
  duration: number;
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
    min-height: 100vh;
  }

  .app-container {
    width: 100%;
    max-width: 1120px;
    height: 80vh;
    min-height: 640px;
    background-color: #FFFFFF;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
    position: relative;
  }

  .header {
    margin-bottom: 4px;
    text-align: center;
  }

  .header h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    color: #333;
    letter-spacing: -0.5px;
  }

  .main-layout {
    display: flex;
    flex: 1;
    gap: 16px;
    overflow: hidden;
  }

  .left-panel,
  .right-panel {
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .left-panel {
    flex: 3;
  }

  .right-panel {
    flex: 2;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
  }

  .panel-header-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }

  .panel-header-sub {
    font-size: 12px;
    color: #888;
  }

  .panel-count {
    font-size: 12px;
    color: #777;
  }
  
  /* フォーム周り */
  .add-form {
    background-color: #FFFFFF;
    padding: 8px 10px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 6px;
  }
  
  .input-row {
    display: flex;
    gap: 8px;
  }

  .add-form input {
    padding: 6px 8px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-size: 13px;
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
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    padding: 8px; /* 高さの基準 */
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
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
    transition: all 0.2s;
  }
  
  .generate-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(52, 199, 89, 0.4);
  }

  /* Todoリストエリア */
  .todo-list {
    flex: 1;
    overflow-y: auto;
    margin-top: 4px;
    padding-right: 4px;
    padding-bottom: 4px;
  }

  .todo-item {
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 6px 8px;
    margin-bottom: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #F0F0F0;
    display: flex;
    align-items: center;
    gap: 6px;
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
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid #D0D5DD;
    background-color: #FFFFFF;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    transition: all 0.15s ease-in-out;
    font-size: 12px;
    color: transparent;
  }

  .checkbox.completed {
    background-color: #007AFF;
    border-color: #007AFF;
    color: #FFFFFF;
  }

  .checkbox:hover {
    border-color: #007AFF;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
  }

  .todo-details {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
  }

  .todo-main-text {
  display: flex;
  flex-direction: column;
  }

  .todo-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .todo-time {
    font-size: 13px;
    font-weight: 700;
    color: #007AFF;
    margin: 0;
  }
  
  .todo-duration {
    font-size: 12px;
    color: #1D2939;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: #EEF4FF;
  }

  .todo-text {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin: 1px 0 0 0;
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

  /* 合計時間入力 */
  .total-time-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 4px;
    font-size: 13px;
    color: #555;
  }

  .total-time-label {
    font-weight: 600;
  }

  .total-time-input-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border-radius: 999px;
    padding: 4px 10px;
    border: 1px solid #E0E0E0;
  }

  .total-time-input {
    width: 72px;
    border: none;
    outline: none;
    font-size: 13px;
    text-align: right;
    background: transparent;
    color: #333;
  }

  .total-time-input::-webkit-outer-spin-button,
  .total-time-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .total-time-suffix {
    font-size: 12px;
    color: #777;
  }

  /* 右側タスク一覧 */
  .task-pool-list {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    padding-bottom: 8px;
  }

  .task-pool-empty {
    text-align: center;
    color: #AAA;
    font-size: 12px;
    margin-top: 24px;
  }
`;

const apiToTask = (api: TaskApi): Task => ({
  id: api.id,
  text: api.text,
  completed: api.completed,
  minDuration: api.min_duration,
  maxDuration: api.max_duration,
});

// --- Appコンポーネント ---
function App() {
  const [taskPool, setTaskPool] = useState<Task[]>([]);
  const [todayTodos, setTodayTodos] = useState<Task[]>([]);

  const [inputText, setInputText] = useState('');
  const [inputMinDuration, setInputMinDuration] = useState('');
  const [inputMaxDuration, setInputMaxDuration] = useState('');

  const [totalMinutes, setTotalMinutes] = useState('0');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  React.useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) {
        console.error('タスク一覧の取得に失敗しました');
        return;
      }
      const data: TaskApi[] = await res.json();
      setTaskPool(data.map(apiToTask));
    };

    fetchTasks().catch(console.error);
  }, []);

  // タスク追加
  const handleAddTaskToPool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !inputMinDuration || !inputMaxDuration) {
      alert('すべての項目を入力してください');
      return;
    }
    const min = parseInt(inputMinDuration, 10);
    const max = parseInt(inputMaxDuration, 10);

    if (min > max) {
      alert('上限は下限以上にしてください');
      return;
    }

    // const newTask: Task = {
    //   id: Date.now(),
    //   text: inputText,
    //   completed: false,
    //   minDuration: min,
    //   maxDuration: max,
    // };

    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: inputText,
        min_duration: min,
        max_duration: max,
      }),
    });

    if (!res.ok) {
      alert('タスクの保存に失敗しました');
      return;
    }

    const created: TaskApi = await res.json();
    const newTask = apiToTask(created);

    setTaskPool((prev) => [newTask, ...prev]);
    setInputText('');
    setInputMinDuration('');
    setInputMaxDuration('');
  };

  // 削除
  const handleDeleteFromPool = async (id: number) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }

    setTaskPool((prev) => prev.filter((task) => task.id !== id));
  };

  // リスト生成
  const handleGenerateList = async () => {
    // if (taskPool.length === 0) {
    //   alert('タスクがありません');
    //   return;
    // }
    // const shuffledPool = shuffleArray(taskPool);
    // let currentStartTime = Date.now();
    // const generatedList: Task[] = [];

    // for (const task of shuffledPool) {
    //   const durationInMinutes = getRandomDuration(
    //     task.minDuration,
    //     task.maxDuration
    //   );
    //   const durationInMs = durationInMinutes * 60 * 1000;
    //   const endTime = currentStartTime + durationInMs;

    //   generatedList.push({
    //     ...task,
    //     scheduledTime: currentStartTime,
    //     endTime: endTime,
    //     duration: durationInMinutes,
    //   });
    //   currentStartTime = endTime;
    // }
    // setTodayTodos(generatedList);

    const total = Number(totalMinutes);
    if (!total || total <= 0) {
      alert('合計時間を正しく入力してください。');
      return;
    }

    const res = await fetch(`${API_BASE}/api/tasks/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_minutes: total }),
    });

    if (!res.ok) {
      alert('リストの生成に失敗しました');
      return;
    }

    const data: GeneratedTask[] = await res.json();

    const generated: Task[] = data.map((item) => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      minDuration: item.min_duration,
      maxDuration: item.max_duration,
      duration: item.duration,
    }));

    setTodayTodos(generated);
  };

  // 完了切り替え
  const handleToggleComplete = (id: number) => {
    setTodayTodos(
      todayTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteFromList = (id: number) => {
    setTodayTodos(todayTodos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <style>{styles}</style>

      <div className="app-container">
        <div className="header">
          <h1>自動Todoアプリ</h1>
        </div>

        <div className="main-layout">
          {/* 左カラム：タスク追加＋今日のランダムリスト */}
          <div className="left-panel">
            <div className="panel-header">
              <div>
                <div className="panel-header-title">リストの追加</div>
              </div>
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

            {/* 合計時間入力＋生成ボタン */}
            {taskPool.length > 0 && (
              <>
                <div className="total-time-row">
                  <span className="total-time-label">今日やる合計時間</span>
                  <div className="total-time-input-wrapper">
                    <input
                      className="total-time-input"
                      type="number"
                      min={5}
                      step={5}
                      value={totalMinutes}
                      onChange={(e) => setTotalMinutes(e.target.value)}
                    />
                    <span className="total-time-suffix">分（5分刻み）</span>
                  </div>
                </div>

                <button
                  className="generate-button"
                  onClick={handleGenerateList}
                >
                  スケジュールを作成する
                </button>
              </>
            )}

            {/* Todoリスト（今日のランダムリスト） */}
            <div className="todo-list">
              {todayTodos.length === 0 && (
                <p
                  style={{
                    textAlign: 'center',
                    color: '#CCC',
                    fontSize: '14px',
                    marginTop: '40px',
                  }}
                >
                  ボタンを押してスケジュールを作成しよう
                </p>
              )}
              {todayTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleComplete}
                  onDelete={handleDeleteFromList}
                />
              ))}
            </div>
          </div>

          {/* 右カラム：すべてのタスク */}
          <div className="right-panel">
            <div className="panel-header">
              <div className="panel-header-title">すべてのタスク</div>
              <span className="panel-count">{taskPool.length}件</span>
            </div>
            <div className="task-pool-list">
              {taskPool.length === 0 ? (
                <div className="task-pool-empty">まだタスクがありません</div>
              ) : (
                taskPool.map((task) => (
                  <TaskPoolItem
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteFromPool}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- 子コンポーネント ---
function TaskPoolItem({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="task-pool-item">
      <div style={{ display: 'flex', alignItems: 'center' }}>
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

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div
        className={`checkbox ${todo.completed ? 'completed' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? '✔' : ''}
      </div>

      <div className="todo-details">
        <p className="todo-text">{todo.text}</p>
        <p className="todo-duration">予定: {todo.duration} 分</p>
      </div>

      <button className="delete-button" onClick={() => onDelete(todo.id)}>
        🗑️
      </button>
    </div>
  );
}

export default App;
