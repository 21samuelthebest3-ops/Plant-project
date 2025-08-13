// 主应用文件

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化本地存储
    initLocalStorage();
    
    // 更新连续打卡显示
    updateStreakDisplay();
    
    // 和植物说话按钮
    document.getElementById('talk-btn').addEventListener('click', function() {
        cozeWebSDKForCactus.hideChatBot();
        cozeWebSDKForMoss.hideChatBot();
        cozeWebSDKForRose.hideChatBot();
        cozeWebSDKForLuckyBamboo.hideChatBot();
        document.getElementById('talk-modal').style.display = 'none';
        
        const currentPlant = plants[currentPlantIndex].name;
        if (currentPlant === '仙人掌') {
            cozeWebSDKForCactus.showChatBot();
        } else if (currentPlant === '苔藓') {
            cozeWebSDKForMoss.showChatBot();
        } else if (currentPlant === '玫瑰') {
            cozeWebSDKForRose.showChatBot();
        } else if (currentPlant === '富贵竹') {
            cozeWebSDKForLuckyBamboo.showChatBot();
        } else {
            document.getElementById('talk-modal').style.display = 'flex';
            document.getElementById('talk-input').placeholder = `和你的${currentPlant}说点什么吧...`;
            loadPlantChat();
        }
    });
    
    // 关闭对话模态框
    document.getElementById('close-talk-modal').addEventListener('click', function() {
        document.getElementById('talk-modal').style.display = 'none';
    });
    
    // 关闭提醒模态框
    document.getElementById('close-reminder-modal').addEventListener('click', function() {
        document.getElementById('reminder-modal').style.display = 'none';
    });
    
    // 立即处理提醒
    document.getElementById('handle-now-btn').addEventListener('click', function() {
        document.getElementById('reminder-modal').style.display = 'none';
        pendingReminders = Math.max(0, pendingReminders - 1);
        updatePendingReminders();
    });
    
    // 稍后处理提醒
    document.getElementById('handle-later-btn').addEventListener('click', function() {
        document.getElementById('reminder-modal').style.display = 'none';
    });
    
    // 发送对话
    document.getElementById('send-talk-btn').addEventListener('click', async function() {
        const input = document.getElementById('talk-input');
        const message = input.value.trim();
        
        if (message) {
            // 添加用户消息
            const messagesContainer = document.getElementById('talk-messages');
            const userMessage = document.createElement('div');
            userMessage.className = 'bg-blue-100 p-3 rounded-lg mb-2 text-right';
            userMessage.innerHTML = `<p class="text-sm">${message}</p>`;
            messagesContainer.appendChild(userMessage);
            
            // 保存用户消息
            saveChatMessage(message, true);
            
            // 清空输入框
            input.value = '';
            
            // 添加植物回应
            const currentPlant = plants[currentPlantIndex].name;
            const response = getPlantResponse(currentPlant);
            
            // 模拟语音延迟
            setTimeout(() => {
                const plantMessage = document.createElement('div');
                plantMessage.className = 'bg-green-100 p-3 rounded-lg mb-2';
                plantMessage.innerHTML = `<p class="text-sm">${response}</p>`;
                messagesContainer.appendChild(plantMessage);
                
                // 保存植物回应
                saveChatMessage(response, false);
                
                // 滚动到底部
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 2000);
        }
    });
    
    // 收藏按钮
    document.getElementById('favorite-btn').addEventListener('click', function() {
        const currentPlant = plants[currentPlantIndex].name;
        isFavorite = !isFavorite;
        localStorage.setItem(`isFavorite_${currentPlant}`, isFavorite.toString());
        
        if (isFavorite) {
            saveFavorite(`收藏于 ${new Date().toLocaleString()}`);
        }
        
        updateFavoriteButton();
        updateFavoritesDisplay();
        switchPage('favorites');
    });
    
    // 植物切换按钮
    document.getElementById('prev-plant').addEventListener('click', function() {
        if (currentPlantIndex > 0) {
            currentPlantIndex--;
            updatePlantDisplay();
        }
    });
    
    document.getElementById('next-plant').addEventListener('click', function() {
        if (currentPlantIndex < plants.length - 1) {
            currentPlantIndex++;
            updatePlantDisplay();
        }
    });
    
    // 新增按钮
    document.getElementById('add-btn').addEventListener('click', function() {
        switchPage('add-task');
    });
    
    // 任务按钮
    document.getElementById('task-btn').addEventListener('click', function() {
        switchPage('tasks');
        pendingReminders = 0;
        updatePendingReminders();
    });
    
    // 设置按钮
    document.getElementById('settings-btn').addEventListener('click', function() {
        switchPage('settings');
    });
    
    // 标签切换
    document.getElementById('favorites-tab').addEventListener('click', function() {
        this.classList.add('border-green-500', 'text-green-500');
        document.getElementById('important-tab').classList.remove('border-green-500', 'text-green-500');
        document.getElementById('favorites-content').classList.remove('hidden');
        document.getElementById('important-content').classList.add('hidden');
    });
    
    document.getElementById('important-tab').addEventListener('click', function() {
        this.classList.add('border-green-500', 'text-green-500');
        document.getElementById('favorites-tab').classList.remove('border-green-500', 'text-green-500');
        document.getElementById('important-content').classList.remove('hidden');
        document.getElementById('favorites-content').classList.add('hidden');
    });
    
    // 植物标签切换
    document.querySelectorAll('.plant-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.plant-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentPlantTab = this.getAttribute('data-plant');
            updateFavoritesDisplay();
        });
    });
    
    // 音量控制
    document.getElementById('volume-control').addEventListener('input', function() {
        const volume = this.value;
        const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings') || '{}');
        reminderSettings.volume = volume;
        localStorage.setItem('reminderSettings', JSON.stringify(reminderSettings));
    });
    
    // 签到按钮
    document.getElementById('check-in-btn').addEventListener('click', function() {
        try {
            const today = new Date().toDateString();
            const lastCheckInDate = localStorage.getItem('lastCheckInDate');
            let streakDays = parseInt(localStorage.getItem('streakDays')) || 0;
            
            if (lastCheckInDate !== today) {
                // 新的一天签到
                streakDays++;
                localStorage.setItem('streakDays', streakDays.toString());
                localStorage.setItem('lastCheckInDate', today);
                
                // 更新显示
                updateStreakDisplay();
                
                // 显示签到成功提醒
                showReminder("签到成功！连续签到" + streakDays + "天");
            }
        } catch (e) {
            console.error('本地存储操作失败:', e);
        }
    });
    
    // 添加任务按钮
    document.getElementById('add-task-btn').addEventListener('click', function() {
        const taskName = document.getElementById('task-name-input').value.trim();
        const date = document.getElementById('reminder-date').value;
        const time = document.getElementById('reminder-time').value;
        const repeat = document.getElementById('repeat-setting').value;
        
        addTask(taskName, date, time, repeat);
        document.getElementById('task-name-input').value = '';
        switchPage('tasks');
    });
    
    // 语音测试按钮
    document.getElementById('voice-test-btn').addEventListener('click', function() {
        testVoice();
    });
    
    // 恢复默认设置
    document.getElementById('reset-settings').addEventListener('click', function() {
        document.getElementById('voice-toggle').checked = true;
        document.getElementById('reminder-toggle').checked = true;
        document.getElementById('voice-style').value = 'girl';
        document.getElementById('voice-speed').value = 'normal';
        document.getElementById('voice-pitch').value = 'normal';
        document.getElementById('reminder-sound').value = 'sound1';
        document.getElementById('popup-duration').value = '5';
        document.getElementById('volume-control').value = '0.7';
        
        // 保存默认设置
        localStorage.setItem('voiceSettings', JSON.stringify({
            voiceStyle: 'girl',
            voiceSpeed: 'normal',
            voicePitch: 'normal'
        }));
        
        localStorage.setItem('reminderSettings', JSON.stringify({
            reminderSound: 'sound1',
            popupDuration: '5',
            volume: '0.7'
        }));
    });
    
    // 返回按钮
    document.getElementById('back-btn-favorites').addEventListener('click', function() {
        switchPage('home');
    });
    
    document.getElementById('back-btn-tasks').addEventListener('click', function() {
        switchPage('home');
    });
    
    document.getElementById('back-btn-add').addEventListener('click', function() {
        switchPage('home');
    });
    
    document.getElementById('back-btn-settings').addEventListener('click', function() {
        switchPage('home');
    });
    
    document.getElementById('back-btn-photo').addEventListener('click', function() {
        switchPage('home');
    });
    
    // 导航按钮点击事件
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            switchPage(target);
        });
    });
    
    // 默认选中主页按钮
    document.querySelector('[data-target="home"]').classList.add('nav-active');
    
    // 初始化植物显示
    updatePlantDisplay();
    
    // 添加图片点击事件
    document.getElementById('plant-image').addEventListener('click', function() {
        const currentPlant = plants[currentPlantIndex];
        if (currentPlant.video) {
            const videoElement = document.getElementById('plant-video');
            videoElement.src = currentPlant.video;
            videoElement.classList.remove('hidden');
            this.classList.add('hidden');
            
            videoElement.addEventListener('ended', function() {
                videoElement.classList.add('hidden');
                document.getElementById('plant-image').classList.remove('hidden');
            });
            
            videoElement.play();
        }
    });
    
    // 设置每日提醒检查
    setInterval(function() {
        const now = new Date();
        const reminderToggle = document.getElementById('reminder-toggle');
        
        if (reminderToggle.checked && now.getHours() === 9 && now.getMinutes() === 0) {
            showReminder("现在是早上9点，记得来看看你的植物小伙伴哦~");
        }
    }, 60000);
    
    // 拍照识别功能事件监听
    document.getElementById('camera-btn').addEventListener('click', function() {
        openCamera();
    });
    
    document.getElementById('gallery-btn').addEventListener('click', function() {
        openGallery();
    });
    
    document.getElementById('capture-btn').addEventListener('click', function() {
        capturePhoto();
    });
    
    document.getElementById('close-camera-btn').addEventListener('click', function() {
        closeCamera();
    });
    
    document.getElementById('close-preview-btn').addEventListener('click', function() {
        closePhotoPreview();
    });
    
    document.getElementById('analyze-btn').addEventListener('click', function() {
        analyzePhoto();
    });
    
    document.getElementById('test-api-btn').addEventListener('click', function() {
        testAPIConnection();
    });
    
    document.getElementById('test-plant-btn').addEventListener('click', function() {
        testPlantRecognition();
    });
});
