// 工具函数

// 显示提示框
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// 显示提醒
function showReminder(message) {
    const reminderModal = document.getElementById('reminder-modal');
    const reminderMessage = document.getElementById('reminder-message');
    const reminderSoundPlayer = document.getElementById('reminder-sound-player');
    const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings') || '{}');
    const volume = parseFloat(reminderSettings.volume || '0.7');
    
    reminderMessage.textContent = message;
    reminderModal.style.display = 'flex';
    
    // 请求浏览器通知权限
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('植物陪伴提醒', {
                    body: message
                });
            }
        });
    } else {
        new Notification('植物陪伴提醒', {
            body: message
        });
    }
    
    // 播放提醒音效
    if (reminderSettings.reminderSound) {
        reminderSoundPlayer.src = `sounds/${reminderSettings.reminderSound}.mp3`;
        reminderSoundPlayer.volume = volume;
        reminderSoundPlayer.play().catch(e => {
            console.log('无法播放音效:', e);
            document.getElementById('permission-alert').classList.remove('hidden');
        });
    }
    
    // 设置自动关闭
    if (reminderSettings.popupDuration && reminderSettings.popupDuration !== 'manual') {
        setTimeout(() => {
            reminderModal.style.display = 'none';
        }, parseInt(reminderSettings.popupDuration) * 1000);
    }
    
    // 更新待处理提醒计数
    pendingReminders++;
    updatePendingReminders();
}

// 更新待处理提醒计数
function updatePendingReminders() {
    const taskBtn = document.getElementById('task-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    
    // 清除现有标记
    const existingBadges = document.querySelectorAll('.badge');
    existingBadges.forEach(badge => badge.remove());
    
    if (pendingReminders > 0) {
        // 在任务按钮上添加标记
        const taskBadge = document.createElement('div');
        taskBadge.className = 'badge';
        taskBtn.appendChild(taskBadge);
        
        // 在收藏按钮上添加标记
        const favoriteBadge = document.createElement('div');
        favoriteBadge.className = 'badge';
        favoriteBtn.appendChild(favoriteBadge);
        
        // 更新页面标题
        document.title = `(${pendingReminders}) 植物陪伴应用`;
    } else {
        // 恢复页面标题
        document.title = '植物陪伴应用';
    }
}

// 切换页面
function switchPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('nav-active');
        if (btn.getAttribute('data-target') === pageId) {
            btn.classList.add('nav-active');
        }
    });
}

// 显示切换植物通知
function showSwitchNotice() {
    const notice = document.getElementById('switch-notice');
    notice.textContent = `已切换到${plants[currentPlantIndex].name}的聊天`;
    notice.classList.add('show');
    
    setTimeout(() => {
        notice.classList.remove('show');
    }, 3000);
}

// 关闭结果模态框并隐藏加载提示
function closeResultModal(button) {
    const modal = button.closest('.modal');
    if (modal) {
        modal.style.display = 'none';
        // 确保加载提示也被隐藏
        hideLoadingMessage();
    }
}

// 显示加载提示
function showLoadingMessage(message) {
    // 移除已存在的加载提示
    hideLoadingMessage();
    
    const loadingModal = document.createElement('div');
    loadingModal.id = 'loading-modal';
    loadingModal.className = 'modal';
    loadingModal.style.display = 'flex';
    
    loadingModal.innerHTML = `
        <div class="modal-content text-center">
            <div class="text-green-600 mb-4">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
            </div>
            <h3 class="text-lg font-semibold text-green-700 mb-2">AI分析中</h3>
            <p class="text-gray-600">${message}</p>
            <div class="mt-4 text-sm text-gray-500">
                <i class="fas fa-robot mr-1"></i>
                正在使用GPT-4o模型进行植物识别...
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingModal);
    
    // 添加自动隐藏机制，防止加载提示一直显示
    setTimeout(() => {
        if (loadingModal && loadingModal.parentNode) {
            console.log('自动隐藏加载提示（超时保护）');
            hideLoadingMessage();
        }
    }, 120000); // 2分钟后自动隐藏
}

// 隐藏加载提示
function hideLoadingMessage() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.remove();
    }
}
