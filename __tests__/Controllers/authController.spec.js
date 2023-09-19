import bcrypt from 'bcrypt';
import { registerUser,loginUser,resetPassword } from "../../Controllers/auth.Controller.js";
import {generateAccessToken} from '../../Middleware/index.js';
import { validateRegisterSchema,validateloginSchema,validateResetEmail } from '../../Validators/userValidators.js';
import { DB } from '../../DBHelpers/index.js'; 
import { sendResetLink } from '../../MailService/sendResetLink.js';
// import { v4 as uuidv4 } from 'uuid';
const reqMock = {
    body: {
      username: "userNameTest",
      email: "usertest@gmail.com",
      password: "passtest1",  
    },
  };
  
const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};
jest.mock('../../Middleware/index.js');
jest.mock('../../Validators/userValidators.js', () => ({
  validateRegisterSchema: {
    validate: jest.fn(),
  },
  validateloginSchema: {
    validate: jest.fn(),
  },
  validateResetEmail: {
    validate: jest.fn(),
  },
  
}));
jest.mock('../../DBHelpers/index.js', () => ({
  DB: {
    exec: jest.fn(),
  },
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock('../../Middleware/index.js', () => ({
    generateAccessToken: jest.fn(),
    
}));
jest.mock('../../MailService/sendResetLink.js', () => ({
  sendResetLink: jest.fn(),
  
}));
// jest.mock('uuid', () => ({
//   uuidv4: jest.fn(),
  
// }));

describe("USER CONTROLLER, REGISTER USER",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 422 response for invalid input', async () => {
        validateRegisterSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Validation error',
        });
      
    });

    it('should return a 201 response and generate a token for a valid Registration', async () => {
        const userData = {
            username: "userNameTest",
            email: "usertest@gmail.com",
            password: "passtest1",  
            hashedPassword: "hasheed Password"
        };
       
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("hasheed Password")
        validateRegisterSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: [1],recordset: [userData] });
        //bcrypt.hash.mockResolvedValue('hashedPassword');
        generateAccessToken.mockReturnValue('testToken');
    
        await registerUser(reqMock, resMock);
        
        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'ok',
          user: {
            user_id: userData.user_id,
            username: userData.username,
          },
          message: 'Account Created Successfully',
          token: 'testToken',
        });
    });

    it('should return a 409 response if the username already exist', async () => {
        validateRegisterSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockResolvedValue({ recordset: [{Message: "Username already exists."}] });
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(409);
        expect(resMock.json).toHaveBeenCalledWith({
          message: "Woops,this username is already taken",
        });
    });

    it('should return a 409 response if the email already exist', async () => {
            validateRegisterSchema.validate.mockReturnValue({ error: null });
            DB.exec.mockResolvedValue({ recordset: [{Message: "Email already exists."}] });
            await registerUser(reqMock, resMock);
            expect(resMock.status).toHaveBeenCalledWith(409);
            expect(resMock.json).toHaveBeenCalledWith({
              message: "Email already exists.",
            });
        });
        
      it('should return a 500 response for a database error', async () => {
        validateRegisterSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Internal Server Error',
        });
      });
});





describe("USER CONTROLLER, LOGIN USER",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    const reqMock = {
        body: {
          emailOrUsername: "userNameTest",
          password: "passtest1",  
        },
      };


    it('should return a 422 response for invalid input', async () => {
        validateloginSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await loginUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Validation error',
        });
    });

    it('should return a 403 For Invalid Credentials', async () => {
        const userData = {
            username: "userNameTest",
            email: "usertest@gmail.com",
            password: "passtest1",  
            hashedPassword: "hasheed Password"
        };
        validateloginSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockResolvedValue({ recordset: [userData] });
        bcrypt.compare.mockResolvedValue(false);
        await loginUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(403);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Woops, Password is not correct',
        });
    });

    it('should return a 404 For A non Existent Account', async () => {
        validateloginSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockResolvedValue({ recordset: [] });
        
        await loginUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
        
          message: 'Woops, seems You Do Not have An Account',
        });
    });

    
    it('should return a 200 response and generate a token for a valid Login', async () => {
        const userData = {
            username: "userNameTest",
            email: "usertest@gmail.com",
            password: "passtest1",  
            hashedPassword: "hasheed Password"
        };
        
        validateloginSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockResolvedValue({ recordset: [userData] });
        bcrypt.compare.mockResolvedValue(true);
        generateAccessToken.mockReturnValue('testToken');
    
        await loginUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'ok',
          user: {
            user_id: userData.user_id,
            username: userData.username,
          },
          message: 'Login successful',
          token: 'testToken',
        });
    });

});



