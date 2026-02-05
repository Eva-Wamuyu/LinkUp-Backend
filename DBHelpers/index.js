import { sqlConfig } from "../Config/db.config.js";

import mssql from 'mssql'

export class DB {

    static async exec(storedProcedure, data = {}) {
        try {
            const pool = mssql.connect(sqlConfig);
            const request = this.addData(pool.request(), data);
            return await request.execute(storedProcedure);
        } catch (error) {
            console.log("DB.EXEC Stored procedure failed", {
                storedProcedure,
                message: error.message,
                stack: error.stack
            })
            throw error;
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