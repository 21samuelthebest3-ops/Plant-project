// 任务相关功能

// 更新重要任务列表
function updateImportantTasks() {
    const loadingTasks = document.getElementById('loading-tasks');
    const tasksContainer = document.getElementById('tasks-container');
    const noTasks = document.getElementById('no-tasks');
    
    loadingTasks.classList.remove('hidden');
    tasksContainer.classList.add('hidden');
    noTasks.classList.add('hidden');
    
    // 模拟加载延迟
    setTimeout(() => {
        try {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            // 数据验证和清理
            const validTasks = storedTasks.filter(task => {
                return task && task.id && (task.name || task.name === '');
            }).map(task => {
                return {
                    id: task.id,
                    name: task.name || '未命名任务',
                    date: task.date || '',
                    time: task.time || '',
                    repeat: task.repeat || 'none',
                    completed: task.completed || false
                };
            });
            
            tasks = validTasks;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            if (tasks.length === 0) {
                loadingTasks.classList.add('hidden');
                noTasks.classList.remove('hidden');
                return;
            }
            
            let html = '';
            tasks.forEach(task => {
                html += `
                    <div class="important-task p-3 mb-2 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium">${task.name || '未命名任务'}</div>
                                <div class="text-xs text-gray-500">${task.date} ${task.time}</div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="complete-task-btn text-green-500" data-id="${task.id}">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="delete-task-btn text-red-500" data-id="${task.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            tasksContainer.innerHTML = html;
            loadingTasks.classList.add('hidden');
            tasksContainer.classList.remove('hidden');
            
            // 添加任务完成和删除事件
            document.querySelectorAll('.complete-task-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    completeTask(taskId);
                });
            });
            
            document.querySelectorAll('.delete-task-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    deleteTask(taskId);
                });
            });
            
        } catch (e) {
            console.error('更新任务列表失败:', e);
            loadingTasks.classList.add('hidden');
            noTasks.classList.remove('hidden');
        }
    }, 500);
}

// 更新任务列表
function updateTaskList() {
    const loadingTasks = document.getElementById('loading-tasks-list');
    const tasksContainer = document.getElementById('tasks-list-container');
    const noTasks = document.getElementById('no-tasks-list');
    
    loadingTasks.classList.remove('hidden');
    tasksContainer.classList.add('hidden');
    noTasks.classList.add('hidden');
    
    // 模拟加载延迟
    setTimeout(() => {
        try {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            // 数据验证和清理
            const validTasks = storedTasks.filter(task => {
                return task && task.id && (task.name || task.name === '');
            }).map(task => {
                return {
                    id: task.id,
                    name: task.name || '未命名任务',
                    date: task.date || '',
                    time: task.time || '',
                    repeat: task.repeat || 'none',
                    completed: task.completed || false
                };
            });
            
            tasks = validTasks;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            if (tasks.length === 0) {
                loadingTasks.classList.add('hidden');
                noTasks.classList.remove('hidden');
                return;
            }
            
            let html = '';
            tasks.forEach(task => {
                html += `
                    <div class="important-task p-3 mb-2 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium">${task.name || '未命名任务'}</div>
                                <div class="text-xs text-gray-500">${task.date} ${task.time}</div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="complete-task-btn text-green-500" data-id="${task.id}">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="delete-task-btn text-red-500" data-id="${task.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            tasksContainer.innerHTML = html;
            loadingTasks.classList.add('hidden');
            tasksContainer.classList.remove('hidden');
            
            // 添加任务完成和删除事件
            document.querySelectorAll('.complete-task-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    completeTask(taskId);
                });
            });
            
            document.querySelectorAll('.delete-task-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = this.getAttribute('data-id');
                    deleteTask(taskId);
                });
            });
            
        } catch (e) {
            console.error('更新任务列表失败:', e);
            loadingTasks.classList.add('hidden');
            noTasks.classList.remove('hidden');
        }
    }, 500);
}

// 完成任务
function completeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateImportantTasks();
    updateTaskList();
    showReminder("任务已完成！");
}

// 删除任务
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateImportantTasks();
    updateTaskList();
    showReminder("任务已删除！");
}

// 添加任务
function addTask(taskName, date, time, repeat) {
    if (!taskName.trim()) {
        showReminder("请输入任务名称");
        return;
    }
    
    const newTask = {
        id: Date.now().toString(),
        name: taskName.trim(),
        date: date || '',
        time: time || '',
        repeat: repeat || 'none',
        completed: false
    };
    
    tasks.unshift(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateImportantTasks();
    updateTaskList();
    showReminder("任务添加成功：" + newTask.name);
}

// 更新连续打卡天数显示
function updateStreakDisplay() {
    try {
        const streakDays = localStorage.getItem('streakDays') || '0';
        document.getElementById('streak-days-counter').textContent = streakDays;
        document.getElementById('streak-counter').style.display = 'block';
    } catch (e) {
        console.error('读取本地存储失败:', e);
        document.getElementById('streak-days-counter').textContent = '0';
    }
}
