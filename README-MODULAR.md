# 植物陪伴应用 - 模块化结构说明

## 项目结构

```
Plant-project/
├── index.html                    # 主HTML文件（已拆分）
├── css/
│   └── styles.css               # 所有CSS样式
├── js/
│   ├── data.js                  # 数据定义和全局变量
│   ├── utils.js                 # 工具函数
│   ├── plants.js                # 植物相关功能
│   ├── tasks.js                 # 任务管理功能
│   ├── favorites.js             # 收藏功能
│   ├── settings.js              # 设置功能
│   ├── photo-recognition.js     # 拍照识别基础功能
│   ├── photo-recognition-extra.js # 拍照识别API功能
│   ├── coze-sdk.js              # Coze SDK配置
│   └── app.js                   # 主应用逻辑和事件监听
├── config.js                    # 配置文件
├── sounds/                      # 音效文件
├── public/                      # 静态资源
└── legacy/                      # 旧版本文件
```

## 文件说明

### HTML文件
- **index.html**: 主HTML文件，包含页面结构和所有JavaScript文件引用

### CSS文件
- **css/styles.css**: 包含所有样式定义，包括动画、布局、组件样式等

### JavaScript文件

#### 1. data.js
- 植物数据定义
- 全局变量声明
- 应用状态管理

#### 2. utils.js
- 通用工具函数
- 页面切换功能
- 提示框和提醒功能
- 加载提示管理

#### 3. plants.js
- 植物显示和切换功能
- 植物聊天功能
- 收藏按钮管理
- 植物特定回应生成

#### 4. tasks.js
- 任务列表管理
- 任务添加、删除、完成功能
- 任务显示更新
- 连续打卡功能

#### 5. favorites.js
- 收藏内容管理
- 收藏显示更新
- 收藏项删除功能

#### 6. settings.js
- 本地存储初始化
- 设置数据管理
- 默认配置设置

#### 7. photo-recognition.js
- 摄像头和相册功能
- 照片拍摄和预览
- 基础拍照功能

#### 8. photo-recognition-extra.js
- OpenRouter API调用
- 植物识别功能
- 图片压缩和处理
- 识别结果显示
- API测试功能

#### 9. coze-sdk.js
- Coze SDK初始化
- 各植物机器人的配置
- 聊天机器人管理

#### 10. app.js
- 应用初始化
- 事件监听器设置
- 页面交互逻辑
- 定时任务设置

## 优势

### 1. 代码组织
- **模块化**: 每个文件负责特定功能，便于维护
- **可读性**: 代码结构清晰，易于理解
- **可扩展性**: 新功能可以独立添加

### 2. 维护性
- **单一职责**: 每个文件只负责一个功能模块
- **低耦合**: 模块间依赖关系清晰
- **易调试**: 问题定位更准确

### 3. 开发效率
- **并行开发**: 不同开发者可以同时处理不同模块
- **代码复用**: 通用功能可以在多个地方使用
- **版本控制**: 文件变更更容易追踪

## 使用说明

1. **启动应用**: 直接打开 `index.html` 文件
2. **修改样式**: 编辑 `css/styles.css` 文件
3. **添加功能**: 在相应的JavaScript文件中添加代码
4. **配置API**: 在 `config.js` 中设置API密钥

## 注意事项

1. **文件加载顺序**: JavaScript文件按特定顺序加载，请勿随意调整
2. **依赖关系**: 某些模块依赖其他模块，修改时需注意
3. **API配置**: 确保在 `config.js` 中正确配置API密钥
4. **浏览器兼容性**: 应用使用了现代JavaScript特性，建议使用最新浏览器

## 迁移说明

原 `plant-companion-app.html` 文件已拆分为多个模块化文件：
- HTML结构 → `index.html`
- CSS样式 → `css/styles.css`
- JavaScript功能 → `js/` 目录下的各个文件

所有功能保持不变，只是代码结构更加清晰和易于维护。
