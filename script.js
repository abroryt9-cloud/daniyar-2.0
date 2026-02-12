// ============================================
// 🚀 DANIYAR 2.0 — ТРЕКЕР $7,000,000 К 23 ГОДАМ
// ============================================

// ============= ДАННЫЕ ПОЛЬЗОВАТЕЛЯ =============
const USER = {
    name: 'Daniyar',
    currentAge: 15,
    goalAge: 23,
    goalWealth: 7000000,
    birthDate: new Date(2026, 1, 12) // 12 февраля 2026
};

// ============= СОСТОЯНИЕ =============
let state = {
    currentWealth: 0,
    streak: 0,
    lastActiveDate: null,
    tasks: {},
    wealthHistory: []
};

// ============= ЗАГРУЗКА ДАННЫХ =============
function loadData() {
    const saved = localStorage.getItem('daniyar2_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            resetState();
        }
    } else {
        resetState();
    }
    
    // Проверяем новый день
    checkNewDay();
    updateAllUI();
}

function resetState() {
    state = {
        currentWealth: 0,
        streak: 0,
        lastActiveDate: new Date().toLocaleDateString(),
        tasks: getDefaultTasks(),
        wealthHistory: []
    };
    saveData();
}

// ============= ДЕФОЛТНЫЕ ЗАДАЧИ =============
function getDefaultTasks() {
    return {
        prayer: [
            { id: 'fajr', name: 'Фаджр', completed: false, icon: '🌅' },
            { id: 'dhuhr', name: 'Зухр', completed: false, icon: '☀️' },
            { id: 'asr', name: 'Аср', completed: false, icon: '🕋' },
            { id: 'maghrib', name: 'Магриб', completed: false, icon: '🌇' },
            { id: 'isha', name: 'Иша', completed: false, icon: '🌙' }
        ],
        trading: [
            { id: 'learn1', name: '📖 30 мин обучения', completed: false },
            { id: 'chart1', name: '📊 Анализ рынка', completed: false },
            { id: 'trade1', name: '💹 Практика', completed: false }
        ],
        brand: [
            { id: 'social1', name: '📱 Пост в соцсети', completed: false },
            { id: 'content1', name: '🎨 Создать контент', completed: false },
            { id: 'analytics1', name: '📈 Аналитика', completed: false }
        ],
        fitness: [
            { id: 'workout1', name: '🏋️ Тренировка', completed: false },
            { id: 'stretch1', name: '🧘 Разминка', completed: false }
        ]
    };
}

// ============= ПРОВЕРКА НОВОГО ДНЯ =============
function checkNewDay() {
    const today = new Date().toLocaleDateString();
    
    if (state.lastActiveDate !== today) {
        // Сохраняем в историю
        state.wealthHistory.push({
            date: state.lastActiveDate || today,
            wealth: state.currentWealth
        });
        
        // Оставляем только последние 30 дней
        if (state.wealthHistory.length > 30) {
            state.wealthHistory = state.wealthHistory.slice(-30);
        }
        
        // Обновляем стрик
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();
        
        if (state.lastActiveDate === yesterdayStr) {
            state.streak++;
        } else if (state.lastActiveDate && state.lastActiveDate !== today) {
            state.streak = 0;
        }
        
        state.lastActiveDate = today;
        
        // Сбрасываем задачи (кроме намазов - они по времени)
        if (state.tasks) {
            Object.keys(state.tasks).forEach(category => {
                if (category !== 'prayer') {
                    state.tasks[category].forEach(task => {
                        task.completed = false;
                    });
                }
            });
        }
        
        saveData();
    }
}

// ============= СОХРАНЕНИЕ =============
function saveData() {
    localStorage.setItem('daniyar2_state', JSON.stringify(state));
}

// ============= ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА =============
function updateAllUI() {
    updateWealthDisplay();
    updateStats();
    updatePrayerGrid();
    updateCollegeSchedule();
    updateTradingDashboard();
    updateBrandDashboard();
    updateFitnessGrid();
    updateMilestones();
    updateCountdowns();
}

