import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
    });

    const { id, columnName, cellValue } = req.body;
    try {

        const existingRow = await db.get('SELECT * FROM dgMasterTable2 WHERE id = ?', [id]);
        if (existingRow) {

            await db.run(`UPDATE dgMasterTable2 SET ${columnName} = ? WHERE id = ?`, [cellValue, id]);
            res.status(200).json({ message: 'Data updated successfully' });
        } else {

            await db.run(`INSERT INTO dgMasterTable2 (id, ${columnName}) VALUES (?, ?)`, [id, cellValue]);
            res.status(200).json({ message: 'Data saved successfully' });
        }
    } catch (error) {
        console.error('Error saving data:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await db.close();
    }
}


