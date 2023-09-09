import { sqlConfig } from "../Config/db.config.js";

import mssql from 'mssql'

export class DB {

    static async exec(storedProcedure, data = {}) {
        try {
            let request =  (await mssql.connect(sqlConfig)).request();
            request = this.addData(request, data);
            return request.execute(storedProcedure);
        } catch (error) {
            return error
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