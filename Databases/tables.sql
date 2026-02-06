IF NOT EXISTS (
    SELECT 1 FROM sys.databases WHERE name = N'LINKUP'
)
BEGIN
    CREATE DATABASE LINKUP;
END;
GO

USE LINKUP;
GO

IF OBJECT_ID(N'[User]', N'U') IS NULL
BEGIN
    CREATE TABLE [User] (
        user_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255) DEFAULT N'https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg',
        joined_at DATETIME DEFAULT GETDATE(),
        bio VARCHAR(255)
    );
END;
GO

IF OBJECT_ID(N'Follow', N'U') IS NULL
BEGIN
    CREATE TABLE Follow (
        follower_id VARCHAR(255),
        following_id VARCHAR(255),
        CONSTRAINT FK_Follower FOREIGN KEY (follower_id) REFERENCES [User](user_id),
        CONSTRAINT FK_Following FOREIGN KEY (following_id) REFERENCES [User](user_id),
        CONSTRAINT UQ_Follower_Following PRIMARY KEY (follower_id, following_id)
    );
END;
GO

IF OBJECT_ID(N'Post', N'U') IS NULL
BEGIN
    CREATE TABLE Post(
        post_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        content NVARCHAR(1000),
        image_url VARCHAR(255),
        created_at DATETIME DEFAULT GETDATE(),
        deleted BIT DEFAULT 0,
        edited_at DATETIME,
        FOREIGN KEY (username) REFERENCES [User](username)
    );
END;
GO


IF OBJECT_ID(N'Comment', N'U') IS NULL
BEGIN
    CREATE TABLE Comment(
        comment_id INT PRIMARY KEY IDENTITY,
        content VARCHAR(255),
        created_at DATETIME DEFAULT GETDATE(),
        username VARCHAR(255),
        edited_at DATETIME,
        deleted BIT DEFAULT 0,
        post_id VARCHAR(255),
        level_1_comment_id INT,
        FOREIGN KEY (post_id) REFERENCES Post(post_id),
        FOREIGN KEY (username) REFERENCES [User](username),
        CONSTRAINT FK_Comment_ParentComment FOREIGN KEY (level_1_comment_id) REFERENCES Comment(comment_id)
    );
END;
GO

IF OBJECT_ID(N'[Like]', N'U') IS NULL
BEGIN
    CREATE TABLE [Like](
        like_id INT PRIMARY KEY IDENTITY,
        username VARCHAR(255),
        post_id VARCHAR(255),
        comment_id INT,
        CONSTRAINT CHK_EitherPostOrComment CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)),
        CONSTRAINT UQ_UserLike UNIQUE (username, post_id, comment_id)
    );
END;
GO

IF OBJECT_ID(N'ResetToken', N'U') IS NULL
BEGIN
    CREATE TABLE ResetToken (
      id INT PRIMARY KEY IDENTITY(1,1),
      username VARCHAR(255),
      token VARCHAR(15) NOT NULL,
      used BIT DEFAULT 0,
      FOREIGN KEY (username) REFERENCES [User](username)
    );
END;
GO


IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_username_user_id' AND object_id = OBJECT_ID('[User]'))
BEGIN
    CREATE NONCLUSTERED INDEX idx_username_user_id ON [User](username, user_id);
END;
GO

SELECT * FROM [User];
SELECT * FROM Follow;
SELECT * FROM Post;
SELECT * FROM Comment;
SELECT * FROM [Like];
SELECT * FROM ResetToken;