// 简化版植物陪伴应用

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化植物显示
    updatePlantDisplay();
    updateStreakDisplay();
    
    // 拍照识别按钮
    document.getElementById('camera-btn').addEventListener('click', function() {
        document.getElementById('camera-section').classList.remove('hidden');
    });
    
    // 关闭拍照区域
    document.getElementById('close-camera-section').addEventListener('click', function() {
        document.getElementById('camera-section').classList.add('hidden');
        closeCamera();
        closePhotoPreview();
    });
    
    // 植物对话按钮
    document.getElementById('talk-btn').addEventListener('click', function() {
        // 隐藏所有聊天机器人
        cozeWebSDKForCactus.hideChatBot();
        cozeWebSDKForMoss.hideChatBot();
        cozeWebSDKForRose.hideChatBot();
        cozeWebSDKForLuckyBamboo.hideChatBot();
        
        // 根据当前植物显示对应聊天机器人
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
            showToast('该植物暂不支持对话功能');
        }
    });
    
    // 浇水记录按钮
    document.getElementById('water-btn').addEventListener('click', function() {
        const today = new Date().toDateString();
        const lastWaterDate = localStorage.getItem('lastWaterDate');
        let streakDays = parseInt(localStorage.getItem('waterStreakDays')) || 0;
        
        if (lastWaterDate !== today) {
            // 检查是否连续
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastWaterDate === yesterday.toDateString()) {
                streakDays++;
            } else if (lastWaterDate !== today) {
                streakDays = 1; // 重新开始计算
            }
            
            localStorage.setItem('waterStreakDays', streakDays.toString());
            localStorage.setItem('lastWaterDate', today);
            
            updateStreakDisplay();
            showToast(`浇水成功！连续浇水 ${streakDays} 天`);
        } else {
            showToast('今天已经浇过水了');
        }
    });
    
    // 植物切换
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
    
    // 拍照功能事件
    document.getElementById('camera-open-btn').addEventListener('click', function() {
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
});

// 更新植物显示
function updatePlantDisplay() {
    const plant = plants[currentPlantIndex];
    document.getElementById('plant-image').src = plant.image;
    document.getElementById('plant-image').alt = plant.name;
    document.getElementById('plant-name').textContent = plant.name;
    document.getElementById('current-plant-name').textContent = plant.name;
    
    // 更新切换按钮状态
    document.getElementById('prev-plant').disabled = currentPlantIndex === 0;
    document.getElementById('next-plant').disabled = currentPlantIndex === plants.length - 1;
}

// 更新浇水记录显示
function updateStreakDisplay() {
    const streakDays = parseInt(localStorage.getItem('waterStreakDays')) || 0;
    document.getElementById('streak-days').textContent = streakDays + '天';
}

// 显示提示信息
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}