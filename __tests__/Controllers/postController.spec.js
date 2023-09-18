import { DB } from '../../DBHelpers/index.js'; 
import { validatePostSchema } from '../../Validators/postValidators.js';
import { createPost,deletePost,editPost,getUserPosts,getAllPosts,getPostCommentDetails } from '../../Controllers/post.Controller.js';

const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

jest.mock('../../Validators/postValidators.js', () => ({
    validatePostSchema: {
      validate: jest.fn(),
    },
}));

jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));


describe("POST CONTROLLER - CREATE POST",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 201 if the post is created successfully', async()=>{
        const reqMock = {
            body: {
              content: "Funkdafiedhghgfvgvgftyftcfgct",
              image_url: "mm.jpg"
            },
            info:{
              issuer: "uuuid",
              subject: "username"
            }
        };
        validatePostSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: [1]});
        await createPost(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Post Added Successfully',
        });
    })

    it("Throws an error 422 If the Schema is not Valid",async()=>{
        const reqMock = {
            body: {
              content: "Funkdafied",
              image_url: ""
            },
            info:{
              issuer: "uuuid"
            }
        };
        validatePostSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await createPost(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
       
          message: 'Validation error',
        });

    })

   
})



describe("POST CONTROLLER - EDIT POST",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Throws an error 422 If the Schema is not Valid",async()=>{
        const reqMock = {
            body: {
              content: "Funkdafied",
              image_url: ""
            },
            info:{
              issuer: "uuuid"
            },
            params:{
               post_id: "postid"
            }
        };
        validatePostSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await editPost(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
         
          message: 'Validation error',
        });

    })

    it('should return a 200 if the post is edited successfully', async()=>{
        const reqMock = {
            body: {
              content: "Funkdafiedhghgfvgvgftyftcfgct",
              image_url: "mm.jpg"
            },
            info:{
              issuer: "uuuid",
              subject: "username"
            },
            params:{
              post_id: "postid"
           }
        };
        validatePostSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: 1});
        await editPost(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'ok',
            message: 'Post Updated successfully', 
        });
    })

    it('should return a 404 if post is with that ID is not Found', async()=>{
        const reqMock = {
            body: {
              content: "Funkdafiedhghgfvgvgftyftcfgct",
              image_url: "mm.jpg"
            },
            info:{
              issuer: "uuuid",
              subject: "username"
            },
            params:{
              post_id: "postid"
           }
        };
        validatePostSchema.validate.mockReturnValue({ error: null });
        await DB.exec.mockResolvedValue({ rowsAffected: []});
        await editPost(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(404);
        expect(resMock.json).toHaveBeenCalledWith({
           
            message: 'Post With that ID Belonging to that user not Found',
        });
    })
})


describe("POST CONTROLLER - DELETE POST",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return a 200 if the post is deleted successfully', async()=>{
      const reqMock = {
          info:{
            issuer: "uuuid",
            subject: "username"
          },
          params:{
            post_id: "postid"
         }
      };

      await DB.exec.mockResolvedValue({ recordset: [{ Message: 'Post deleted'}]});
      await deletePost(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        status: 'ok',
        message:'Post Deleted Successfully'
      });
  })

  it('should return a 404 if post is with that ID is not Found', async()=>{
      const reqMock = {
          info:{
            issuer: "uuuid",
            subject: "username"
          },
          params:{
            post_id: "postid"
         }
      };
      await DB.exec.mockResolvedValue({ recordset: [{Message: 'Post not found'}]});
      await deletePost(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        
          message: 'Post With that ID Belonging to that user not Found',
      });
  })
})



describe("POST CONTROLLER - GET USER POSTS",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return a 200 and posts if a user has them', async()=>{
      const reqMock = {
          info:{
          },
          params:{
            username: "username"
         }
      };

      const testPosts =  [{
        "post_id": "testingid1",
        "username": "LaurynHill",
        "created_at": "2023-09-09T16:57:43.630Z",
        "num_likes": 0,
        "num_comments": 0,
        "content": "testing contentntjntjrnjnrj",
        "image_url_post": "incdjnjne.jpg",
        "image_url_user": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "has_liked": false
      },
      {
        "post_id": "testingid1",
        "username": "LaurynHill",
        "created_at": "2023-09-09T16:57:43.630Z",
        "num_likes": 0,
        "num_comments": 0,
        "content": "testing contentntjntjrnjnrj",
        "image_url_post": "incdjnjne.jpg",
        "image_url_user": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "has_liked": false
      }]
    
      await DB.exec.mockResolvedValue({ rowsAffected: [2,2], recordset: testPosts});
      await getUserPosts(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        status: 'ok',
        posts: testPosts
      });
  })

  it('should return an empty array if that user got no posts', async()=>{
      const reqMock = {
          info:{
          },
          params:{
            post_id: "postid"
         }
      };
      await DB.exec.mockResolvedValue({ rowsAffected: [1], recordset: []});
      await getUserPosts(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        status: "ok",       
        posts: []
      });
  })


  it('should return 404 if that user is not found', async()=>{
    const reqMock = {
        info:{
        },
        params:{
          post_id: "postid"
       }
    };
    await DB.exec.mockResolvedValue({ rowsAffected: [0]});
    await getUserPosts(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
      message: 'User Not Found'
    });
})
})