// ============= СОСТОЯНИЕ: ОБНОВЛЕНИЕ =============
function updateWealthDisplay() {
    const wealthEl = document.getElementById('currentWealth');
    const progressFill = document.getElementById('wealthProgressFill');
    const percentEl = document.getElementById('wealthPercent');
    const remainingEl = document.getElementById('remainingWealth');
    
    // Форматируем число
    const formattedWealth = formatMoney(state.currentWealth);
    wealthEl.textContent = `$${formattedWealth}`;
    
    // Прогресс
    const percent = (state.currentWealth / USER.goalWealth) * 100;
    const cappedPercent = Math.min(percent, 100);
    progressFill.style.width = `${cappedPercent}%`;
    percentEl.textContent = cappedPercent.toFixed(2);
    
    // Осталось
    const remaining = USER.goalWealth - state.currentWealth;
    remainingEl.textContent = formatMoney(Math.max(remaining, 0));
}

// ============= ФОРМАТИРОВАНИЕ ДЕНЕГ =============
function formatMoney(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toString();
}

// ============= ДОБАВЛЕНИЕ ДОХОДА =============
function addIncome(amount, type) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return;
    
    if (type === 'add') {
        state.currentWealth += amount;
    } else {
        state.currentWealth = Math.max(0, state.currentWealth - amount);
    }
    
    saveData();
    updateWealthDisplay();
    
    // Анимация
    animateWealthChange();
}

// ============= АНИМАЦИЯ ИЗМЕНЕНИЯ СОСТОЯНИЯ =============
function animateWealthChange() {
    const wealthEl = document.getElementById('currentWealth');
    wealthEl.style.transform = 'scale(1.2)';
    wealthEl.style.color = '#fbbf24';
    
    setTimeout(() => {
        wealthEl.style.transform = 'scale(1)';
        wealthEl.style.color = '';
    }, 300);
}

