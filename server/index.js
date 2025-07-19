// Node.js / Express 用スクリプト。require() が使える環境です。
const express = require('express');
const path    = require('path');
const app     = express();
const port    = 3000;

// JSON ボディをパース
app.use(express.json());

// client フォルダを静的配信
app.use(express.static(path.join(__dirname, '..', 'client')));

// API エンドポイント
app.post('/api/resource', (req, res) => {
  console.log('受信データ:', req.body);
  // （ここで保存処理などを行う）
  return res.json({ message: 'OK', data: req.body });
});

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});