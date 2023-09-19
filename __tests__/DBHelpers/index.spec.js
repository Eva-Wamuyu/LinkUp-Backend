import { DB } from '../../DBHelpers/index.js'; 
import { sqlConfig } from "../../Config/db.config.js";
import mssql from 'mssql';

jest.mock('mssql', () => ({
  connect: jest.fn(),
  request: jest.fn(),
}));
jest.mock('../../Config/db.config.js', () => ({
  sqlConfig: jest.fn(),
  
}));

describe('DB HELPER', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('exec should execute stored procedure with provided data', async () => {
    const fakeConnection = {
      request: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue('execution result'),
    };
    mssql.connect.mockResolvedValue(fakeConnection);

    const storedProcedure = 'usp_TestProcedure';
    const data = { param1: 'value1', param2: 'value2' };

    const result = await DB.exec(storedProcedure, data);

    expect(mssql.connect).toHaveBeenCalledWith(sqlConfig);
    expect(fakeConnection.request).toHaveBeenCalled();
    //to be revisited later
  //  expect(fakeConnection.request().input).toHaveBeenCalledWith(data.param1, data.param2);
    // expect(fakeConnection.request().input).toHaveBeenCalledWith(data.param1, data.param2);
    // expect(fakeConnection.execute).toHaveBeenCalledWith(storedProcedure);
    //expect(result).toBe('execution result');
  });

  it('exec should return error on connection error', async () => {
    mssql.connect.mockRejectedValue(new Error('Connection error'));

    const storedProcedure = 'usp_TestProcedure';

    const result = await DB.exec(storedProcedure);

    // expect(mssql.connect).toHaveBeenCalledWith(DB.sqlConfig);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Connection error');
  });

  it('addData should add input parameters to the request', () => {
    const req = {
      input: jest.fn().mockReturnThis(),
    };

    const data = { param1: 'value1', param2: 'value2' };

    const result = DB.addData(req, data);

    expect(req.input).toHaveBeenCalledWith('param1', 'value1');
    expect(req.input).toHaveBeenCalledWith('param2', 'value2');
    expect(result).toBe(req);
  });
});
