GO
CREATE OR ALTER PROCEDURE usp_LikeUnlikePost   
    @post_id VARCHAR(255),
    @username VARCHAR(255)
AS  
BEGIN  
    SET NOCOUNT ON;
    DECLARE @message VARCHAR(50);
    IF NOT EXISTS (
        SELECT 1
        FROM Post
        WHERE post_id = @post_id
        AND deleted = 0
    )
    BEGIN
        SELECT 'Post with that ID not found' AS Message;
        RETURN;
    END
    IF EXISTS (
        SELECT 1
        FROM [Like]
        WHERE username = @username
        AND post_id = @post_id
    )
    BEGIN
        DELETE FROM [Like]
        WHERE username = @username
        AND post_id = @post_id;
        SET @message = 'Post Unliked';
    END
    ELSE
    BEGIN
        INSERT INTO [Like] (username, comment_id)
        VALUES (@username, @post_id);
        SET @message = 'Post Liked';
    END
	Print @message
    SELECT @message AS Message;

END;


CREATE OR ALTER PROCEDURE usp_LikeUnlikeComment   
    @comment_id VARCHAR(255),
    @username VARCHAR(255)
AS  
BEGIN  
    SET NOCOUNT ON;
    DECLARE @message VARCHAR(50);
    IF NOT EXISTS (
        SELECT 1
        FROM Comment
        WHERE comment_id = @comment_id
        AND deleted = 0
    )
    BEGIN
        SELECT 'Comment with that ID not found' AS Message;
        RETURN;
    END
    IF EXISTS (
        SELECT 1
        FROM [Like]
        WHERE username = @username
        AND comment_id = @comment_id
    )
    BEGIN
        DELETE FROM [Like]
        WHERE username = @username
        AND comment_id = @comment_id;
        SET @message = 'Comment Unliked';
    END
    ELSE
    BEGIN
        INSERT INTO [Like] (username, comment_id)
        VALUES (@username, @comment_id);
        SET @message = 'Comment Liked';
    END
	Print @message
    SELECT @message AS Message;
END;