describe("USER CONTROLLER, resetPassword",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return a 422 response for invalid Email input', async () => {
    const reqMock = {
      body:{
        email: "usertest@gmail",
      }
      };
    validateResetEmail.validate.mockReturnValue({ error: { message: 'Validation error' } });
    await resetPassword(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(422);
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Validation error',
    });

    jest.clearAllMocks();
    
  });

  // it('should use getuser by mail procedure and return a 404 if the user is not found', async () => {
  //   const reqMock = {
  //     body:{
  //       email: "usertest@gmail",
  //     }
  //     };
  //   validateResetEmail.validate.mockReturnValue({ error: null });
  //   await DB.exec.mockResolvedValue({ rowsAffected: [0] });
  //   await resetPassword(reqMock, resMock);
  //   expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByMail', {
  //     email: reqMock.body.email,
  //    });
  //   expect(resMock.status).toHaveBeenCalledWith(404);
  //   expect(resMock.json).toHaveBeenCalledWith({
  //     message: 'User Not Found',
  //   });

  //   jest.clearAllMocks();
    
  // });

  // it('should generate a token and save it', async () => {
  //   const reqMock = {
  //     body:{
  //       email: "usertest@gmail",
  //     }
  //     };
  //   const user = {
  //     email: "usertest@gmail",
  //     username: 'testuser'
  //   }
    
  //   validateResetEmail.validate.mockReturnValue({ error: null });
  //   DB.exec.mockResolvedValue({ rowsAffected: [0],rowsAffected:[1],recordset: [user] });
  //   await resetPassword(reqMock, resMock);
  //   await expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByMail', {
  //     email: reqMock.body.email,
  //    });
  //    expect(DB.exec).toHaveBeenCalledWith('usp_AddToken', {
  //     username: user.username,
  //     token: expect(any)
  //    });
   
  //   jest.clearAllMocks();
    
  // });

  // it('should send link to user and return 200', async () => {
  //   const reqMock = {
  //     body:{
  //       email: "usertest@gmail",
  //     }
  //     };
  //   const user = {
  //     email: "usertest@gmail",
  //     username: 'testuser'
  //   }
  //   const token = 'random'
  //   validateResetEmail.validate.mockReturnValue({ error: null });
  //   await DB.exec.mockResolvedValue({ rowsAffected: [0],rowsAffected:[1],recordset: [user] });
  //   const link = 'linked';
  //   await resetPassword(reqMock, resMock);
  //   expect(resMock.status).toHaveBeenCalledWith(200);
  //   expect(resMock.json).toHaveBeenCalledWith({
  //       status: 'ok',
	// 			message: 'Reset Link Sent To Your Email',
  //   });
  //   jest.clearAllMocks();
    
  // });
      
  it('should return a 500 response for a database error', async () => {
    validateResetEmail.validate.mockReturnValue({ error: null });
      await DB.exec.mockRejectedValueOnce(new Error('Database error'));
      await resetPassword(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
});


describe("USER CONTROLLER, resetPassword",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return a 422 response for invalid Email input', async () => {
    const reqMock = {
      body:{
        email: "usertest@gmail",
      }
      };
    validateResetEmail.validate.mockReturnValue({ error: { message: 'Validation error' } });
    await resetPassword(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(422);
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'Validation error',
    });

    jest.clearAllMocks();
    
  });

  it('should use getuser by mail procedure and return a 404 if the user is not found', async () => {
    const reqMock = {
      body:{
        email: "usertest@gmail",
      }
      };
    validateResetEmail.validate.mockReturnValue({ error: null });
    
    await DB.exec.mockResolvedValue({ rowsAffected: [0] });
    await resetPassword(reqMock, resMock);
    expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByMail', {
      email: reqMock.body.email,
     });
    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'User Not Found',
    });

    jest.clearAllMocks();
    
  });

  it('should generate a token and save it', async () => {
    const reqMock = {
      body:{
        email: "usertest@gmail",
      }
      };
    const user = {
      email: "usertest@gmail",
      username: 'testuser'
    }
    validateResetEmail.validate.mockReturnValue({ error: null });
    DB.exec.mockResolvedValue({ rowsAffected: [1],recordset: [user] });
    await resetPassword(reqMock, resMock);
    await expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByMail', {
      email: reqMock.body.email,
     });
     expect(DB.exec).toHaveBeenCalledWith('usp_AddToken', {
      username: user.username,
      token: expect.any(String)
     });
   
    jest.clearAllMocks();
    
  });

  //to be checked on later ;_)
  it('should send link to user and return 200', async () => {
    const reqMock = {
      body:{
        email: "usertest@gmail",
      }
      };
    const user = {
      email: "usertest@gmail",
      username: 'testuser'
    }
    validateResetEmail.validate.mockReturnValue({ error: null });
    await DB.exec.mockResolvedValue({ rowsAffected: [1],rowsAffected:[1],recordset: [user] });
    sendResetLink.mockReturnValue()
    await resetPassword(reqMock, resMock);
    expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByMail', {
      email: reqMock.body.email,
     });
     expect(DB.exec).toHaveBeenCalledWith('usp_AddToken', {
      username: user.username,
      token: expect.any(String)
     });
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
        status: 'ok',
				message: 'Reset Link Sent To Your Email',
    });
    jest.clearAllMocks();
    
  });
      
  it('should return a 500 response for a database error', async () => {
    validateResetEmail.validate.mockReturnValue({ error: null });
      await DB.exec.mockRejectedValueOnce(new Error('Database error'));
      await resetPassword(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
});