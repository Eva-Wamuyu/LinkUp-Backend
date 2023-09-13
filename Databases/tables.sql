CREATE DATABASE LINKUP


USE LINKUP

CREATE TABLE [User] (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	profile_image VARCHAR(255),
	joined_at DATETIME DEFAULT GETDATE(),
	bio VARCHAR(255)
);
ALTER TABLE [User] ADD CONSTRAINT DefaulImg
DEFAULT N'https://res.cloudinary.com/dbddkobs4/image/upload/v1694112421/download_a9n1un.jpg'
FOR profile_image;

CREATE TABLE Follow (
	follower_id VARCHAR(255),
	following_id VARCHAR(255),
	CONSTRAINT FK_Follower FOREIGN KEY (Follower_Id) REFERENCES [User](user_id),
    CONSTRAINT FK_Following FOREIGN KEY (Following_Id) REFERENCES [User](user_id),
    CONSTRAINT UQ_Follower_Following PRIMARY KEY (Follower_Id, Following_Id)

);

CREATE TABLE Post(
	post_id VARCHAR(255) PRIMARY KEY,
	username VARCHAR(255),
	content NVARCHAR(1000),
	image_url VARCHAR(255),
	created_at DATETIME DEFAULT GETDATE(),
	deleted BIT DEFAULT 0,
	FOREIGN KEY (username) REFERENCES [User](username),
	edited_at DATETIME
);
ALTER TABLE Post
ALTER COLUMN username VARCHAR(255) NOT NULL;

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
	
);
ALTER TABLE Comment
ADD CONSTRAINT FK_Comment_ParentComment
FOREIGN KEY (level_1_comment_id)
REFERENCES Comment(comment_id);

CREATE TABLE [Like](
    like_id INT PRIMARY KEY IDENTITY,
	username VARCHAR(255),
	post_id VARCHAR(255),
	comment_id INT,
	CONSTRAINT CHK_EitherPostOrComment
        CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR
            (post_id IS NULL AND comment_id IS NOT NULL)),
    CONSTRAINT UQ_UserLike UNIQUE (username, post_id, comment_id)
);


select * from Follow
select * from [User]
select * from [Like]
select * from Comment
select * from Post

CREATE TABLE ResetToken (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(255),
  token VARCHAR(15) NOT NULL,
  FOREIGN KEY (username) REFERENCES [User](username)
);
