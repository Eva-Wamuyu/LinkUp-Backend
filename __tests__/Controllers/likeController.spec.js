import { DB } from '../../DBHelpers/index.js'; 
import { likePost,likeComment } from '../../Controllers/like.Controller.js';

const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));


describe("LIKE CONTROLLER - LIKE OR UNLIKE POST", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should return 404 if the Post is not found", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                post_id: "post_id"
            }
        }
        DB.exec.mockResolvedValue({ recordset: [{Message: "Post With that ID Not Found"}] });
        await likePost(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Post With that ID Not Found', 
        });
    })

    it("Should Like Post", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                post_id: "post_id"
            }
        }
        const message = "Post Liked"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await likePost(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

    it("Should Un Like Post", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                post_id: "post_id"
            }
        }
        const message = "Post UnLiked"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await likePost(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

})


describe("LIKE CONTROLLER - LIKE OR UNLIKE COMMENT", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should return 404 if the Comment is not found", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                comment_id: "comment_id"
            }
        }
        const message = 'Comment with that ID not found'
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await likeComment(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message 
        });
    })

    it("Should Like Comment", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                comment_id: "comment_id"
            }
        }
        const message = "Comment Liked"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await likeComment(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

    it("Should UnLike Comment", async()=>{
        const reqMock = {
            info: {
                subject: "subject"
            },
            params: {
                comment_id: "comment_id"
            }
        }
        const message = "Comment UnLiked"
        DB.exec.mockResolvedValue({ recordset: [{Message: message}] });
        await likeComment(reqMock,resMock)
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message 
        });
    })

})