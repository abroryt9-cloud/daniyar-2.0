// ============================================
// DANIYAR 2.0 — ДНЕВНОЙ ТРЕКЕР
// ============================================

class DailyTracker {
    constructor() {
        this.state = {
            date: new Date().toISOString().split('T')[0],
            streak: 0,
            tasks: [],
            mood: null,
            history: [],
            lastActiveDate: null
        };
        
        this.TASKS = [
            { id: 1, time: '04:30', title: 'Пробуждение', category: 'morning', icon: '🌅' },
            { id: 2, time: '04:40', title: 'Фаджр', category: 'prayer', icon: '🕌' },
            { id: 3, time: '05:00', title: 'Коран / Азкары', category: 'prayer', icon: '📖' },
            { id: 4, time: '05:30', title: 'Утренняя разминка', category: 'fitness', icon: '🏋️' },
            { id: 5, time: '06:00', title: 'Трейдинг — Обучение', category: 'trading', icon: '📊' },
            { id: 6, time: '07:00', title: 'Завтрак', category: 'health', icon: '🥗' },
            { id: 7, time: '08:00', title: 'Колледж / Учёба', category: 'study', icon: '📚' },
            { id: 8, time: '12:00', title: 'Зухр', category: 'prayer', icon: '🕌' },
            { id: 9, time: '13:00', title: 'Обед', category: 'health', icon: '🍚' },
            { id: 10, time: '15:00', title: 'Аср', category: 'prayer', icon: '🕌' },
            { id: 11, time: '16:00', title: 'Бренд / Соцсети', category: 'brand', icon: '💼' },
            { id: 12, time: '17:00', title: 'Трейдинг — Практика', category: 'trading', icon: '📈' },
            { id: 13, time: '18:00', title: 'Магриб', category: 'prayer', icon: '🕌' },
            { id: 14, time: '18:15', title: 'Ужин', category: 'health', icon: '🥘' },
            { id: 15, time: '19:00', title: 'Тренировка', category: 'fitness', icon: '💪' },
            { id: 16, time: '20:00', title: 'Иша', category: 'prayer', icon: '🕌' },
            { id: 17, time: '20:30', title: 'Развитие / Книги', category: 'self', icon: '📚' },
            { id: 18, time: '21:30', title: 'Планирование', category: 'productivity', icon: '📝' },
            { id: 19, time: '22:00', title: 'Анализ дня', category: 'productivity', icon: '📊' },
            { id: 20, time: '22:30', title: 'Подготовка ко сну', category: 'health', icon: '😴' }
        ];
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.checkNewDay();
        this.renderTimeline();
        this.updateMetrics();
        this.renderMoodHistory();
        this.updateDateTime();
        this.setupEventListeners();
        
        // Обновление времени
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    // ============= ЗАГРУЗКА / СОХРАНЕНИЕ =============
    loadData() {
        const saved = localStorage.getItem('daniyar2_daily');
        if (saved) {
            try {
                this.state = JSON.parse(saved);
            } catch (e) {
                this.resetDay();
            }
        } else {
            this.resetDay();
        }
    }
    
    saveData() {
        localStorage.setItem('daniyar2_daily', JSON.stringify(this.state));
    }
    
    resetDay() {
        this.state = {
            date: new Date().toISOString().split('T')[0],
            streak: this.state?.streak || 0,
            tasks: this.TASKS.map(task => ({ ...task, completed: false })),
            mood: null,
            history: this.state?.history || [],
            lastActiveDate: this.state?.lastActiveDate
        };
        this.saveData();
    }
    
    // ============= ПРОВЕРКА НОВОГО ДНЯ =============
    checkNewDay() {
        const today = new Date().toISOString().split('T')[0];
        
        if (this.state.date !== today) {
            // Сохраняем вчерашний день в историю
            if (this.state.tasks.length > 0) {
                const completed = this.state.tasks.filter(t => t.completed).length;
                const total = this.state.tasks.length;
                const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                this.state.history.push({
                    date: this.state.date,
                    productivity,
                    mood: this.state.mood,
                    completed,
                    total
                });
                
                // Оставляем только последние 30 дней
                if (this.state.history.length > 30) {
                    this.state.history = this.state.history.slice(-30);
                }
            }
            
            // Обновляем стрик
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (this.state.lastActiveDate === yesterday) {
                this.state.streak++;
            } else {
                this.state.streak = 0;
            }
            
            // Новый день
            this.state.date = today;
            this.state.lastActiveDate = today;
            this.resetDay();
        }
    }
    
    // ============= РЕНДЕР РАСПИСАНИЯ =============
    renderTimeline() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        timeline.innerHTML = this.state.tasks.map(task => `
            <div class="timeline-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="timeline-time">${task.time}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${task.icon} ${task.title}</div>
                    <div class="timeline-category">${this.getCategoryName(task.category)}</div>
                </div>
                <div class="timeline-check" onclick="tracker.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
            </div>
        `).join('');
    }
    
    getCategoryName(category) {
        const categories = {
            'morning': 'Утро',
            'prayer': 'Намаз',
            'fitness': 'Спорт',
            'trading': 'Трейдинг',
            'health': 'Здоровье',
            'study': 'Учёба',
            'brand': 'Бренд',
            'self': 'Развитие',
            'productivity': 'Продуктивность'
        };
        return categories[category] || category;
    }
    
