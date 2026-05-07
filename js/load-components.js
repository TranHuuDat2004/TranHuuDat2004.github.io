document.addEventListener("DOMContentLoaded", async function () {
    // 1. Load Header & Footer
    // Chèn vào các thẻ <header> và <footer> có ID tương ứng
    await loadComponent("header-placeholder", "components/header.html", true);
    await loadComponent("footer-placeholder", "components/footer.html", false);

    // 2. Load các Section nội dung nếu có các placeholder tương ứng
    const sections = ['about', 'skills', 'projects', 'experience', 'blog', 'contact'];
    
    // Sử dụng Promise.all để load tất cả song song
    await Promise.all(sections.map(section => 
        loadComponent(`${section}-placeholder`, `components/sections/${section}.html`, false)
    ));

    // 3. Khởi tạo lại các logic sau khi HTML đã được chèn vào DOM
    if (window.initScrollAnimations) {
        window.initScrollAnimations(); 
    }
    if (window.initParallax) {
        window.initParallax();
    }
    
    // Gọi lại logic GitHub Stars nếu nó tồn tại (được định nghĩa trong scripts.js)
    if (window.fetchGitHubStars) {
        window.fetchGitHubStars();
    }
});

async function loadComponent(elementId, filePath, isHeader) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Xử lý đường dẫn tương đối cho thư mục con (VD: nếu trang nằm trong /blog/)
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

            element.innerHTML = html;

            // Sau khi chèn Header, chạy các logic liên quan đến Header
            if (isHeader) {
                if (window.highlightActiveMenu) window.highlightActiveMenu();
                if (window.initThemeToggle) window.initThemeToggle();
            }
            
            // Sau khi chèn Footer, cập nhật năm
            if (!isHeader && elementId === 'footer-placeholder') {
                const yearSpan = document.getElementById('currentYear');
                if(yearSpan) yearSpan.textContent = new Date().getFullYear();
            }
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}