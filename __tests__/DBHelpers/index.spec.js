import { DB } from '../../DBHelpers/index.js'; 
import { sqlConfig } from '../../Config/db.config.js'; 
import mssql from 'mssql';



jest.mock('mssql')
jest.mock('../../Config/db.config.js', () => ({
  sqlConfig: {
    exec: jest.fn(),
  },
}));
describe('DBHELPERS DB CLASS', () => {
  // beforeEach(() => {
  //   mssql.connect.mockClear();
  //   mssql.Request.mockClear();
  //   mssql.Request.prototype.input.mockClear();
  //   mssql.Request.prototype.execute.mockClear();
  // });

  

  it('Return Errors If There Are Errors', async () => {
    const storedProcedure = 'YourStoredProcedureName';
    const data = {
      paramName1: 'paramValue1',
    };

    mssql.connect.mockRejectedValueOnce('MockedError');

    const result = await DB.exec(storedProcedure, data);

    expect(mssql.connect).toHaveBeenCalledWith(sqlConfig);
    expect(result).toEqual('MockedError');
  });

  it('Should Execute A stored Procedure with data', async () => {
    const storedProcedure = 'StoredProcedureName';
    const data = {
      paramName1: 'paramValue1',
      paramName2: 'paramValue2',
    };


    mssql.connect.mockResolvedValueOnce({
      request: jest.fn(),
    });


    mssql.Request.mockImplementation(() => ({
      input: jest.fn(),
      execute: jest.fn().mockResolvedValueOnce('MockedResult'),
    }));

    const result = await DB.exec(storedProcedure, data);

    expect(mssql.connect).toHaveBeenCalledWith(sqlConfig);
    expect(mssql.Request).toHaveBeenCalledTimes(1);
    expect(mssql.Request.prototype.input).toHaveBeenCalledTimes(2); 
    expect(mssql.Request.prototype.execute).toHaveBeenCalledWith(storedProcedure);
    expect(result).toEqual('MockedResult');
  });
});
