import { DB } from '../../DBHelpers/index.js';
import { validateCommentSchema } from '../../Validators/commentValidators.js';
import {createComment, editComment,deleteComment,createSubComment,getUserComments } from '../../Controllers/comment.Controller.js';

jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));

jest.mock('../../Validators/commentValidators.js', () => ({
    validateCommentSchema: {
      validate: jest.fn(),
    },
}));
const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};
afterEach(() => {
    jest.clearAllMocks();
});

describe("COMMENTS CONTROLLER- CREATE SUBCOMMENT", () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it ("Should raise error for invalid inputs", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               comment_id: "123",
            }
        }
        validateCommentSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await createSubComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Validation error',
        });

    })

    it ("Should Creaate A subComment and return 200", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               comment_id: "123",
            }
        }
        const message = 'Subcomment added successfully.'
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await createSubComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message
          });
    })
   

    it ("Should raise error If the comment is not found", async() => {
        const reqMock = {
            info: {
                subject: "username",
                issuer: "id"
            },
            body:{
               content: "test comment"
            },
            params:{
               post_id: "1231",
            }
        }
        const message = 'Comment with that ID does not exist.'
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await createSubComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message
          });
        

    })

    it ("Should raise error 500 for DB error ", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               comment_id: "1231",
            }
        }
        
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await createSubComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'
          });
        
    })
})
describe("COMMENTS CONTROLLER- DELETE COMMENT", () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    it ("Should delete a comment", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            params:{
               comment_id: 123,
            }
        }
        const message = 'Comment deleted'
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await deleteComment(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith('usp_DeleteComment',{
            username: reqMock.info.subject,
            comment_id: reqMock.params.comment_id,        
          });
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message:'Comment Deleted Successfully'
          });
    })
   

    it ("Should raise error If the comment is not found", async() => {
        const reqMock = {
            info: {
                subject: "username",
                issuer: "id"
            },
            body:{
               content: "test comment"
            },
            params:{
               comment_id: "1231",
            }
        }
        const message = 'Comment not found'
       
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await deleteComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Comment With that ID Belonging to that user not Found', 
          });
        

    })

    it ("Should raise error 500 for DB error ", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               comemnt_id: "1231",
            }
        }
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await deleteComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            
            message: 'Internal Server Error'
          });
        
    })
})

describe("COMMENTS CONTROLLER- EDIT COMMENT", () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it ("Should raise error for invalid inputs", async() => {
        const reqMock = {}
        validateCommentSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await editComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          message: 'Validation error',
        });
    })

    it ("Should Edit a Comment and return 200", async() => {
        const req = {
            params:{
                comment_id: 123,
            },
            info: {
                subject: "username",
            },
            body:{
               content: "party dont stop"
            },
        }
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: [ 1 ] });
        await editComment(req, resMock);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Comment Updated Successfully',        
          });
        expect(DB.exec).toHaveBeenCalledWith('usp_EditComment', {
            username: req.info.subject,
            comment_id: req.params.comment_id,
            content: req.body.content,
        });
        expect(resMock.status).toHaveBeenCalledWith(200);
    })
   

    it ("Should raise error If the comment is not found", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               comment_id: "1231",
            }
        }
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: [0]});
        await editComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Comment With that ID Belonging to that user not Found',
          });
    })



   
    it ("Should raise error 500 for DB error ", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
                comment_id: 12
            }   
        }
        
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await editComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'
          });
        
    })
})

