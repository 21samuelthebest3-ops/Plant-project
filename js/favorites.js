// 收藏相关功能

// 更新收藏内容显示
function updateFavoritesDisplay() {
    const favoritesContent = document.getElementById('favorites-content');
    favoritesContent.innerHTML = '';
    
    if (currentPlantTab === "all") {
        // 显示所有植物的收藏内容
        let hasFavorites = false;
        
        plants.forEach(plant => {
            const plantFavorites = JSON.parse(localStorage.getItem(`favorites_${plant.name}`) || '[]');
            if (plantFavorites.length > 0) {
                hasFavorites = true;
                
                const plantSection = document.createElement('div');
                plantSection.className = 'mb-6';
                
                const plantHeader = document.createElement('h4');
                plantHeader.className = 'text-lg font-medium text-green-700 mb-2';
                plantHeader.textContent = plant.name;
                
                plantSection.appendChild(plantHeader);
                
                plantFavorites.forEach((favorite, index) => {
                    const favoriteItem = document.createElement('div');
                    favoriteItem.className = 'favorite-item';
                    
                    const favoriteImage = document.createElement('img');
                    favoriteImage.className = 'favorite-plant-image';
                    favoriteImage.src = plant.image;
                    favoriteImage.alt = plant.name;
                    favoriteImage.onerror = function() {
                        this.style.display = 'block';
                        this.style.backgroundColor = '#f0f0f0';
                        this.style.border = '1px dashed #ccc';
                        this.style.minHeight = '50px';
                        this.title = '图片资源未找到';
                    };
                    
                    const favoriteText = document.createElement('div');
                    favoriteText.className = 'flex-grow';
                    favoriteText.textContent = favorite.text;
                    
                    const removeBtn = document.createElement('div');
                    removeBtn.className = 'remove-favorite-btn';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.addEventListener('click', () => {
                        removeFavorite(plant.name, index);
                    });
                    
                    favoriteItem.appendChild(favoriteImage);
                    favoriteItem.appendChild(favoriteText);
                    favoriteItem.appendChild(removeBtn);
                    plantSection.appendChild(favoriteItem);
                });
                
                favoritesContent.appendChild(plantSection);
            }
        });
        
        if (!hasFavorites) {
            favoritesContent.innerHTML = `
                <i class="fas fa-heart text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">暂无收藏内容，快去添加吧~</p>
            `;
        }
    } else {
        // 显示特定植物的收藏内容
        const plantFavorites = JSON.parse(localStorage.getItem(`favorites_${currentPlantTab}`) || '[]');
        
        if (plantFavorites.length === 0) {
            favoritesContent.innerHTML = `
                <i class="fas fa-heart text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">${currentPlantTab}暂无收藏内容</p>
            `;
        } else {
            plantFavorites.forEach((favorite, index) => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                
                const favoriteImage = document.createElement('img');
                favoriteImage.className = 'favorite-plant-image';
                favoriteImage.src = plants.find(p => p.name === currentPlantTab).image;
                favoriteImage.alt = currentPlantTab;
                
                const favoriteText = document.createElement('div');
                favoriteText.className = 'flex-grow';
                favoriteText.textContent = favorite.text;
                
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-favorite-btn';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', () => {
                    removeFavorite(currentPlantTab, index);
                });
                
                favoriteItem.appendChild(favoriteImage);
                favoriteItem.appendChild(favoriteText);
                favoriteItem.appendChild(removeBtn);
                favoritesContent.appendChild(favoriteItem);
            });
        }
    }
}

// 移除收藏项
function removeFavorite(plantName, index) {
    try {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${plantName}`)) || [];
        if (index >= 0 && index < favorites.length) {
            favorites.splice(index, 1);
            localStorage.setItem(`favorites_${plantName}`, JSON.stringify(favorites));
            
            // 如果当前植物没有收藏项了，更新收藏按钮状态
            if (plantName === plants[currentPlantIndex].name && favorites.length === 0) {
                isFavorite = false;
                localStorage.setItem(`isFavorite_${plantName}`, 'false');
                updateFavoriteButton();
            }
            
            updateFavoritesDisplay();
            showToast("已取消收藏");
        }
    } catch (e) {
        console.error('移除收藏失败:', e);
    }
}

// 保存收藏内容
function saveFavorite(text) {
    const currentPlant = plants[currentPlantIndex].name;
    try {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${currentPlant}`)) || [];
        favorites.push({ text, timestamp: new Date().getTime() });
        localStorage.setItem(`favorites_${currentPlant}`, JSON.stringify(favorites));
        updateFavoritesDisplay();
    } catch (e) {
        console.error('保存收藏失败:', e);
    }
}
