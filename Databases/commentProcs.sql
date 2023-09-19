CREATE OR ALTER PROCEDURE usp_CreateComment   
 @post_id VARCHAR(255),
 @username VARCHAR(255),
 @content VARCHAR(255)
AS  
BEGIN  
 IF NOT EXISTS (SELECT 1 FROM Post WHERE post_id = @post_id AND deleted=0)
	BEGIN
      SELECT 'Post with that ID not exist.' AS Message;
       RETURN;
    END
	INSERT INTO Comment(post_id,username,content)  
		VALUES(@post_id,@username, @content)
	SELECT 'Comment added successfully.' AS Message;
END;



GO
CREATE OR ALTER PROCEDURE usp_EditComment  
    @username VARCHAR(255),  
    @comment_id INT,  
    @content VARCHAR(255)  
AS  
BEGIN  
UPDATE Comment SET   
    content = @content,  
    edited_at = GETDATE()  
WHERE comment_id = @comment_id AND username = @username AND deleted = 0
END




GO
CREATE OR ALTER PROCEDURE usp_DeleteComment  
    @comment_id INT,  
    @username VARCHAR(255)  
AS  
BEGIN  
    IF EXISTS (SELECT 1 FROM Comment WHERE comment_id = @comment_id AND username = @username AND deleted = 0)  
    BEGIN  
        UPDATE Comment  
        SET deleted = 1  
        WHERE comment_id = @comment_id AND username = @username;
        UPDATE Comment
        SET deleted = 1
        WHERE level_1_comment_id = @comment_id;

        SELECT 'Comment deleted' AS Message;  
    END  
    ELSE  
    BEGIN  
        SELECT 'Comment not found' AS Message;  
    END  
END;




GO
CREATE OR ALTER PROCEDURE usp_CreateSubComment   
    @comment_id INT,
    @username VARCHAR(255),
    @content VARCHAR(255)
AS  
BEGIN  
    IF NOT EXISTS (SELECT 1 FROM Comment WHERE comment_id = @comment_id and deleted = 0 AND level_1_comment_id IS NULL)
    BEGIN
        SELECT 'Comment with that ID does not exist.' AS Message;
        RETURN;
    END
    INSERT INTO Comment (level_1_comment_id, username, content)  
    VALUES (@comment_id, @username, @content);
    SELECT 'Subcomment added successfully.' AS Message;
END;


GO
CREATE OR ALTER  PROCEDURE usp_GetUserComments  
@username VARCHAR(255)  
AS BEGIN  
SELECT   
    c.comment_id,  
    c.content,  
    c.created_at,  
    p.post_id,  
    p.content as post_content,  
    p.image_url,  
    p.created_at AS post_created_at,  
    p.edited_at AS post_edited_at  
FROM Comment AS c  
INNER JOIN Post AS p ON c.post_id = p.post_id AND p.deleted=0  
WHERE c.username = @username AND c.deleted = 0  
ORDER BY c.created_at;  
END  
