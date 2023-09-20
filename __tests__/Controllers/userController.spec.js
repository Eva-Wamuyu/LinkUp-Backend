import { DB } from '../../DBHelpers/index.js'; 
import { getUserByUsername,updateUserDetails,getUsersToFollow,getUserProfile } from '../../Controllers/user.Controller.js';
import { validateUpdateSchema } from '../../Validators/userValidators.js';



const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};
jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));

jest.mock('../../Validators/userValidators.js', () => ({
    validateUpdateSchema: {
      validate: jest.fn(),
    },
}));
// jest.restoreAllMocks()
describe("USER CONTROLLER, GET USER BY USERNAME",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should call the right procedure and return a 200 response user Info', async () => {
        const reqMock = {
            info: {
                issuer: "username",
            },
            params:{
                username: "username",
            }
        };
        const user = [
            {
                "follows": 0,
                "followed": 1,
                "followers": 1,
                "following": 6,
                "posts": 3,
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694522352/LinkUp/slhc2rgpbgszrqhl4yln.jpg",
                "bio": "jazz and soul",
                "joined_at": "2023-09-08T16:12:30.277Z",
                "username": "test",
                "user_id": "fa745d16-83344787-b69d-24cc4a5a4cff"
            }
        ]
        
        // jest.spyOn(DB, 'exec').mockResolvedValueOnce({ recordset: user })
        await DB.exec.mockResolvedValue({ recordset: user,rowsAffected: 1 });
        await getUserByUsername(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith(
            'usp_GetUserInfo',{
             username: reqMock.params.username,
             user_id: reqMock.info.issuer
            }
        )
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'ok',
          user
        });
        jest.clearAllMocks();
    });

    
    it('should call the right procedure and return a 404 if the user is not found', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            },
            params:{
                username: "username",
            }
        }
        // jest.spyOn(DB, 'exec').mockResolvedValueOnce({ recordset: [] })
        await DB.exec.mockResolvedValue({ rowsAffected: 0});
        await getUserByUsername(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(DB.exec).toHaveBeenCalledWith(
           'usp_GetUserInfo',{
            username: reqMock.params.username,
            user_id: reqMock.info.issuer
           }
        )
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'User with that username not found'
        });
        jest.clearAllMocks();
    });


    it('should call the right procedure and return a 500 For Database Error found', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            },
            params:{
                username: "username",
            }
        }
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await getUserByUsername(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'  
        });
        jest.clearAllMocks();
    });  
});


describe("USER CONTROLLER, UPDATE USER DETAILS",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should call the right procedure and return a 200 after successful user update of Info', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            },
            body:{
                bio: "bio",
                profile_image: "iconny.jpg"
            }
        };

        validateUpdateSchema.validate.mockResolvedValueOnce({error:null})
        await DB.exec.mockResolvedValue({});
        await updateUserDetails(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith(
            'usp_UpdateUserProfile',{
             user_id: reqMock.info.issuer,
             bio: reqMock.body.bio,
             profile_image: reqMock.body.profile_image
            }
        )
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Updated profile successfully'  
        });
        jest.clearAllMocks();
    });


    it('should return a 500 For Database Error found', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            },
            params:{
                username: "username",
            }
        }
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await updateUserDetails(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'  
        });
        jest.clearAllMocks();
    });

});


describe("USER CONTROLLER, GET USERS TO FOLLOW",()=>{
    
    it('should call the right procedure when fetching the users', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            }
        };        
        DB.exec.mockResolvedValue({recordset: []});
        await getUsersToFollow(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith(
            'usp_GetUnfollowedUsers',{
             user_id: reqMock.info.issuer,
            }
        )
        jest.clearAllMocks();
    });

    it('should return a list of users empty or not in an array', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            }
        };

        DB.exec.mockResolvedValue({recordset: []});
        await getUsersToFollow(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            users: []  
        });
       
        jest.clearAllMocks();
    });


    it('should return a 500 For Database Error found', async () => {
        const reqMock = {
            info: {
                issuer: "user_id",
            }
           
        }
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await getUsersToFollow(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'  
        });
        jest.clearAllMocks();
    });

});


describe("USER CONTROLLER, GET PROFILE",()=>{
    
    it('should get the info about a user', async () => {
        const reqMock = {
            info: {
                subject: "username",
            }
        };
        const user = [
            {}
        ]
 
            
        DB.exec.mockResolvedValue({recordset: user});
        await getUserProfile(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith(
            'usp_GetUserInfo',{
             username: reqMock.info.subject,
             user_id: ''
            }
        )
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            user: user[0]  
        });
       
        jest.clearAllMocks();
    });

 


    it('should return a 500 For Database Error found', async () => {
        const reqMock = {
            info: {
                subject: "username",
            }
        };
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await getUserProfile(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'  
        });
        jest.clearAllMocks();
    });

});