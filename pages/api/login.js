// pages/api/login.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, password } = req.body;
    
    // SQLite 데이터베이스에 연결
    const db = await open({
      filename: './my_DB.db',
      driver: sqlite3.Database,
    });
    try {
      // 사용자 정보 조회
      const user = await db.get('SELECT * FROM USERINFO WHERE userId = ? AND userPw = ?', userId, password);
      if (user) {
        // 로그인이 성공한 경우 처리
        res.status(200).json({ message: 'Login successful', userId });
      } else {
        // 로그인이 실패한 경우 처리
        console.error('Login failed for user:', userId);
        res.status(401).json({ message: 'Login failed', reason: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      // 데이터베이스 연결 종료
      await db.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
