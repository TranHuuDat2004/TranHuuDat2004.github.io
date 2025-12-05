document.addEventListener("DOMContentLoaded", async function () {
    // 1. Load Header & Footer
    await loadComponent("header-placeholder", "components/header.html", true);
    await loadComponent("footer-placeholder", "components/footer.html", false);

    // 2. Load các Section nội dung (Chạy vòng lặp)
    const sections = ['about', 'skills', 'projects', 'experience', 'blog', 'contact'];
    
    // Sử dụng Promise.all để load tất cả song song cho nhanh
    await Promise.all(sections.map(section => 
        loadComponent(`${section}-placeholder`, `components/sections/${section}.html`, false)
    ));

    // 3. QUAN TRỌNG: Khởi tạo lại Animation sau khi load xong HTML
    // Vì HTML được chèn động, Observer cũ có thể không bắt được
    if (window.initScrollAnimations) {
        window.initScrollAnimations(); 
    }
});

async function loadComponent(elementId, filePath, isHeader) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Xử lý đường dẫn tương đối cho thư mục con
    const isSubFolder = window.location.pathname.includes("/blog/") || window.location.pathname.includes("/projects/");
    const fetchPath = isSubFolder ? "../" + filePath : filePath;

    try {
        const response = await fetch(fetchPath);
        if (response.ok) {
            let html = await response.text();
            
            // Fix đường dẫn ảnh/link khi ở thư mục con
            if (isSubFolder) {
                html = html.replace(/href="(?!(http|#|mailto|\.\.))([^"]*)"/g, 'href="../$2"');
                html = html.replace(/src="(?!(http|\.\.))([^"]*)"/g, 'src="../$2"');
            }

            // Chèn HTML vào (nối thêm vào section đang có hoặc thay thế div placeholder)
            // Lưu ý: Nếu element là <section id="about">, ta dùng innerHTML
            element.innerHTML = html;

            // Logic riêng cho Header
            if (isHeader) {
                highlightActiveMenu();
                if(typeof initThemeToggle === 'function') initThemeToggle();
            }
            // Logic riêng cho Footer
            if (!isHeader && elementId === 'footer-placeholder') {
                const yearSpan = document.getElementById('currentYear');
                if(yearSpan) yearSpan.textContent = new Date().getFullYear();
            }
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Hàm tô đậm menu đang chọn
function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.classList.remove('is-active');
        
        // Lấy data-page của link
        const page = link.getAttribute('data-page');

        // Logic check đơn giản
        if (currentPath.includes('blog') && page === 'blog') {
            link.classList.add('is-active');
        } else if (currentPath.includes('project') && page === 'projects') {
            link.classList.add('is-active');
        } else if ((currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('tranhuudat2004.github.io/')) && page === 'home') {
            // Trang chủ
            // link.classList.add('is-active'); // Thường trang chủ không cần active state cố định nếu là one-page scroll
        }
    });
}

// Hàm Theme Toggle (Copy từ script cũ sang để đảm bảo nút trong header mới hoạt động)
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }
}