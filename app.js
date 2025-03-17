document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const tasksLeft = document.getElementById('tasks-left');
    const clearCompletedButton = document.getElementById('clear-completed');

    // ローカルストレージからTodoリストを取得
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Todoリストを表示
    function renderTodos() {
        todoList.innerHTML = '';
        let incompleteTasks = 0;

        todos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            } else {
                incompleteTasks++;
            }

            todoItem.innerHTML = `
                <input type="checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
                <span class="todo-item-text">${todo.text}</span>
                <button class="delete-button" data-index="${index}">削除</button>
            `;

            todoList.appendChild(todoItem);
        });

        tasksLeft.textContent = `残りタスク: ${incompleteTasks}`;
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // 新しいTodoを追加
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                text,
                completed: false
            });
            todoInput.value = '';
            renderTodos();
        }
    }

    // Todoの状態を切り替え
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    // Todoを削除
    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    // 完了したTodoをすべて削除
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    }

    // イベントリスナー
    addButton.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const index = parseInt(e.target.dataset.index);
            toggleTodo(index);
        }

        if (e.target.classList.contains('delete-button')) {
            const index = parseInt(e.target.dataset.index);
            deleteTodo(index);
        }
    });

    clearCompletedButton.addEventListener('click', clearCompleted);

    // 初期表示
    renderTodos();
});