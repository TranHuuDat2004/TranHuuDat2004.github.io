// ======================================================
// --- 0. KHỞI TẠO GLOBAL FUNCTION CHO ANIMATION ---
// ======================================================
// Đặt hàm này ở ngoài cùng để load-components.js có thể gọi lại
window.initScrollAnimations = function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Tùy chọn: Nếu muốn animation chạy 1 lần rồi thôi thì bỏ comment dòng dưới
                // observer.unobserve(entry.target); 
            } else {
                // Nếu muốn cuộn lên cuộn xuống đều chạy lại animation thì giữ dòng này
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
    
    // Log để kiểm tra (có thể xóa sau này)
    // console.log(`Animation initialized for ${elements.length} elements.`);
};

// ======================================================
// --- MAIN LOGIC ---
// ======================================================
document.addEventListener('DOMContentLoaded', () => {

    // Gọi hàm animation ngay lập tức cho các phần tử có sẵn (VD: Hero Section)
    window.initScrollAnimations();

    // ======================================================
    // --- 1. LOGIC CHUNG & HEADER/PROGRESS BAR ---
    // ======================================================
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    // Cập nhật năm hiện tại (nếu load-components chưa xử lý footer)
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Theo dõi sự kiện cuộn trang
    window.addEventListener('scroll', () => {
        // Hiển thị header khi cuộn xuống
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        }

        // Cập nhật thanh tiến trình
        if (progressBar) {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
    });

    // ======================================================
    // --- 2. LOGIC ANIMATION (ĐÃ CHUYỂN LÊN ĐẦU FILE) ---
    // ======================================================
    // (Đã được thay thế bởi window.initScrollAnimations ở trên)


    // ======================================================
    // --- 3. LOGIC CHO THANH SKILL BAR (PHIÊN BẢN HYBRID) ---
    // ======================================================

    const skillsGrid = document.querySelector('.skills-grid');

    function initializeSkillBars() {
        const skillLevels = document.querySelectorAll('.skill-level');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const level = element.getAttribute('data-level');
                if (entry.isIntersecting) {
                    element.style.width = level;
                } else {
                    element.style.width = '0%';
                }
            });
        }, { threshold: 0.5 });

        skillLevels.forEach(level => skillObserver.observe(level));
    }

    async function fetchAndDisplayHybridSkills() {
        if (!skillsGrid) return;

        const skillsMap = new Map([
            ['HTML', { name: 'HTML', percentage: 40, icon: 'assets/icons/html.png' }],
            ['CSS', { name: 'CSS', percentage: 40, icon: 'assets/icons/css.png' }],
            ['JavaScript', { name: 'JavaScript', percentage: 50, icon: 'assets/icons/javascript.png' }],
            ['PHP', { name: 'PHP', percentage: 30, icon: 'assets/icons/php.png' }],
            ['Java', { name: 'Java', percentage: 25, icon: 'assets/icons/java1.png' }],
            ['Dart', { name: 'Dart', percentage: 20, icon: 'assets/icons/dart.png' }],
            ['Python', { name: 'Python', percentage: 15, icon: 'assets/icons/python.png' }],
            ['TypeScript', { name: 'TypeScript', percentage: 15, icon: 'assets/icons/typescript.png' }],
            ['Git & GitHub', { name: 'Git & GitHub', percentage: 85, icon: 'assets/icons/github.png' }],
            ['Docker', { name: 'Docker', percentage: 60, icon: 'assets/icons/docker.png' }],
        ]);

        const defaultIcon = 'assets/icons/default.png';
        const apiUrl = 'github_stats.json';

        try {
            const response = await fetch(apiUrl);
            // Nếu lỗi fetch file json, dùng dữ liệu mặc định trong skillsMap
            if (response.ok) {
                const langStatsData = await response.json();
                const langStats = new Map(Object.entries(langStatsData));

                langStats.forEach((count, lang) => {
                    const factor = 2; 
                    const maxBonus = 40; 

                    if (skillsMap.has(lang)) {
                        const skill = skillsMap.get(lang);
                        const bonus = Math.min(count * factor, maxBonus);
                        skill.percentage = Math.min(skill.percentage + bonus, 95); 
                    } else {
                        skillsMap.set(lang, {
                            name: lang,
                            percentage: Math.min(10 + (count * factor), 50),
                            icon: defaultIcon
                        });
                    }
                });
            }

            const finalSkills = Array.from(skillsMap.values())
                .sort((a, b) => b.percentage - a.percentage);

            skillsGrid.innerHTML = ''; 

            finalSkills.forEach(skill => {
                const skillCardHTML = `
                <div class="skill-card glass-card animate-on-scroll">
                    <div class="skill-header">
                        <div class="skill-info">
                            <img src="${skill.icon}" alt="${skill.name} Icon" class="skill-icon-header">
                            <span class="skill-name">${skill.name}</span>
                        </div>
                        <span class="skill-percentage">${skill.percentage}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-level" data-level="${skill.percentage}%"></div>
                    </div>
                </div>
            `;
                skillsGrid.innerHTML += skillCardHTML;
            });

            // Kích hoạt animation cho các skill card mới tạo
            window.initScrollAnimations(); // GỌI LẠI HÀM NÀY ĐỂ NHẬN DIỆN CARD MỚI
            initializeSkillBars();

        } catch (error) {
            console.error("Failed to fetch skills/stats:", error);
            // Vẫn hiển thị skillsMap cơ bản nếu lỗi
             skillsGrid.innerHTML = '<p class="skills-loading">Error loading stats. Check console.</p>';
        }
    }

    fetchAndDisplayHybridSkills();


    // ======================================================
    // --- 4. LOGIC CHO MUSIC PLAYER ---
    // ======================================================
    const audio = document.getElementById('audio-source');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songCover = document.getElementById('song-cover');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    let currentSongIndex = 0;
    let isPlaying = false;

    // Kiểm tra biến playlist có tồn tại không (từ playlist.js)
    if (typeof playlist !== 'undefined' && playlist.length > 0) {
        function loadSong(song) {
            if (song) {
                if(songTitle) songTitle.textContent = song.title;
                if(songArtist) songArtist.textContent = song.artist;
                if(songCover) songCover.src = song.coverPath;
                if(audio) audio.src = song.audioPath;
            }
        }

        function playSong() {
            if(!audio) return;
            isPlaying = true;
            if(playPauseBtn) playPauseBtn.classList.replace('fa-play', 'fa-pause');
            audio.play();
        }

        function pauseSong() {
            if(!audio) return;
            isPlaying = false;
            if(playPauseBtn) playPauseBtn.classList.replace('fa-pause', 'fa-play');
            audio.pause();
        }

        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        }

        if (playPauseBtn) playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
        if (nextBtn) nextBtn.addEventListener('click', nextSong);
        if (prevBtn) prevBtn.addEventListener('click', prevSong);
        if (audio) audio.addEventListener('ended', nextSong);

        loadSong(playlist[currentSongIndex]);
    }


    // ======================================================
    // --- 5. LOGIC CHO ACTIVE NAV INDICATOR ---
    // ======================================================
    // Logic này có thể cần chạy lại sau khi Header được load
    // Vì vậy ta bọc nó vào hàm để load-components.js có thể gọi (nếu cần)
    window.highlightActiveMenu = function() {
        const navLinks = document.querySelectorAll('.main-nav a');
        const navIndicator = document.querySelector('.nav-indicator');
        const sections = document.querySelectorAll('main section');

        function moveIndicator(targetLink) {
            if (!navIndicator) return;
            if (!targetLink) {
                navIndicator.style.opacity = '0';
                return;
            }
            const linkRect = targetLink.getBoundingClientRect();
            const navRect = targetLink.parentElement.getBoundingClientRect();

            navIndicator.style.width = `${linkRect.width}px`;
            navIndicator.style.left = `${linkRect.left - navRect.left}px`;
            navIndicator.style.opacity = '1';

            navLinks.forEach(link => link.classList.remove('is-active'));
            targetLink.classList.add('is-active');
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => moveIndicator(e.currentTarget));
        });

        const navSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                    moveIndicator(correspondingLink);
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

        sections.forEach(section => {
            navSectionObserver.observe(section);
        });
    };
    
    // Gọi lần đầu (cho các trang không dùng load-components hoặc đã có sẵn html)
    window.highlightActiveMenu();


    // ======================================================
    // --- 6. LOGIC CHO LIGHT/DARK THEME ---
    // ======================================================
    // Cũng bọc vào hàm để gọi lại sau khi Header load xong
    window.initThemeToggle = function() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const body = document.body;

        // Apply initial theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light-mode') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }

        if (themeToggleBtn) {
            // Xóa event cũ để tránh trùng lặp nếu gọi nhiều lần
            const newBtn = themeToggleBtn.cloneNode(true);
            themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);

            newBtn.addEventListener('click', () => {
                body.classList.toggle('light-mode');
                if (body.classList.contains('light-mode')) {
                    localStorage.setItem('theme', 'light-mode');
                } else {
                    localStorage.setItem('theme', 'dark-mode');
                }
            });
        }
    }

    // Gọi lần đầu
    window.initThemeToggle();

});