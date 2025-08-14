// 拍照识别功能

let stream = null;

// 打开摄像头
async function openCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment', // 优先使用后置摄像头
                width: { ideal: 640 },    // 降低默认分辨率以提高性能
                height: { ideal: 480 }
            } 
        });
        
        const video = document.getElementById('camera-video');
        video.srcObject = stream;
        
        // 显示摄像头预览区域
        document.getElementById('camera-preview').classList.remove('hidden');
        
        // 隐藏照片预览区域
        document.getElementById('photo-preview').classList.add('hidden');
        
    } catch (err) {
        console.error('无法访问摄像头:', err);
        alert('无法访问摄像头，请检查权限设置');
    }
}

// 关闭摄像头
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    document.getElementById('camera-preview').classList.add('hidden');
}

// 拍照
function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    
    // 显示照片预览
    document.getElementById('preview-image').src = photoData;
    document.getElementById('photo-preview').classList.remove('hidden');
    
    // 关闭摄像头
    closeCamera();
}

// 打开相册
function openGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 优先使用后置摄像头
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview-image').src = e.target.result;
                document.getElementById('photo-preview').classList.remove('hidden');
                
                // 隐藏摄像头预览区域
                document.getElementById('camera-preview').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// 关闭照片预览
function closePhotoPreview() {
    document.getElementById('photo-preview').classList.add('hidden');
}
