import { sqlConfig } from "../Config/db.config.js";

import mssql from 'mssql'

export class DB {
    static pool;

    static async getPool() {
        if (!this.pool) {
            this.pool = await mssql.connect(sqlConfig);
        }
        return this.pool;
    }

    static async exec(storedProcedure, data = {}) {
        try {
            const pool = await this.getPool();
            let request = pool.request();

            console.log(`[DB] Connected successfully. Executing stored procedure: ${storedProcedure}`);
            request = this.addData(request, data);
            const result = await request.execute(storedProcedure);
            console.log(`[DB] Stored procedure ${storedProcedure} executed successfully`);
            return result;
        } catch (error) {
            console.error(`[DB] Error executing ${storedProcedure}:`, error.message);
            console.error(`[DB] Error details:`, {
                code: error.code,
                state: error.state,
            });
            throw error
        }
    }

    static addData(req, data = {}) {
        const keys = Object.keys(data);

        keys.forEach((keyName) => {
            req.input(keyName, data[keyName]);
        });

        return req;

    }

}