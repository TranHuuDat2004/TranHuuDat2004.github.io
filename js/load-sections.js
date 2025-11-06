document.addEventListener("DOMContentLoaded", function() {
    // Tìm phần tử container nơi chúng ta sẽ chèn các section
    const sectionsContainer = document.getElementById("main-content-sections");

    // Nếu không tìm thấy container, dừng thực thi để tránh lỗi
    if (!sectionsContainer) {
        console.error("Không tìm thấy phần tử #main-content-sections. Vui lòng thêm thẻ div này vào file HTML của bạn.");
        return;
    }

    // Sử dụng fetch API để lấy nội dung từ file sections.html
    fetch('sections.html')
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error("Không thể tải file sections.html");
            }
            // Chuyển đổi nội dung phản hồi sang dạng text
            return response.text();
        })
        .then(html => {
            // Chèn nội dung HTML đã lấy được vào container
            sectionsContainer.innerHTML = html;
        })
        .catch(error => {
            // Ghi lại lỗi nếu có sự cố xảy ra
            console.error("Đã xảy ra lỗi khi tải các section:", error);
            sectionsContainer.innerHTML = "<p style='text-align: center; color: red;'>Không thể tải nội dung. Vui lòng kiểm tra lại.</p>";
        });
});