// ============= СТАТИСТИКА =============
function updateStats() {
    document.getElementById('streakCount').textContent = state.streak;
    
    // Подсчёт выполненных задач сегодня
    let completed = 0;
    let total = 0;
    
    if (state.tasks) {
        Object.values(state.tasks).forEach(category => {
            category.forEach(task => {
                total++;
                if (task.completed) completed++;
            });
        });
    }
    
    document.getElementById('todayCompleted').textContent = completed;
    document.getElementById('todayTotal').textContent = total;
    
    // Дни до 23 лет
    const today = new Date();
    const goalDate = new Date(USER.birthDate);
    goalDate.setFullYear(USER.birthDate.getFullYear() + (USER.goalAge - USER.currentAge));
    
    const daysLeft = Math.ceil((goalDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById('daysUntil23').textContent = Math.max(0, daysLeft);
}

// ============= МАЙЛСТОУНЫ =============
function updateMilestones() {
    const milestones = [
        { amount: 100000, label: '100K', icon: '🌱' },
        { amount: 500000, label: '500K', icon: '🌿' },
        { amount: 1000000, label: '1M', icon: '🚀' },
        { amount: 2000000, label: '2M', icon: '💎' },
        { amount: 3000000, label: '3M', icon: '👑' },
        { amount: 5000000, label: '5M', icon: '🦅' },
        { amount: 7000000, label: '7M', icon: '🏆' }
    ];
    
    const grid = document.getElementById('milestonesGrid');
    if (!grid) return;
    
    grid.innerHTML = milestones.map(m => {
        const achieved = state.currentWealth >= m.amount;
        return `
            <div class="milestone-card ${achieved ? 'achieved' : ''}">
                <div class="milestone-icon">${m.icon}</div>
                <div class="milestone-amount">${m.label}</div>
                <div class="milestone-status">${achieved ? '✅' : '🎯'}</div>
            </div>
        `;
    }).join('');
}

// ============= НАМАЗЫ =============
function updatePrayerGrid() {
    const grid = document.getElementById('prayerGrid');
    if (!grid) return;
    
    const prayers = state.tasks.prayer || getDefaultTasks().prayer;
    
    grid.innerHTML = prayers.map(prayer => `
        <div class="prayer-card ${prayer.completed ? 'completed' : ''}" onclick="toggleTask('prayer', '${prayer.id}')">
            <div class="prayer-icon">${prayer.icon}</div>
            <div class="prayer-name">${prayer.name}</div>
            <div class="prayer-check">${prayer.completed ? '✓' : ''}</div>
        </div>
    `).join('');
}

// ============= ПЕРЕКЛЮЧЕНИЕ ЗАДАЧ =============
window.toggleTask = function(category, taskId) {
    if (!state.tasks[category]) return;
    
    const task = state.tasks[category].find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        updateAllUI();
    }
};

// ============= ТРЕЙДИНГ ДАШБОРД =============
function updateTradingDashboard() {
    const dashboard = document.getElementById('tradingDashboard');
    if (!dashboard) return;
    
    const tradingTasks = state.tasks.trading || getDefaultTasks().trading;
    
    // Определяем уровень
    let level = 'Junior';
    let progress = 0;
    
    const completedTrades = tradingTasks.filter(t => t.completed).length;
    const totalTrades = tradingTasks.length;
    
    if (completedTrades > 0) {
        progress = (completedTrades / totalTrades) * 100;
        if (state.streak > 10) level = 'Senior';
        else if (state.streak > 5) level = 'Middle';
        else if (state.streak > 2) level = 'Junior+';
    }
    
    document.getElementById('tradingLevel').innerHTML = `📊 ${level}`;
    
    dashboard.innerHTML = `
        <div class="trading-level-card">
            <div class="level-title">УРОВЕНЬ</div>
            <div class="level-value">${level}</div>
            <div class="level-progress">
                <div class="level-bar" style="width: ${progress}%"></div>
            </div>
        </div>
        <div class="trading-tasks">
            ${tradingTasks.map(task => `
                <div class="trading-task ${task.completed ? 'done' : ''}" onclick="toggleTask('trading', '${task.id}')">
                    <span class="task-check">${task.completed ? '✅' : '⬜'}</span>
                    <span class="task-name">${task.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// ============= БРЕНД ДАШБОРД =============
function updateBrandDashboard() {
    const dashboard = document.getElementById('brandDashboard');
    if (!dashboard) return;
    
    const brandTasks = state.tasks.brand || getDefaultTasks().brand;
    const completed = brandTasks.filter(t => t.completed).length;
    const total = brandTasks.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    document.getElementById('brandGrowth').textContent = `+${Math.round(percent)}%`;
    
    dashboard.innerHTML = `
        <div class="brand-growth-circle">
            <div class="circle-progress" style="--percent: ${percent}">
                <span>${Math.round(percent)}%</span>
            </div>
        </div>
        <div class="brand-tasks">
            ${brandTasks.map(task => `
                <div class="brand-task ${task.completed ? 'done' : ''}" onclick="toggleTask('brand', '${task.id}')">
                    <span class="task-check">${task.completed ? '✅' : '⬜'}</span>
                    <span class="task-name">${task.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// ============= ФИТНЕС =============
function updateFitnessGrid() {
    const grid = document.getElementById('fitnessGrid');
    if (!grid) return;
    
    const fitnessTasks = state.tasks.fitness || getDefaultTasks().fitness;
    const completed = fitnessTasks.filter(t => t.completed).length;
    
    document.getElementById('fitnessStreak').innerHTML = `🔥 ${state.streak}`;
    
    grid.innerHTML = fitnessTasks.map(task => `
        <div class="fitness-card ${task.completed ? 'done' : ''}" onclick="toggleTask('fitness', '${task.id}')">
            <div class="fitness-icon">${task.completed ? '✅' : '⏳'}</div>
            <div class="fitness-name">${task.name}</div>
        </div>
    `).join('');
}

// ============= РАСПИСАНИЕ КОЛЛЕДЖА =============
function updateCollegeSchedule() {
    const schedule = document.getElementById('collegeSchedule');
    if (!schedule) return;
    
    // Твоё расписание из скриншота
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const scheduleData = {
        'ПН': ['Разговоры о...', 'Об и защита...', 'Об и защита...', 'Иностранный...', 'Иностранный...', 'Литература', 'Литература', 'Литература'],
        'ВТ': ['Физика', 'Физика', 'Русский язык', 'Русский язык', 'История', 'Введение в с...', 'Введение в с...', 'Физ-ра'],
        'СР': ['Информатика', 'Информатика', 'Химия', 'Химия', 'Химия', 'История', 'История', 'Обществознание'],
        'ЧТ': ['Физика', 'Физика', 'Литература', 'Литература', 'Литература', 'Химия', 'Химия', 'Физ-ра'],
        'ПТ': ['МДК 01.01', 'МДК 01.01', 'Физика', 'Физика', 'Физика', 'История', 'История', 'Обществознание'],
        'СБ': ['Информатика', 'Информатика', 'Информатика', 'Информатика', 'Информатика', 'История', 'История', 'Физ-ра']
    };
    
    schedule.innerHTML = `
        <div class="schedule-header">
            ${days.map(day => `<div class="schedule-day">${day}</div>`).join('')}
        </div>
        <div class="schedule-body">
            ${[0,1,2,3,4,5,6,7].map(row => `
                <div class="schedule-row">
                    ${days.map(day => `
                        <div class="schedule-cell">
                            ${scheduleData[day]?.[row] || '—'}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

// ============= ОБНОВЛЕНИЕ СЧЁТЧИКОВ =============
function updateCountdowns() {
    // Рамадан
    const today = new Date();
    const ramadanStart = new Date(2026, 1, 18);
    const daysUntilRamadan = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));
    
    document.getElementById('ramadanCountdown').innerHTML = 
        daysUntilRamadan > 0 ? `🌙 До Рамадана: ${daysUntilRamadan}д` : '🌙 Рамадан идёт';
    
    // До 23 лет
    const goalDate = new Date(USER.birthDate);
    goalDate.setFullYear(USER.birthDate.getFullYear() + 8);
    const yearsLeft = 23 - USER.currentAge;
    document.getElementById('yearsUntilGoal').textContent = yearsLeft;
}

// ============= ЗАВЕРШЕНИЕ ДНЯ =============
function completeDay() {
    const today = new Date().toLocaleDateString();
    
    // Проверяем, все ли задачи выполнены
    let allCompleted = true;
    if (state.tasks) {
        Object.values(state.tasks).forEach(category => {
            category.forEach(task => {
                if (!task.completed) allCompleted = false;
            });
        });
    }
    
    if (allCompleted) {
        state.streak++;
        showNotification('🚀 ИДЕАЛЬНЫЙ ДЕНЬ! +1 к стрику!', 'success');
    }
    
    state.lastActiveDate = today;
    saveData();
    
    // Сброс задач (кроме намазов)
    if (state.tasks) {
        Object.keys(state.tasks).forEach(category => {
            if (category !== 'prayer') {
                state.tasks[category].forEach(task => {
                    task.completed = false;
                });
            }
        });
    }
    
    saveData();
    updateAllUI();
    showNotification('✅ День завершён! Завтра новые победы!', 'info');
}

// ============= УВЕДОМЛЕНИЯ =============
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        border: 1px solid #fbbf24;
        box-shadow: 0 0 30px rgba(251,191,36,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============= ИНИЦИАЛИЗАЦИЯ =============
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Кнопка добавления дохода
    document.getElementById('addIncomeBtn')?.addEventListener('click', () => {
        const amount = document.getElementById('incomeInput').value;
        const type = document.getElementById('incomeType').value;
        addIncome(amount, type);
    });
    
    // Кнопка редактирования состояния
    document.getElementById('editWealthBtn')?.addEventListener('click', () => {
        document.getElementById('wealthModal').style.display = 'flex';
        document.getElementById('editWealthInput').value = state.currentWealth;
    });
    
    // Сохранение состояния
    document.getElementById('saveWealthBtn')?.addEventListener('click', () => {
        const newWealth = parseFloat(document.getElementById('editWealthInput').value);
        if (!isNaN(newWealth) && newWealth >= 0) {
            state.currentWealth = newWealth;
            saveData();
            updateWealthDisplay();
            document.getElementById('wealthModal').style.display = 'none';
        }
    });
    
    // Кнопка завершения дня
    document.getElementById('completeDayBtn')?.addEventListener('click', completeDay);
    
    // Закрытие модалки
    document.querySelector('.close')?.addEventListener('click', () => {
        document.getElementById('wealthModal').style.display = 'none';
    });
    
    // Навигация по планетам
    document.querySelectorAll('.nav-planet').forEach(planet => {
        planet.addEventListener('click', function() {
            const section = this.dataset.section;
            const targetSection = document.querySelector(`.${section}-section`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ============= АВТОСОХРАНЕНИЕ =============
setInterval(() => {
    saveData();
}, 30000);
