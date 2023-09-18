GO
CREATE OR ALTER  PROCEDURE usp_LikeorUnlikePost  
    @username VARCHAR(255),  
    @post_id VARCHAR(255)  
AS  
BEGIN  
    SET NOCOUNT ON;  
      
    DECLARE @postExists BIT  
    SELECT @postExists = CASE WHEN EXISTS (  
        SELECT 1  
        FROM Post  
        WHERE post_id = @post_id AND deleted = 0  
    ) THEN 1 ELSE 0 END  
      
    IF @postExists = 1  
    BEGIN  
        DECLARE @like_id INT  
        SELECT @like_id = like_id  
        FROM [Like]  
        WHERE username = @username  
            AND post_id = @post_id  
          
        IF @like_id IS NULL  
        BEGIN  
            INSERT INTO [Like] (username, post_id)  
            VALUES (@username, @post_id)  
   SELECT 'Post Liked' AS Message;  
        END  
        ELSE  
        BEGIN  
            DELETE FROM [Like]  
            WHERE like_id = @like_id  
   SELECT 'Post UnLiked' AS Message;  
        END  
    END  
    ELSE  
    BEGIN  
     SELECT 'Post With that ID Not Found' AS Message;  
    END  
END  

GO
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
