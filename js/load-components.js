document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-placeholder", "components/header.html", true);
    loadComponent("footer-placeholder", "components/footer.html", false);
});

async function loadComponent(elementId, filePath, isHeader) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // 1. Xác định vị trí file component dựa trên trang hiện tại
    // Nếu đang ở thư mục con (VD: blog/), cần lùi ra 1 cấp (../components/...)
    const isSubFolder = window.location.pathname.includes("/blog/") || window.location.pathname.includes("/projects/");
    const fetchPath = isSubFolder ? "../" + filePath : filePath;

    try {
        const response = await fetch(fetchPath);
        if (response.ok) {
            let html = await response.text();
            
            // 2. Sửa đường dẫn link nếu đang ở thư mục con
            if (isSubFolder) {
                // Thay thế href="ten-file" thành href="../ten-file"
                // Regex này tìm các href không bắt đầu bằng http, https, #, mailto
                html = html.replace(/href="(?!(http|#|mailto|\.\.))([^"]*)"/g, 'href="../$2"');
                
                // Sửa đường dẫn ảnh (src) nếu có
                html = html.replace(/src="(?!(http|\.\.))([^"]*)"/g, 'src="../$2"');
            }

            element.innerHTML = html;

            // 3. Logic riêng cho Header (Active Menu & Theme Toggle)
            if (isHeader) {
                highlightActiveMenu();
                initThemeToggle(); // Hàm này cần có trong script.js hoặc viết lại ở đây
            }
            
            // 4. Logic riêng cho Footer (Update Year)
            if (!isHeader) {
                const yearSpan = document.getElementById('year-placeholder');
                if(yearSpan) yearSpan.textContent = new Date().getFullYear();
            }

        } else {
            console.error(`Error loading ${filePath}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Fetch error:`, error);
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