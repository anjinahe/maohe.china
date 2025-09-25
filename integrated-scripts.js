// 全局变量
let currentUser = null;
let timerRunning = false;
let focusTimeSeconds = 25 * 60; // 默认25分钟
let timerInterval = null;
let todayFocusCount = 0;
let todayFocusTotalMinutes = 0;

// DOM元素
const loginModal = document.getElementById('login-modal');
const passwordModal = document.getElementById('password-modal');
const descriptionModal = document.getElementById('description-modal');
const loginTrigger = document.getElementById('login-trigger');
const logoutBtn = document.getElementById('logout-btn');
const closeLoginBtn = document.getElementById('close-login');
const closePasswordBtn = document.getElementById('close-password');
const closeDescriptionBtn = document.getElementById('close-description');
const loginBtn = document.getElementById('login-btn');
const verifyPasswordBtn = document.getElementById('verify-password-btn');
const competitionDescBtn = document.getElementById('competition-desc-btn');
const competitionDescription = document.getElementById('competition-description');
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const focusDurationInput = document.getElementById('focus-duration');
const quickFocusBtns = document.querySelectorAll('.quick-focus-btn');
const studyFeatures = document.querySelectorAll('.study-card');
const studyContent = document.getElementById('study-content');
const userStatus = document.getElementById('user-status');
const profileUserStatus = document.getElementById('profile-user-status');
const profilePhone = document.getElementById('profile-phone');
const viewUpdatesBtn = document.getElementById('view-updates-btn');
const updatesContainer = document.getElementById('updates-container');
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTimeElement = document.getElementById('current-time');
const returnHomeBtn = document.getElementById('return-home-btn');

// 初始化函数
function init() {
    // 检查登录状态
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化主题
    initTheme();
    
    // 初始化其他功能
    initMiniCalendar();
    initLearningStats();
    initWrongQuestions();
    initPomodoro();
    initChat();
    initExperimentAnalysis();
    initQuestionGeneration();
    
    // 添加事件监听器
    addEventListeners();
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-mode');
        themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('night-mode');
        themeToggleBtn.textContent = '🌙';
    }
}

// 切换主题
function toggleTheme() {
    if (document.body.classList.contains('night-mode')) {
        document.body.classList.remove('night-mode');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'day');
    } else {
        document.body.classList.add('night-mode');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'night');
    }
}

// 显示标签页
function showTab(tabId) {
    // 隐藏所有标签页
    tabPanes.forEach(pane => {
        pane.classList.remove('active', 'fadeIn');
    });
    
    // 移除所有导航项的active类
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 显示选中的标签页
    const selectedPane = document.getElementById(tabId);
    if (selectedPane) {
        selectedPane.classList.add('active', 'fadeIn');
    }
    
    // 高亮选中的导航项
    const selectedNavItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
    }
}

// 开始计时器
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        resetTimerBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            focusTimeSeconds--;
            updateTimerDisplay();
            
            if (focusTimeSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                startTimerBtn.disabled = false;
                pauseTimerBtn.disabled = true;
                resetTimerBtn.disabled = false;
                
                // 更新统计数据
                todayFocusCount++;
                todayFocusTotalMinutes += parseInt(focusDurationInput.value) || 25;
                updateFocusStats();
                
                // 播放提示音或显示通知
                alert('专注时间结束！');
            }
        }, 1000);
    }
}

// 暂停计时器
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = false;
    }
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    
    const minutes = parseInt(focusDurationInput.value) || 25;
    focusTimeSeconds = minutes * 60;
    
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
    resetTimerBtn.disabled = true;
}

// 更新计时器显示
function updateTimerDisplay() {
    const hours = Math.floor(focusTimeSeconds / 3600);
    const minutes = Math.floor((focusTimeSeconds % 3600) / 60);
    const seconds = focusTimeSeconds % 60;
    
    let displayString = '';
    if (hours > 0) {
        displayString += `${hours.toString().padStart(2, '0')}:`;
    }
    displayString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    timerDisplay.textContent = displayString;
}

