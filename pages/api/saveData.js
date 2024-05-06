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

    const { planNo, columnName, cellValue } = req.body;
    try {
        // Check if the row with the given planNo exists
        const existingRow = await db.get('SELECT * FROM dgMasterTable WHERE planNo = ?', [planNo]);
        if (existingRow) {
            // Update the cell value of the selected column for the row with the given planNo
            await db.run(`UPDATE dgMasterTable SET ${columnName} = ? WHERE planNo = ?`, [cellValue, planNo]);
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            // If the row does not exist, insert a new row with the given planNo and cellValue
            await db.run(`INSERT INTO dgMasterTable (planNo, ${columnName}) VALUES (?, ?)`, [planNo, cellValue]);
            res.status(200).json({ message: 'Data saved successfully' });
        }
    } catch (error) {
        console.error('Error saving data:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await db.close();
    }
}