describe("COMMENTS CONTROLLER- CREATE COMMENT", () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it ("Should raise error for invalid inputs", async() => {
        const reqMock = {}
        validateCommentSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await createComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
         
          message: 'Validation error',
        });

    })

    it ("Should Creaate a Comment", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            params:{
               post_id: "123",
            }
        }
        const message = 'Comment added successfully.'
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await createComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message
          });
    })
   

    it ("Should raise error If the post the comment is meant for is not found", async() => {
        const reqMock = {
            info: {
                subject: "username",
                issuer: "id"
            },
            body:{
               content: "test comment"
            },
            params:{
               post_id: "1231",
            }
        }
        const message = 'Post with that ID not exist.'
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ recordset: [{Message: message}]});
        await createComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message
          });
        
        jest.clearAllMocks();
    })

    it ("Should raise error 500 for DB error ", async() => {
        const reqMock = {
            info: {
                subject: "username",
            },
            body:{
               content: "test comment"
            },
            // params:{
            //    post_id: "1231",
            // }
        }
        
        validateCommentSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await createComment(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            
            message: 'Internal Server Error'
          });
        jest.clearAllMocks();
    })
})


describe("COMMENTS CONTROLLER- GET USER COMMENTS", () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it ("Should execute the get user proc", async() => {
        const reqMock = {
            params :{
                username: "username",
            }
        }
        await DB.exec.mockResolvedValue({ rowsAffected: [0]});
        await getUserComments(reqMock, resMock);
        expect(DB.exec).toHaveBeenCalledWith('usp_GetUserByUsername', {
            username: reqMock.params.username,
        });
        

    })

    it ("Should raise error if user is not found", async() => {
        const reqMock = {
            params :{
                username: "username",
            }
        }
        await DB.exec.mockResolvedValue({ rowsAffected: [0]});
        await getUserComments(reqMock, resMock);
       
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
            message: 'User not found', 
        });

    })

    it ("Should return an empty list if no comments for that user are found", async() => {
        const reqMock = {
            params:{
                username: "username",
            }
        }
        await DB.exec.mockResolvedValue({ rowsAffected: [1],recordset:[]});    
        await getUserComments(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            comments: []
          });
    })
   

    it ("Should return comments in a list if the user has comments", async() => {
        const reqMock = {
            params:{
               usermame: "1231",
            }
        }
        const testresult = [
            {
                "comment_id": 25,
                "content": "nnjnjn",
                "created_at": "2023-09-11T18:53:06.023Z",
                "post_id": "d45ec4cb-326c-4bcf-b582-8eeaf43a1bf7",
                "post_content": "In the world of code, where lines entwine,\nPython shines, a language so fine.\nWith indentations, clean and neat,\nIt makes your programs quite a treat.\n\nNo curly braces, just colons and space,\nReadability is its embrace.\nFrom beginners to experts, it's adored,\nIn the world of coding, it's often explored",
                "image_url": "https://w7.pngwing.com/pngs/585/822/png-transparent-python-scalable-graphics-logo-javascript-creative-dimensional-code-angle-text-rectangle-thumbnail.png",
                "post_created_at": "2023-09-10T13:49:42.687Z",
                "post_edited_at": null
            },
            {
                "comment_id": 26,
                "content": "m",
                "created_at": "2023-09-11T18:54:18.977Z",
                "post_id": "d45ec4cb-326c-4bcf-b582-8eeaf43a1bf7",
                "post_content": "In the world of code, where lines entwine,\nPython shines, a language so fine.\nWith indentations, clean and neat,\nIt makes your programs quite a treat.\n\nNo curly braces, just colons and space,\nReadability is its embrace.\nFrom beginners to experts, it's adored,\nIn the world of coding, it's often explored",
                "image_url": "https://w7.pngwing.com/pngs/585/822/png-transparent-python-scalable-graphics-logo-javascript-creative-dimensional-code-angle-text-rectangle-thumbnail.png",
                "post_created_at": "2023-09-10T13:49:42.687Z",
                "post_edited_at": null
            }]
        await DB.exec.mockResolvedValue({ rowsAffected: [1],recordset:testresult}); 
        
        await getUserComments(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: "ok",
            comments: testresult
          });
        

    })

    it ("Should raise error 500 for DB error ", async() => {
        const reqMock = {
            params:{
               usermame: "1231",
            }
        }
        
        await DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await getUserComments(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
            
            message: 'Internal Server Error'
          });
        
    })
})





