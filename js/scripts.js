// ======================================================
// --- 0. KHỞI TẠO GLOBAL FUNCTIONS CHO COMPONENTS ---
// ======================================================

// 0.1 Animation Observer
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
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
};

// 0.2 Active Menu Highlight
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
                const correspondingLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`) || 
                                         document.querySelector(`.main-nav a[href="index.html#${sectionId}"]`);
                moveIndicator(correspondingLink);
            }
        });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    sections.forEach(section => navSectionObserver.observe(section));
    
    // Check current page for non-index pages
    const currentPath = window.location.pathname;
    if (currentPath.includes('project.html')) {
        moveIndicator(document.querySelector('.main-nav a[href="project.html"]'));
    } else if (currentPath.includes('blog.html')) {
        moveIndicator(document.querySelector('.main-nav a[href="blog.html"]'));
    } else if (currentPath.includes('download-resume.html')) {
        const resumeBtn = document.querySelector('.resume-button');
        if (resumeBtn) {
            resumeBtn.classList.add('is-active');
            moveIndicator(null); // Hide indicator for resume button as it's outside the nav
        }
    }
};

// 0.3 Theme Toggle
window.initThemeToggle = function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }

    if (themeToggleBtn) {
        const newBtn = themeToggleBtn.cloneNode(true);
        themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);

        newBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode');
        });
    }
};

// 0.4 GitHub Stars
window.fetchGitHubStars = async function() {
    const starCountElement = document.getElementById('star-count');
    if (!starCountElement) return;

    try {
        const repo = 'TranHuuDat2004/TranHuuDat2004.github.io';
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        if (response.ok) {
            const data = await response.json();
            starCountElement.textContent = data.stargazers_count;
        } else {
            starCountElement.textContent = '0';
        }
    } catch (error) {
        console.error('Error fetching GitHub stars:', error);
        starCountElement.textContent = '0';
    }
};

// 0.5 Parallax Effect for Hero
window.initParallax = function() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const heroBg = hero.querySelector('.hero-background');
    const profileCard = hero.querySelector('.profile-card-container');
    const heroText = hero.querySelector('.hero-text-content');
    const shapes = hero.querySelectorAll('.shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Chỉ chạy parallax khi hero còn đang hiển thị
        if (scrolled <= hero.offsetHeight) {
            // Background moves slower (0.4 speed)
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Profile card moves slightly faster (0.15 speed)
            if (profileCard) {
                profileCard.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            
            // Hero text moves slightly slower than scroll (0.1 speed)
            if (heroText) {
                heroText.style.transform = `translateY(${scrolled * 0.1}px)`;
            }

            // Decorative shapes move at different speeds
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    }, { passive: true });
};

// ======================================================
// --- MAIN LOGIC ---
// ======================================================
document.addEventListener('DOMContentLoaded', () => {

    // Khởi tạo các logic cơ bản
    window.initScrollAnimations();
    window.highlightActiveMenu();
    window.initThemeToggle();
    window.fetchGitHubStars();
    window.initParallax();

    // 1. Header & Progress Bar Logic
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 100) header.classList.add('visible');
            else header.classList.remove('visible');
        }
        if (progressBar) {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
    });

    // 2. Skill Bars Logic
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        async function fetchAndDisplayHybridSkills() {
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

            try {
                const response = await fetch('github_stats.json');
                if (response.ok) {
                    const langStatsData = await response.json();
                    Object.entries(langStatsData).forEach(([lang, count]) => {
                        if (skillsMap.has(lang)) {
                            const skill = skillsMap.get(lang);
                            skill.percentage = Math.min(skill.percentage + Math.min(count * 2, 40), 95);
                        }
                    });
                }
                
                skillsGrid.innerHTML = Array.from(skillsMap.values())
                    .sort((a, b) => b.percentage - a.percentage)
                    .map(skill => `
                        <div class="skill-card glass-card animate-on-scroll">
                            <div class="skill-header">
                                <div class="skill-info">
                                    <img src="${skill.icon}" alt="${skill.name}" class="skill-icon-header">
                                    <span class="skill-name">${skill.name}</span>
                                </div>
                                <span class="skill-percentage">${skill.percentage}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-level" style="width: 0%" data-level="${skill.percentage}%"></div>
                            </div>
                        </div>
                    `).join('');

                window.initScrollAnimations();
                
                const skillObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.width = entry.target.getAttribute('data-level');
                        }
                    });
                }, { threshold: 0.5 });
                document.querySelectorAll('.skill-level').forEach(el => skillObserver.observe(el));

            } catch (e) { console.error(e); }
        }
        fetchAndDisplayHybridSkills();
    }

    // 3. Music Player Logic
    const audio = document.getElementById('audio-source');
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (audio && typeof playlist !== 'undefined' && playlist.length > 0) {
        let currentSongIndex = 0;
        let isPlaying = false;

        const loadSong = (song) => {
            document.getElementById('song-title').textContent = song.title;
            document.getElementById('song-artist').textContent = song.artist;
            document.getElementById('song-cover').src = song.coverPath;
            audio.src = song.audioPath;
        };

        const playSong = () => { isPlaying = true; playPauseBtn.classList.replace('fa-play', 'fa-pause'); audio.play(); };
        const pauseSong = () => { isPlaying = false; playPauseBtn.classList.replace('fa-pause', 'fa-play'); audio.pause(); };

        playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
        document.getElementById('next-btn').addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        });
        document.getElementById('prev-btn').addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        });
        audio.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        });
        loadSong(playlist[currentSongIndex]);
    }

    // 4. Certificate Modal Logic
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) {
        const certImage = document.getElementById('certImage');
        const closeBtn = document.querySelector('.pdf-modal-close');
        
        document.querySelectorAll('.btn-pdf-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                certImage.src = btn.getAttribute('data-cert');
                document.getElementById('pdfModalTitle').textContent = btn.parentElement.querySelector('.certificate-title').textContent.replace('Chứng nhận: ', '');
                pdfModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', () => {
            pdfModal.classList.remove('active');
            setTimeout(() => { certImage.src = ''; certImage.style.transform = 'scale(1)'; }, 300);
            document.body.style.overflow = '';
        });

        const zoomContainer = document.querySelector('.zoom-container');
        if (zoomContainer) {
            zoomContainer.addEventListener('mousemove', (e) => {
                const rect = zoomContainer.getBoundingClientRect();
                const posX = ((e.clientX - rect.left) / rect.width) * 100;
                const posY = ((e.clientY - rect.top) / rect.height) * 100;
                certImage.style.transformOrigin = `${posX}% ${posY}%`;
                certImage.style.transform = 'scale(1.8)';
            });
            zoomContainer.addEventListener('mouseleave', () => certImage.style.transform = 'scale(1)');
        }
    }
});