describe("POST CONTROLLER - GET ALL POSTS",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should return a 200 and posts they are found', async()=>{
      const reqMock = {
          info:{
          },
      };

      const testPosts =  [{
        "post_id": "testingid1",
        "username": "LaurynHill",
        "created_at": "2023-09-09T16:57:43.630Z",
        "num_likes": 0,
        "num_comments": 0,
        "content": "testing contentntjntjrnjnrj",
        "image_url_post": "incdjnjne.jpg",
        "image_url_user": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "has_liked": false
      },
      {
        "post_id": "testingid1",
        "username": "LaurynHill",
        "created_at": "2023-09-09T16:57:43.630Z",
        "num_likes": 0,
        "num_comments": 0,
        "content": "testing contentntjntjrnjnrj",
        "image_url_post": "incdjnjne.jpg",
        "image_url_user": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "has_liked": false
      }]
    
      await DB.exec.mockResolvedValue({ recordset: testPosts});
      await getAllPosts(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        status: 'ok',
        posts: testPosts
      });
  })

  it('should return a 200 and an empty array if there are no posts', async()=>{
      const reqMock = {
          info:{
          } 
      };
      await DB.exec.mockResolvedValue({ recordset: []});
      await getAllPosts(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        status: "ok",
        posts: []
      });
  })
})


describe("POST CONTROLLER - POST DETAILS i.e Comments And Subcomments",()=>{
  afterEach(() => {
      jest.clearAllMocks();
  });


  it('should return a 404 that post is not Found', async()=>{
    const reqMock = {
        info:{
        },
        params:{
          post_id: "idnotfound",
        }
    };
    await DB.exec.mockResolvedValue({ rowsAffected: [0]});
    await getPostCommentDetails(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
    
      message: 'Post With That Id Not Found'
    });
  })


  it('should return a 200 the post, the comments and subcomments', async()=>{
      const reqMock = {
          info:{
          },
          params: {
            post_id: "post0-id"
          }
      };
      const testPost = {
        "post_id": "post0-id",
        "username": "LaurynHill",
        "created_at": "2023-09-09T16:57:43.630Z",
        "num_likes": 0,
        "num_comments": 0,
        "content": "testing contentntjntjrnjnrj",
        "image_url_post": "incdjnjne.jpg",
        "image_url_user": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "has_liked": false
      };
      const testComments = [{
      "comment_id": 1,
        "content": "Right",
        "created_at": "2023-09-08T16:30:03.743Z",
        "edited_at": "2023-09-09T09:40:08.303Z",
        "username": "ninasimone",
        "userLiked": 0,
        "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
        "level_1_comment_id": null,
        "likes_count": 1,
        "subcomments": [
            {
                "comment_id": 3,
                "content": "Yooh2",
                "created_at": "2023-09-09T12:09:04.920Z",
                "edited_at": null,
                "username": "ninasimone",
                "userLiked": 0,
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "level_1_comment_id": 1,
                "likes_count": 0
            },
            {
                "comment_id": 8,
                "content": "I agree with you",
                "created_at": "2023-09-09T13:54:47.940Z",
                "edited_at": null,
                "username": "ninasimone",
                "userLiked": 0,
                "profile_image": "https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg",
                "level_1_comment_id": 1,
                "likes_count": 0
            }]}];

        await DB.exec.mockResolvedValue({ rowsAffected: [1], recordset: testComments})

        await getPostCommentDetails(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(200);
        // expect(resMock.json).toHaveBeenCalledWith({
        //       status: 'ok',
        //       post: testPost,
        //       comments: testComments
  
        // });
  })

  


})