    // ============= ПЕРЕКЛЮЧЕНИЕ ЗАДАЧ =============
    toggleTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderTimeline();
            this.updateMetrics();
            this.updateAnalytics();
        }
    }
    
    // ============= ОБНОВЛЕНИЕ МЕТРИК =============
    updateMetrics() {
        const completed = this.state.tasks.filter(t => t.completed).length;
        const total = this.state.tasks.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        document.getElementById('productivityPercent').textContent = `${percent}%`;
        document.getElementById('productivityFill').style.width = `${percent}%`;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalCount').textContent = total;
        document.getElementById('streakCount').textContent = this.state.streak;
        
        // Настроение
        if (this.state.mood) {
            const moodEmoji = this.getMoodEmoji(this.state.mood);
            document.getElementById('currentMood').innerHTML = `<span class="mood-emoji">${moodEmoji}</span>`;
        }
    }
    
    // ============= НАСТРОЕНИЕ =============
    setMood(value) {
        this.state.mood = parseInt(value);
        this.saveData();
        this.updateMetrics();
        document.getElementById('moodModal').style.display = 'none';
    }
    
    getMoodEmoji(value) {
        const moods = {
            5: '🔥',
            4: '😊',
            3: '😐',
            2: '😔',
            1: '😫'
        };
        return moods[value] || '—';
    }
    
    // ============= ИСТОРИЯ НАСТРОЕНИЙ =============
    renderMoodHistory() {
        const container = document.getElementById('moodHistory');
        if (!container) return;
        
        const last7Days = this.state.history.slice(-7).reverse();
        
        container.innerHTML = last7Days.map(day => `
            <div class="mood-day">
                <span class="mood-day-date">${this.formatDateShort(day.date)}</span>
                <span class="mood-day-emoji">${day.mood ? this.getMoodEmoji(day.mood) : '—'}</span>
                <span class="mood-day-productivity">${day.productivity || 0}%</span>
            </div>
        `).join('');
        
        // Если нет истории
        if (last7Days.length === 0) {
            container.innerHTML = '<div class="no-data">Нет данных за последние 7 дней</div>';
        }
    }
    
    // ============= АНАЛИТИКА =============
    updateAnalytics() {
        this.renderWeeklyChart();
        this.renderCategoriesStats();
        this.renderDailySummary();
    }
    
    renderWeeklyChart() {
        const chart = document.getElementById('weeklyChart');
        if (!chart) return;
        
        const last7Days = this.state.history.slice(-7);
        const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        
        chart.innerHTML = `
            <div class="chart-bars">
                ${last7Days.map((day, i) => `
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="height: ${day.productivity || 0}%">
                            <span class="chart-value">${day.productivity || 0}%</span>
                        </div>
                        <span class="chart-label">${days[i] || ''}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderCategoriesStats() {
        const container = document.getElementById('categoriesStats');
        if (!container) return;
        
        const categories = {};
        this.state.tasks.forEach(task => {
            if (!categories[task.category]) {
                categories[task.category] = { total: 0, completed: 0 };
            }
            categories[task.category].total++;
            if (task.completed) {
                categories[task.category].completed++;
            }
        });
        
        container.innerHTML = Object.entries(categories).map(([key, value]) => `
            <div class="category-stat">
                <div class="category-header">
                    <span class="category-name">${this.getCategoryName(key)}</span>
                    <span class="category-percent">${Math.round((value.completed / value.total) * 100)}%</span>
                </div>
                <div class="category-bar">
                    <div class="category-fill" style="width: ${(value.completed / value.total) * 100}%"></div>
                </div>
                <div class="category-count">${value.completed}/${value.total}</div>
            </div>
        `).join('');
    }
    
    renderDailySummary() {
        const completed = this.state.tasks.filter(t => t.completed).length;
        const total = this.state.tasks.length;
        const missed = total - completed;
        
        document.getElementById('missedCount').textContent = missed;
        
        // Самый продуктивный временной промежуток
        const morning = this.state.tasks.filter(t => t.time < '12:00' && t.completed).length;
        const afternoon = this.state.tasks.filter(t => t.time >= '12:00' && t.time < '18:00' && t.completed).length;
        const evening = this.state.tasks.filter(t => t.time >= '18:00' && t.completed).length;
        
        let bestTime = 'Утро';
        if (afternoon >= morning && afternoon >= evening) bestTime = 'День';
        if (evening >= morning && evening >= afternoon) bestTime = 'Вечер';
        
        document.getElementById('bestTimeRange').textContent = bestTime;
    }
    
    // ============= ДАТА И ВРЕМЯ =============
    updateDateTime() {
        const now = new Date();
        
        // Дата
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('ru-RU', options);
        
        // Время
        const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('currentTime').textContent = time;
    }
    
    formatDateShort(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
    }
    
    // ============= СОБЫТИЯ =============
    setupEventListeners() {
        // Модалка настроения
        document.getElementById('openMoodBtn')?.addEventListener('click', () => {
            document.getElementById('moodModal').style.display = 'flex';
        });
        
        // Закрытие модалки
        document.querySelector('.close')?.addEventListener('click', () => {
            document.getElementById('moodModal').style.display = 'none';
        });
        
        // Выбор настроения
        document.querySelectorAll('.mood-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mood = e.currentTarget.dataset.mood;
                this.setMood(mood);
            });
        });
        
        // Закрытие по клику вне модалки
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('moodModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// ============= ЗАПУСК =============
const tracker = new DailyTracker();
window.tracker = tracker;
