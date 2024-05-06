const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3006;

app.post('/executePythonCode', (req, res) => {
  // 서버에 저장된 파이썬 코드 실행
  exec('update_test_newTable.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).json({ success: false, error: stderr });
      return;
    }

    // 실행 결과를 클라이언트에게 전송
    console.log(`stdout: ${stdout}`);
    res.json({ success: true, result: stdout });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
