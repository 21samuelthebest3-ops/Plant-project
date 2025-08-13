// 植物相关功能

// 更新植物显示
function updatePlantDisplay() {
    const plantImage = document.getElementById('plant-image');
    const plantName = document.getElementById('plant-name');
    const prevBtn = document.getElementById('prev-plant');
    const nextBtn = document.getElementById('next-plant');
    const talkInput = document.getElementById('talk-input');
    
    // 淡出效果
    plantImage.style.opacity = 0;
    
    setTimeout(() => {
        plantImage.src = plants[currentPlantIndex].image;
        plantImage.alt = plants[currentPlantIndex].name;
        // 添加图片加载失败处理
        plantImage.onerror = function() {
            this.style.display = 'block';
            this.style.backgroundColor = '#f0f0f0';
            this.style.border = '1px dashed #ccc';
            this.style.minHeight = '150px';
            this.title = '图片资源未找到';
        };
        plantName.textContent = plants[currentPlantIndex].name;
        talkInput.placeholder = `和你的${plants[currentPlantIndex].name}说点什么吧...`;
        
        // 彻底移除视频元素
        let videoElement = document.getElementById('inline-video');
        if (videoElement) {
            videoElement.pause();
            videoElement.src = '';
            videoElement.remove(); // 从DOM中删除元素
            videoElement = null;
        }

        // 淡入效果
        // 移除视频元素创建代码，禁用视频功能
        videoElement = null;

        // 淡入效果
        plantImage.style.opacity = 1;

        // 点击图片播放视频
        // 禁用视频播放功能
        plantImage.onclick = null;

        // 更新按钮状态
        prevBtn.disabled = currentPlantIndex === 0;
        nextBtn.disabled = currentPlantIndex === plants.length - 1;
        
        // 更新说话按钮文本
        document.getElementById('current-plant-name').textContent = plants[currentPlantIndex].name;
        
        // 更新收藏状态
        isFavorite = localStorage.getItem(`isFavorite_${plants[currentPlantIndex].name}`) === 'true';
        updateFavoriteButton();
        
        // 显示切换通知
        showSwitchNotice();
    }, 150);
}

// 更新收藏按钮状态
function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favorite-btn');
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart mr-2"></i> 已收藏';
        favoriteBtn.classList.add('bg-red-500');
    } else {
        favoriteBtn.innerHTML = '<i class="fas fa-heart mr-2"></i> 收藏';
        favoriteBtn.classList.remove('bg-red-500');
    }
}

// 播放植物视频
function playPlantVideo(videoSrc) {
    const videoModal = document.getElementById('video-modal');
    const plantVideo = document.getElementById('plant-video');
    const closeBtn = document.getElementById('close-video-modal');

    // 设置视频源并播放
    plantVideo.src = videoSrc;
    videoModal.style.display = 'block';
    plantVideo.play();

    // 关闭模态框时暂停视频
    const closeHandler = () => {
        videoModal.style.display = 'none';
        plantVideo.pause();
        plantVideo.src = ''; // 释放视频资源
    };

    closeBtn.addEventListener('click', closeHandler);

    // 点击模态框外部关闭
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeHandler();
    });
}

// 加载当前植物的聊天记录
function loadPlantChat() {
    const messagesContainer = document.getElementById('talk-messages');
    const currentPlant = plants[currentPlantIndex].name;
    const chatKey = plants[currentPlantIndex].chatKey;
    
    // 清空当前聊天记录
    messagesContainer.innerHTML = '';
    
    // 加载存储的聊天记录
    try {
        const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];
        
        if (chatHistory.length === 0) {
            // 空聊天记录时显示欢迎语
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'bg-green-100 p-3 rounded-lg mb-2';
            welcomeMessage.innerHTML = `<p class="text-sm">和你的${currentPlant}打个招呼吧~</p>`;
            messagesContainer.appendChild(welcomeMessage);
        } else {
            // 显示历史聊天记录
            chatHistory.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = message.isUser ? 'bg-blue-100 p-3 rounded-lg mb-2 text-right' : 'bg-green-100 p-3 rounded-lg mb-2';
                messageDiv.innerHTML = `<p class="text-sm">${message.text}</p>`;
                messagesContainer.appendChild(messageDiv);
            });
            
            // 滚动到底部
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (e) {
        console.error('加载聊天记录失败:', e);
    }
}