// 更新登录用户界面
function updateUIForLoggedInUser() {
    if (currentUser) {
        userStatus.textContent = '已登录';
        profileUserStatus.textContent = '已登录';
        if (currentUser.phone) {
            profilePhone.textContent = currentUser.phone;
        }
        loginTrigger.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        userStatus.textContent = '未登录';
        profileUserStatus.textContent = '未登录';
        profilePhone.textContent = '未绑定';
        loginTrigger.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// 验证参赛描述密码
function verifyCompetitionPassword() {
    const passwordInput = document.getElementById('access-password');
    const password = passwordInput.value;
    
    if (password === '20131010') {
        // 密码正确，显示参赛描述内容
        const competitionContent = "<h3>参赛描述</h3>\n" +
                                  "<p>本应用是一款专注于提升学习效率的工具，集成了多种学习辅助功能，帮助用户更好地管理学习时间和提高学习质量。本程序为中国轻纺城小学纺都路校区602安建赫科技创新作品</p>\n" +
                                  "<p>主要特点：</p>\n" +
                                  "<ul>\n" +
                                  "  <li>个性化学习计划</li>\n" +
                                  "  <li>高效专注计时</li>\n" +
                                  "  <li>智能学习数据分析</li>\n" +
                                  "  <li>错题本管理</li>\n" +
                                  "</ul>";
        
        competitionDescription.innerHTML = competitionContent;
        passwordModal.style.display = 'none';
        descriptionModal.style.display = 'block';
    } else {
        // 密码错误，显示提示
        alert('密码错误，请重新输入');
    }
    
    passwordInput.value = '';
}

// 处理学习功能点击
function handleStudyFeatureClick(featureElement) {
    const studyCardId = featureElement.id;
    let content = '';
    
    switch(studyCardId) {
        case 'pomodoro-card':
            content = "<div class='feature-content'>\n" +
                     "  <h3>番茄钟学习法</h3>\n" +
                     "  <p>番茄工作法是一种时间管理方法，由弗朗西斯科·西里洛于1980年代创立。</p>\n" +
                     "  <div class='feature-details'>\n" +
                     "    <h4>基本步骤：</h4>\n" +
                     "    <ol>\n" +
                     "      <li>选择一个待完成的任务</li>\n" +
                     "      <li>设置番茄钟（通常为25分钟）</li>\n" +
                     "      <li>专注工作，直到番茄钟响铃</li>\n" +
                     "      <li>休息5分钟</li>\n" +
                     "      <li>每完成四个番茄钟，休息15-30分钟</li>\n" +
                     "    </ol>\n" +
                     "  </div>\n" +
                     "</div>";
            break;
        case 'ai-study-card':
            content = "<div class='feature-content'>\n" +
                     "  <h3>AI学习助手</h3>\n" +
                     "  <p>需要AI学习助手功能，请访问豆包官网获取更多服务。</p>\n" +
                     "  <button id='go-to-doubao' class='btn-primary'>访问豆包官网</button>\n" +
                     "</div>";
            break;
        case 'calendar-card':
            content = "<div class='feature-content'>\n" +
                     "  <h3>学习日历</h3>\n" +
                     "  <p>学习日历帮助您规划学习时间，记录学习进度。</p>\n" +
                     "  <div class='feature-details'>\n" +
                     "    <h4>功能特点：</h4>\n" +
                     "    <ul>\n" +
                     "      <li>学习计划安排</li>\n" +
                     "      <li>学习目标追踪</li>\n" +
                     "      <li>重要日期提醒</li>\n" +
                     "    </ul>\n" +
                     "  </div>\n" +
                     "</div>";
            break;
        case 'notes-card':
            content = "<div class='feature-content'>\n" +
                     "  <h3>学习笔记</h3>\n" +
                     "  <p>学习笔记功能让您可以随时记录学习中的重要知识点和想法。</p>\n" +
                     "  <div class='feature-details'>\n" +
                     "    <h4>功能特点：</h4>\n" +
                     "    <ul>\n" +
                     "      <li>快速笔记记录</li>\n" +
                     "      <li>笔记分类管理</li>\n" +
                     "      <li>关键词搜索</li>\n" +
                     "    </ul>\n" +
                     "  </div>\n" +
                     "</div>";
            break;
    }
    
    studyContent.innerHTML = content;
    
    // 如果是AI学习卡片，添加跳转到豆包官网的事件监听
    const goToDoubaoBtn = document.getElementById('go-to-doubao');
    if (goToDoubaoBtn) {
        goToDoubaoBtn.addEventListener('click', showAIGuide);
    }
}

// 处理登录
function handleLogin() {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // 简单验证，实际应用中应该发送到服务器验证
    if (phone && password) {
        // 模拟登录成功
        currentUser = { phone };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        
        // 清空表单
        document.getElementById('phone').value = '';
        document.getElementById('password').value = '';
        
        // 登录成功后关闭模态框
        loginModal.style.display = 'none';
    } else {
        alert('请输入手机号和密码');
    }
}

// 处理登出
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
}

// 显示AI引导
function showAIGuide() {
    window.open('https://www.doubao.com', '_blank');
}

// 初始化迷你日历
function initMiniCalendar() {
    const now = new Date();
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const miniCalendar = document.getElementById('mini-calendar');
    
    if (miniCalendar) {
        miniCalendar.innerHTML = `
            <div class="calendar-header">
                <span>${now.getFullYear()}年</span>
                <span>${monthNames[now.getMonth()]}</span>
            </div>
            <div class="calendar-day">${now.getDate()}日</div>
            <div class="calendar-weekday">${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()]}</div>
        `;
    }
}

// 初始化学习统计
function initLearningStats() {
    const learningStats = document.getElementById('learning-stats');
    if (learningStats) {
        learningStats.innerHTML = `
            <p>本周专注时长：0小时</p>
            <p>完成任务数：0个</p>
        `;
    }
    updateFocusStats();
}

// 更新专注统计
function updateFocusStats() {
    const focusStats = document.querySelector('.focus-stats');
    if (focusStats) {
        focusStats.innerHTML = `
            <h3>专注统计</h3>
            <p>今日专注次数：${todayFocusCount}</p>
            <p>今日专注总时长：${todayFocusTotalMinutes}分钟</p>
        `;
    }
}

// 显示更新日志
function showUpdateLog() {
    if (updatesContainer.style.display === 'none' || updatesContainer.style.display === '') {
        updatesContainer.style.display = 'block';
        updatesContainer.innerHTML = `
            <div class="update-log">
                <h3>更新日志</h3>
                <div class="update-item">
                    <h4>版本 7.0.0.1 - China RC</h4>
                    <ul>
                        <li>全新界面设计，体现"深度思考"理念</li>
                        <li>优化登录系统，支持手机号+密码登录</li>
                        <li>重构五大核心模块：首页、学习、专注、抢先体验、我</li>
                        <li>新增参赛描述板块</li>
                        <li>AI功能引导至豆包官网</li>
                        <li>优化夜间模式</li>
                        <li>修复已知bug</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        updatesContainer.style.display = 'none';
    }
}

// 快速专注功能
function startQuickFocus(minutes) {
    // 切换到专注标签页
    showTab('focus');
    
    // 设置时长并开始计时
    focusDurationInput.value = minutes;
    focusTimeSeconds = minutes * 60;
    updateTimerDisplay();
    startTimer();
}

// 返回首页功能
function returnHome() {
    showTab('home');
}

// 加载错题本数据
function loadWrongQuestions() {
    const wrongQuestionsList = document.getElementById('wrong-questions-list');
    const subjectFilter = document.getElementById('wrong-subject-filter').value;
    const difficultyFilter = document.getElementById('wrong-difficulty-filter').value;
    const sortFilter = document.getElementById('wrong-sort-filter').value;
    
    // 从本地存储获取错题数据
    let wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
    
    // 应用筛选
    if (subjectFilter !== 'all') {
        wrongQuestions = wrongQuestions.filter(q => q.subject === subjectFilter);
    }
    
    if (difficultyFilter !== 'all') {
        wrongQuestions = wrongQuestions.filter(q => q.difficulty === difficultyFilter);
    }
    
    // 应用排序
    if (sortFilter === 'date') {
        wrongQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortFilter === 'count') {
        wrongQuestions.sort((a, b) => b.wrongCount - a.wrongCount);
    }
    
    // 渲染错题列表
    if (wrongQuestions.length === 0) {
        wrongQuestionsList.innerHTML = '<div class="no-data">暂无错题记录</div>';
    } else {
        let html = '';
        wrongQuestions.forEach(question => {
            html += `
                <div class="wrong-question-item">
                    <div class="wrong-question-content">${question.question}</div>
                    <div class="wrong-question-meta">
                        <span>科目：${question.subject}</span>
                        <span>难度：${question.difficulty}</span>
                        <span>错误次数：${question.wrongCount}</span>
                        <span>最后错误：${new Date(question.lastWrongAt).toLocaleString()}</span>
                    </div>
                    <div class="wrong-question-actions">
                        <button class="btn-secondary" onclick="generateSimilarQuestion('${question.question}')">生成相似题目</button>
                        <button class="btn-danger" onclick="removeWrongQuestion('${question.id}')">移除</button>
                    </div>
                </div>
            `;
        });
        wrongQuestionsList.innerHTML = html;
    }
}

// 移除错题
function removeWrongQuestion(questionId) {
    if (confirm('确定要移除这道错题吗？')) {
        let wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
        wrongQuestions = wrongQuestions.filter(q => q.id !== questionId);
        localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
        loadWrongQuestions();
    }
}

// 初始化错题本
function initWrongQuestions() {
    // 添加筛选和排序事件监听
    document.getElementById('wrong-subject-filter').addEventListener('change', loadWrongQuestions);
    document.getElementById('wrong-difficulty-filter').addEventListener('change', loadWrongQuestions);
    document.getElementById('wrong-sort-filter').addEventListener('change', loadWrongQuestions);
}

// 初始化番茄钟
function initPomodoro() {
    const pomodoroTimer = document.getElementById('pomodoro-timer');
    const startPomodoroBtn = document.getElementById('start-pomodoro');
    const stopPomodoroBtn = document.getElementById('stop-pomodoro');
    let pomodoroInterval = null;
    let pomodoroSeconds = 25 * 60; // 默认25分钟
    
    // 初始化显示
    updatePomodoroDisplay();
    
    // 开始番茄钟
    startPomodoroBtn.addEventListener('click', () => {
        if (!pomodoroInterval) {
            pomodoroInterval = setInterval(() => {
                pomodoroSeconds--;
                updatePomodoroDisplay();
                
                if (pomodoroSeconds <= 0) {
                    clearInterval(pomodoroInterval);
                    pomodoroInterval = null;
                    alert('番茄钟时间结束！');
                    pomodoroSeconds = 25 * 60;
                    updatePomodoroDisplay();
                }
            }, 1000);
            startPomodoroBtn.disabled = true;
            stopPomodoroBtn.disabled = false;
        }
    });
    
    // 停止番茄钟
    stopPomodoroBtn.addEventListener('click', () => {
        if (pomodoroInterval) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            startPomodoroBtn.disabled = false;
            stopPomodoroBtn.disabled = true;
        }
    });
    
    // 更新番茄钟显示
    function updatePomodoroDisplay() {
        const minutes = Math.floor(pomodoroSeconds / 60);
        const seconds = pomodoroSeconds % 60;
        pomodoroTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// 计算器功能
function appendToDisplay(value) {
    const display = document.getElementById('calculator-display');
    if (display.textContent === '0' && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
}

function clearDisplay() {
    document.getElementById('calculator-display').textContent = '0';
}

function calculate() {
    const display = document.getElementById('calculator-display');
    try {
        // 替换特殊运算符
        let expression = display.textContent.replace('×', '*').replace('÷', '/');
        // 执行计算
        const result = eval(expression);
        // 显示结果
        display.textContent = result;
    } catch (error) {
        display.textContent = '错误';
        setTimeout(clearDisplay, 1000);
    }
}

// 初始化AI对话
function initChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatLoadingIndicator = document.getElementById('chat-loading-indicator');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    
    // 加载聊天历史
    loadChatHistory();
    
    // 发送消息
    sendMessageBtn.addEventListener('click', () => {
        sendMessage();
    });
    
    // 按Enter键发送消息
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 清除聊天记录
    clearChatBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有聊天记录吗？')) {
            localStorage.removeItem('chatHistory');
            chatMessages.innerHTML = '';
        }
    });
    
    // 发送消息函数
    function sendMessage() {
        const message = userMessageInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            
            // 保存消息到历史记录
            saveMessage(message, 'user');
            
            // 清空输入框
            userMessageInput.value = '';
            
            // 显示加载状态
            chatLoadingIndicator.style.display = 'block';
            
            // 获取API密钥
            const apiKey = document.getElementById('chat-api-key').value;
            
            // 模拟AI回复（实际应用中应该调用API）
            setTimeout(() => {
                let aiResponse = "感谢您的提问。由于这是演示版本，我们无法提供实际的AI回复。请在实际应用中配置有效的API密钥以获取真实的AI回复。";
                
                // 如果提供了API密钥，尝试调用实际的API
                if (apiKey) {
                    // 实际的API调用代码
                    // 这里使用模拟数据
                    const responses = [
                        "这是一个很好的问题！让我来为您详细解答。",
                        "根据您的问题，我认为可以从以下几个方面来考虑。",
                        "您提出的问题很有深度，我需要思考一下。",
                        "感谢您的提问，我会尽力为您提供准确的信息。"
                    ];
                    aiResponse = responses[Math.floor(Math.random() * responses.length)];
                }
                
                // 添加AI回复
                addMessage(aiResponse, 'bot');
                
                // 保存AI回复到历史记录
                saveMessage(aiResponse, 'bot');
                
                // 隐藏加载状态
                chatLoadingIndicator.style.display = 'none';
                
                // 滚动到最新消息
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
            
            // 滚动到最新消息
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

// 加载聊天历史
function loadChatHistory() {
    const chatMessages = document.getElementById('chat-messages');
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    chatMessages.innerHTML = '';
    
    chatHistory.forEach(message => {
        addMessage(message.content, message.role, false);
    });
    
    // 滚动到最新消息
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 保存消息到历史记录
function saveMessage(content, role) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    chatHistory.push({
        content,
        role,
        timestamp: new Date().toISOString()
    });
    
    // 限制历史记录长度（最多保存100条消息）
    if (chatHistory.length > 100) {
        chatHistory = chatHistory.slice(chatHistory.length - 100);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 添加消息到聊天界面
function addMessage(content, role, save = true) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = role === 'user' ? 'user-message' : 'bot-message';
    messageElement.innerHTML = `<div class="message-content">${content}</div>`;
    
    chatMessages.appendChild(messageElement);
    
    // 滚动到最新消息
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (save) {
        saveMessage(content, role);
    }
}

// 初始化实验分析
function initExperimentAnalysis() {
    const experimentForm = document.getElementById('experiment-form');
    const experimentResult = document.getElementById('experiment-result');
    const experimentLoadingIndicator = document.getElementById('experiment-loading-indicator');
    
    experimentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 显示加载状态
        experimentLoadingIndicator.style.display = 'block';
        
        // 获取表单数据
        const topic = document.getElementById('experiment-topic').value;
        const purpose = document.getElementById('experiment-purpose').value;
        const method = document.getElementById('experiment-method').value;
        const data = document.getElementById('experiment-data').value;
        const variables = document.getElementById('experiment-variables').value;
        
        // 获取API密钥
        const apiKey = document.getElementById('experiment-api-key').value;
        
        // 构建提示词
        const prompt = `
            请分析以下实验数据并生成一份详细的实验分析报告：
            
            实验主题：${topic}
            实验目的：${purpose}
            实验方法：${method}
            实验数据：${data}
            变量说明：${variables}
            
            请生成包括以下内容的分析报告：
            1. 数据处理与分析
            2. 结果解释
            3. 结论
            4. 建议与改进方向
        `;
        
        // 模拟分析结果（实际应用中应该调用API）
        setTimeout(() => {
            let analysisResult = "感谢您提交的实验数据。由于这是演示版本，我们无法提供实际的实验分析。请在实际应用中配置有效的API密钥以获取真实的实验分析结果。";
            
            // 如果提供了API密钥，尝试调用实际的API
            if (apiKey) {
                // 实际的API调用代码
                // 这里使用模拟数据
                analysisResult = `实验分析报告\n\n1. 数据处理与分析\n根据您提供的数据，我们进行了初步的统计分析...\n\n2. 结果解释\n从分析结果来看，我们可以得出以下结论...\n\n3. 结论\n综合以上分析，本次实验验证了我们的假设...\n\n4. 建议与改进方向\n为了进一步完善实验，建议在以下几个方面进行改进...`;
            }
            
            // 显示分析结果
            experimentResult.textContent = analysisResult;
            
            // 隐藏加载状态
            experimentLoadingIndicator.style.display = 'none';
        }, 1500);
    });
}

// 初始化智能出题系统
function initQuestionGeneration() {
    const generateBtn = document.getElementById('generate-btn');
    const generatedQuestions = document.getElementById('generated-questions');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    generateBtn.addEventListener('click', () => {
        // 显示加载状态
        loadingIndicator.style.display = 'block';
        generatedQuestions.innerHTML = '';
        
        // 获取表单数据
        const apiKey = document.getElementById('api-key').value;
        const subject = document.getElementById('subject').value;
        const difficulty = document.getElementById('difficulty').value;
        const questionType = document.getElementById('question-type').value;
        const questionCount = document.getElementById('question-count').value;
        const additionalRequirements = document.getElementById('additional-requirements').value;
        
        // 构建提示词
        const prompt = `
            请为${subject}科目生成${questionCount}道${difficulty}难度的${questionType}题目。
            ${additionalRequirements ? '附加要求：' + additionalRequirements : ''}
            
            请按照以下格式返回题目：
            1. 题目内容
            答案：正确答案
            解析：解题思路和知识点说明
        `;
        
        // 模拟生成题目（实际应用中应该调用API）
        setTimeout(() => {
            let questionsHtml = '';
            
            // 如果提供了API密钥，尝试调用实际的API
            if (apiKey) {
                // 实际的API调用代码
                // 这里使用模拟数据
                for (let i = 0; i < parseInt(questionCount); i++) {
                    questionsHtml += `
                        <div class="generated-question">
                            <h4>${i + 1}. ${subject}${questionType}（${difficulty}）</h4>
                            <p>这是一道${difficulty}难度的${subject}${questionType}。请仔细思考后回答。</p>
                            <div class="question-actions">
                                <button class="mark-wrong-btn" onclick="markAsWrong(this, '${subject}', '${difficulty}')">标记为错题</button>
                            </div>
                        </div>
                    `;
                }
            } else {
                questionsHtml = '<div class="no-data">请输入有效的API密钥以生成题目</div>';
            }
            
            // 显示生成的题目
            generatedQuestions.innerHTML = questionsHtml;
            
            // 隐藏加载状态
            loadingIndicator.style.display = 'none';
        }, 1500);
    });
}

// 标记题目为错题
function markAsWrong(button, subject, difficulty) {
    const questionElement = button.closest('.generated-question');
    const questionText = questionElement.querySelector('p').textContent;
    
    // 获取现有的错题数据
    let wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions')) || [];
    
    // 检查是否已经存在该错题
    const existingQuestion = wrongQuestions.find(q => q.question === questionText);
    
    if (existingQuestion) {
        // 如果已经存在，增加错误次数
        existingQuestion.wrongCount++;
        existingQuestion.lastWrongAt = new Date().toISOString();
    } else {
        // 如果不存在，添加新的错题
        wrongQuestions.push({
            id: Date.now().toString(),
            question: questionText,
            subject: subject,
            difficulty: difficulty,
            wrongCount: 1,
            createdAt: new Date().toISOString(),
            lastWrongAt: new Date().toISOString()
        });
    }
    
    // 保存更新后的错题数据
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
    
    // 显示成功提示
    alert('已成功添加到错题本！');
    
    // 禁用标记按钮
    button.disabled = true;
    button.textContent = '已标记';
}

// 生成相似题目
function generateSimilarQuestion(originalQuestion) {
    alert('生成相似题目功能正在开发中...');
    // 实际应用中应该调用API生成相似题目
}

// 流式输出功能
function streamOutput(element, text) {
    let index = 0;
    element.textContent = '';
    
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20); // 每20毫秒显示一个字符
}

// 添加事件监听器
function addEventListeners() {
    // 新功能入口点击事件
    document.getElementById('smart-question-system').addEventListener('click', () => {
        showTab('smart-question-system-content');
    });
    
    document.getElementById('wrong-questions').addEventListener('click', () => {
        showTab('wrong-questions-content');
        loadWrongQuestions(); // 加载错题本数据
    });
    
    document.getElementById('pomodoro').addEventListener('click', () => {
        showTab('pomodoro-content');
    });
    
    document.getElementById('calculator').addEventListener('click', () => {
        showTab('calculator-content');
    });
    
    document.getElementById('ai-chat').addEventListener('click', () => {
        showTab('ai-chat-content');
        loadChatHistory(); // 加载聊天记录
    });
    
    document.getElementById('experiment-analysis').addEventListener('click', () => {
        showTab('experiment-analysis-content');
    });
    
    // 登录/注册相关
    loginTrigger.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    closeLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    loginBtn.addEventListener('click', handleLogin);
    
    logoutBtn.addEventListener('click', handleLogout);
    
    // 参赛描述相关
    competitionDescBtn.addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });
    
    closePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });
    
    verifyPasswordBtn.addEventListener('click', verifyCompetitionPassword);
    
    closeDescriptionBtn.addEventListener('click', () => {
        descriptionModal.style.display = 'none';
    });
    
    // 主题切换
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // 标签页切换
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // 计时器控制
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    focusDurationInput.addEventListener('change', () => {
        if (!timerRunning) {
            const minutes = parseInt(focusDurationInput.value) || 25;
            focusTimeSeconds = minutes * 60;
            updateTimerDisplay();
        }
    });
    
    // 学习功能点击
    studyFeatures.forEach(feature => {
        feature.addEventListener('click', () => {
            handleStudyFeatureClick(feature);
        });
    });
    
    // 快速专注按钮
    quickFocusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.getAttribute('data-time'));
            startQuickFocus(minutes);
        });
    });
    
    // 查看更新日志
    viewUpdatesBtn.addEventListener('click', showUpdateLog);
    
    // 返回首页按钮
    returnHomeBtn.addEventListener('click', returnHome);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
        if (event.target === descriptionModal) {
            descriptionModal.style.display = 'none';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);