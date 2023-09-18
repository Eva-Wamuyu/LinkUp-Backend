import { DB } from '../../DBHelpers/index.js'; 
import { followUser,getFollowers,getFollowing } from '../../Controllers/follow.Controller.js';

const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));
afterEach(() => {
    jest.clearAllMocks();
});

describe("FOLLOW CONTROLLER - FOLLOW OR UNFOLLOW USER", () => {
   
    it("Should return 404 if the User being followed is not found", async()=>{
        const reqMock = {
            info: {
                issuer: "follower_id"
            },
            params: {
                user_id: "following_id"
            }
        }
        const message = 'User with that Id not Found'
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await followUser(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message
        });
    })

    it("Should Follow A User", async()=>{
        const reqMock = {
            info: {
                issuer: "follower_id"
            },
            params: {
                user_id: "following_id"
            }
        }
        const message = "User Followed"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await followUser(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

    it("Should UnFollow A User", async()=>{
        const reqMock = {
            info: {
                issuer: "follower_id"
            },
            params: {
                user_id: "following_id"
            }
        }
        const message = "User Unfollowed"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await followUser(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

    it("Should Throw 500 for DB Error", async()=>{
        const reqMock = {
            info: {
                issuer: "follower_id"
            },
            params: {
                user_id: "following_id"
            }
        }
        const message = "Internal Server Error"
        await DB.exec.mockRejectedValueOnce(new Error(message));
        await followUser(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message 
        });
    })

})


describe("FOLLOW CONTROLLER - GET FOLLOWERS", () => {
   
    it("Should return a list of followers if there are users", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        const followers = [
            {
                "user_id": "1b194034-e347-42e9-9610-b786044ea4eb",
                "username": "ninasimone2",
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "follows_back": 0
            },
            {
                "user_id": "561255e7-dc57-490f-850f-882dfb53ca28",
                "username": "geokilambeomayra",
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "follows_back": 0
            }
        ]
        
        DB.exec.mockResolvedValue({ recordset: followers });
        await getFollowers(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: "ok",
            followers
        });
    })

    it("Should return an empty array if the user has no followers A User", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        DB.exec.mockResolvedValue({ recordset: [] });
        await getFollowers(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            followers: [] 
        });
    })

    it("Should Throw 500 for DB Error", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        const message = "Internal Server Error"
        await DB.exec.mockRejectedValueOnce(new Error(message));
        await getFollowers(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message 
        });
    })

})


describe("FOLLOW CONTROLLER - GET FOLLOWING", () => {
   
    it("Should return a list of followers if there are users", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        const following = [
            {
                "user_id": "1b194034-e347-42e9-9610-b786044ea4eb",
                "username": "ninasimone2",
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "follows_back": 0
            },
            {
                "user_id": "561255e7-dc57-490f-850f-882dfb53ca28",
                "username": "geokilambeomayra",
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "follows_back": 0
            }
        ]
        
        DB.exec.mockResolvedValue({ recordset: following });
        await getFollowing(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: "ok",
            following
        });
    })

    it("Should return an empty array if the user has no following", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        DB.exec.mockResolvedValue({ recordset: [] });
        await getFollowing(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            following: [] 
        });
    })

    it("Should Throw 500 for DB Error", async()=>{
        const reqMock = {
            info: {
                issuer: "user_id"
            }
        }
        const message = "Internal Server Error"
        await DB.exec.mockRejectedValueOnce(new Error(message));
        await getFollowing(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message 
        });
    })

})