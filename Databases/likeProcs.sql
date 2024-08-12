GO
CREATE OR ALTER PROCEDURE usp_LikeorUnlikePost  
    @username VARCHAR(255),  
    @post_id VARCHAR(255)  
AS  
BEGIN  
    SET NOCOUNT ON;  
    IF NOT EXISTS (
        SELECT 1  
        FROM Post  
        WHERE post_id = @post_id AND deleted = 0
    )  
    BEGIN  
        SELECT 'Post With that ID Not Found' AS Message;  
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
        SELECT 'Post UnLiked' AS Message;  
    END  
    ELSE  
    BEGIN  
        INSERT INTO [Like] (username, post_id)  
        VALUES (@username, @post_id);  
        SELECT 'Post Liked' AS Message;  
    END  
END;

GO
CREATE OR ALTER PROCEDURE usp_LikeUnlikeComment   
    @comment_id VARCHAR(255),
    @username VARCHAR(255)
AS  
BEGIN  
    SET NOCOUNT ON;
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
    DECLARE @like_id INT;
    SELECT @like_id = like_id
    FROM [Like]
    WHERE username = @username
    AND comment_id = @comment_id;
    IF @like_id IS NOT NULL
    BEGIN
        DELETE FROM [Like]
        WHERE like_id = @like_id;
        SELECT 'Comment Unliked' AS Message;
    END
    ELSE
    BEGIN
        INSERT INTO [Like] (username, comment_id)
        VALUES (@username, @comment_id);
        SELECT 'Comment Liked' AS Message;
    END
END;
