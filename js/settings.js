// 设置相关功能

// 初始化本地存储数据
function initLocalStorage() {
    if (!localStorage.getItem('streakDays')) {
        localStorage.setItem('streakDays', '0');
    }
    if (!localStorage.getItem('lastCheckInDate')) {
        localStorage.setItem('lastCheckInDate', '');
    }
    
    // 初始化每种植物的收藏状态
    plants.forEach(plant => {
        if (!localStorage.getItem(`isFavorite_${plant.name}`)) {
            localStorage.setItem(`isFavorite_${plant.name}`, 'false');
        }
    });
    
    if (!localStorage.getItem('voiceSettings')) {
        localStorage.setItem('voiceSettings', JSON.stringify({
            voiceStyle: 'girl',
            voiceSpeed: 'normal',
            voicePitch: 'normal'
        }));
    }
    if (!localStorage.getItem('reminderSettings')) {
        localStorage.setItem('reminderSettings', JSON.stringify({
            reminderSound: 'sound1',
            popupDuration: '5',
            volume: '0.7'
        }));
    }
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    } else {
        try {
            const storedTasks = JSON.parse(localStorage.getItem('tasks'));
            // 数据验证和清理
            tasks = storedTasks.filter(task => {
                return task && 
                       task.id && 
                       (task.name || task.name === '') && // 允许空名称但会显示"未命名任务"
                       task.date !== undefined && 
                       task.time !== undefined && 
                       task.repeat !== undefined;
            }).map(task => {
                // 确保所有字段都有值
                return {
                    id: task.id || Date.now().toString(),
                    name: task.name || '未命名任务',
                    date: task.date || '',
                    time: task.time || '',
                    repeat: task.repeat || 'none',
                    completed: task.completed || false
                };
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('解析任务数据失败:', e);
            tasks = [];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    
    // 初始化每种植物的聊天记录
    plants.forEach(plant => {
        if (!localStorage.getItem(plant.chatKey)) {
            localStorage.setItem(plant.chatKey, JSON.stringify([]));
        }
    });
    
    // 初始化每种植物的收藏内容
    plants.forEach(plant => {
        if (!localStorage.getItem(`favorites_${plant.name}`)) {
            localStorage.setItem(`favorites_${plant.name}`, JSON.stringify([]));
        }
    });
    
    updateImportantTasks();
    updateTaskList();
    updateFavoritesDisplay();
}