// 保存聊天记录
function saveChatMessage(text, isUser) {
    const currentPlant = plants[currentPlantIndex];
    const chatKey = currentPlant.chatKey;
    
    try {
        const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];
        chatHistory.push({ text, isUser, timestamp: new Date().getTime() });
        localStorage.setItem(chatKey, JSON.stringify(chatHistory));
    } catch (e) {
        console.error('保存聊天记录失败:', e);
    }
}

// 获取植物特定回应
function getPlantResponse(plantName) {
    const responses = {
        "苔藓": [
            "我是你的小苔藓，喜欢湿润的环境~",
            "苔藓虽然小，但生命力很顽强哦！",
            "湿润的环境让我感到舒适~"
        ],
        "仙人掌": [
            "我是坚强的仙人掌，不需要太多水分哦~",
            "沙漠是我的家，我很耐旱的！",
            "小心我的刺哦，虽然我很友好~"
        ],
        "富贵竹": [
            "我是富贵竹，希望能给你带来好运~",
            "水培的我需要定期换水哦~",
            "绿色是我的标志，象征着生机勃勃~"
        ],
        "玫瑰": [
            "我是美丽的玫瑰，谢谢你的陪伴~",
            "我的花瓣很娇嫩，需要细心呵护~",
            "玫瑰代表爱情，你愿意照顾我吗？"
        ]
    };
    
    const styleResponses = {
        girl: [
            "今天天气真好，你觉得呢？",
            "和你聊天真开心~",
            "谢谢你的关心，我会努力生长的！"
        ],
        cute: [
            "主人今天也要好好照顾我哦~",
            "主人真温柔，我好开心~",
            "主人今天也要加油哦~"
        ]
    };
    
    const voiceSettings = JSON.parse(localStorage.getItem('voiceSettings') || '{}');
    const style = voiceSettings.voiceStyle || 'girl';
    
    // 50%概率返回植物特定回应，50%返回通用回应
    if (Math.random() > 0.5 && responses[plantName]) {
        return responses[plantName][Math.floor(Math.random() * responses[plantName].length)];
    } else {
        return styleResponses[style][Math.floor(Math.random() * styleResponses[style].length)];
    }
}

// 测试语音
function testVoice() {
    const voiceSettings = JSON.parse(localStorage.getItem('voiceSettings') || '{}');
    const reminderSettings = JSON.parse(localStorage.getItem('reminderSettings') || '{}');
    const volume = parseFloat(reminderSettings.volume || '0.7');
    const testMessages = {
        girl: "你好呀，我是你的植物小伙伴~",
        cute: "主人主人，人家最喜欢你啦~"
    };
    
    const message = testMessages[voiceSettings.voiceStyle || 'girl'];
    const talkMessages = document.getElementById('talk-messages');
    
    const plantMessage = document.createElement('div');
    plantMessage.className = 'bg-green-100 p-3 rounded-lg mb-2';
    plantMessage.innerHTML = `<p class="text-sm">${message}</p>`;
    talkMessages.appendChild(plantMessage);
    
    // 播放测试音效
    const testSound = new Audio('sounds/sound1.mp3');
    testSound.volume = volume;
    testSound.play().catch(e => {
        console.log('无法播放测试音效:', e);
        document.getElementById('permission-alert').classList.remove('hidden');
    });
    
    // 滚动到底部
    talkMessages.scrollTop = talkMessages.scrollHeight;
}
