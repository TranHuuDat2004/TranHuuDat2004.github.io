// Import các module cần thiết của Node.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// Tên người dùng GitHub của bạn
const GITHUB_USERNAME = 'TranHuuDat2004';
// Đường dẫn đến tệp JSON đầu ra
const OUTPUT_PATH = path.join(__dirname, '..', 'github_stats.json');
// Tùy chọn cho yêu cầu API GitHub
const options = {
    hostname: 'api.github.com',
    path: `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
    method: 'GET',
    headers: {
        'User-Agent': 'Node.js script', // API GitHub yêu cầu một User-Agent
    }
};

// Hàm chính để thực hiện công việc
async function fetchAndSaveStats() {
    console.log('Bắt đầu lấy dữ liệu từ GitHub API...');

    // Tạo một Promise để xử lý yêu cầu HTTPS
    const promise = new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            // Nhận dữ liệu theo từng đoạn
            res.on('data', (chunk) => {
                data += chunk;
            });
            // Khi kết thúc, xử lý toàn bộ dữ liệu
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Lỗi API GitHub: Trạng thái ${res.statusCode}
${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });

    try {
        // Chờ đợi dữ liệu từ API
        const repos = await promise;
        console.log(`Đã tìm thấy ${repos.length} kho lưu trữ.`);

        // Đếm số lượng ngôn ngữ
        const langStats = {};
        repos.forEach(repo => {
            if (repo.language) {
                langStats[repo.language] = (langStats[repo.language] || 0) + 1;
            }
        });

        console.log('Số liệu thống kê ngôn ngữ:', langStats);

        // Ghi dữ liệu vào tệp github_stats.json
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(langStats, null, 2));
        console.log(`Đã lưu thành công số liệu thống kê vào ${OUTPUT_PATH}`);

    } catch (error) {
        console.error('Đã xảy ra lỗi:', error.message);
        process.exit(1); // Thoát với mã lỗi
    }
}

// Chạy hàm chính
fetchAndSaveStats();
