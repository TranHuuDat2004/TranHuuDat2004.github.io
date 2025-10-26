# Giải thích về github_stats.json

Tệp `github_stats.json` đóng vai trò là bộ đệm (cache) cho dữ liệu số liệu thống kê ngôn ngữ lấy từ API công khai của GitHub. Mục đích của nó là hiển thị động phần "Skills" (Kỹ năng) trên trang portfolio mà không phải liên tục gọi API của GitHub trực tiếp từ trình duyệt của người dùng.

## Mục đích

*   **Tránh giới hạn tốc độ API (Rate Limiting):** Các yêu cầu không được xác thực đến API GitHub bị giới hạn nghiêm ngặt (ví dụ: 60 yêu cầu mỗi giờ). Bằng cách sử dụng tệp tĩnh, chúng ta loại bỏ sự phụ thuộc này, đảm bảo tính năng kỹ năng luôn tải được.
*   **Cải thiện hiệu suất tải trang:** Tải dữ liệu từ một tệp cục bộ nhanh hơn nhiều so với việc thực hiện yêu cầu mạng đến máy chủ GitHub.
*   **Tính ổn định:** Đảm bảo tính năng kỹ năng hoạt động độc lập với tình trạng sẵn có hoặc giới hạn của API GitHub.

## Cách tạo ra dữ liệu

Dữ liệu trong tệp này được thu thập bằng cách:

1.  **Gửi yêu cầu API:** Thực hiện một lệnh gọi HTTP đến API GitHub: `https://api.github.com/users/tranhuudat2004/repos?per_page=100&sort=pushed`. Lệnh gọi này lấy về danh sách tất cả các kho lưu trữ (repository) công khai của người dùng `tranhuudat2004`.
2.  **Trích xuất ngôn ngữ chính:** Đối với mỗi kho lưu trữ trong danh sách trả về, chúng tôi đã trích xuất `language` chính được sử dụng trong kho đó.
3.  **Đếm số lần xuất hiện:** Chúng tôi đã đếm số lượng kho lưu trữ cho mỗi ngôn ngữ.

## Cấu trúc dữ liệu

Tệp `github_stats.json` là một đối tượng JSON đơn giản, nơi các khóa (keys) là tên của các ngôn ngữ lập trình và các giá trị (values) là số lượng kho lưu trữ GitHub công khai của bạn sử dụng ngôn ngữ đó làm ngôn ngữ chính.

**Ví dụ:**

```json
{
  "HTML": 2,
  "JavaScript": 3,
  "CSS": 3,
  "C#": 1,
  "Python": 3,
  "Jupyter Notebook": 1,
  "ShaderLab": 1
}
```

*   **"HTML": 2** có nghĩa là có 2 kho lưu trữ của bạn mà HTML là ngôn ngữ chính.
*   **"JavaScript": 3** có nghĩa là có 3 kho lưu trữ của bạn mà JavaScript là ngôn ngữ chính.

## Cách sử dụng

Tệp `js/scripts.js` sẽ đọc dữ liệu từ `github_stats.json` và sử dụng các giá trị này để tính toán phần trăm hiển thị trong các thanh kỹ năng. Mỗi số lượng kho lưu trữ sẽ cung cấp một "điểm thưởng" nhất định cho phần trăm hiển thị của kỹ năng tương ứng, tạo ra một màn hình kỹ năng sống động và phản ánh hoạt động phát triển thực tế của bạn trên GitHub.

## Cập nhật dữ liệu

Khi bạn có các kho lưu trữ mới hoặc cập nhật các kho lưu trữ hiện có và muốn phần "Skills" phản ánh những thay đổi đó, bạn sẽ cần phải:

1.  **Chạy lại tập lệnh tạo `github_stats.json`:** Nếu có một tập lệnh tự động hóa việc này (ví dụ: một tập lệnh Python hoặc Node.js), bạn sẽ chạy nó. Hiện tại, quá trình này được thực hiện thủ công bởi trợ lý.
2.  **Cập nhật tệp:** Đảm bảo rằng tệp `github_stats.json` mới được tạo được đặt trong thư mục gốc của dự án.
