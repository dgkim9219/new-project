import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if(req.method == "POST"){
        const { id, planNo, MatCmf12, mstMatCmf2, Qty2, memo } = req.body;
        try {
            const db = await open({
                filename: './my_DB.db',
                driver: sqlite3.Database,
            });
                await db.run(`INSERT INTO dgMasterTable2 (id, planNo, MatCmf12, mstMatCmf2, Qty2, memo) VALUES ('${id}', '${planNo}', '${MatCmf12}', '${mstMatCmf2}', '${Qty2}', '${memo}')`);
            
            res.status(200).json({ message: 'Success' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}