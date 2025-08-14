// 植物数据
const plants = [
    { name: "苔藓", image: "https://s.coze.cn/image/IBl8j7eurhQ", chatKey: "mossChat" },
    { name: "仙人掌", image: "https://s.coze.cn/image/x5D5yptx4GM", chatKey: "cactusChat" },
    { name: "富贵竹", image: "https://s.coze.cn/image/Ll05YvMU1nk", chatKey: "bambooChat" },
    { name: "玫瑰", image: "https://s.coze.cn/image/ifacFHKcyYQ", chatKey: "roseChat" }
];

// 全局变量
let currentPlantIndex = 0;
let isFavorite = false;
let tasks = [];
let pendingReminders = 0;
let currentPlantTab = "all";
