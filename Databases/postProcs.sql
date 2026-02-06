CREATE OR ALTER PROCEDURE usp_CreatePost
	@post_id VARCHAR(255),
	@username VARCHAR(255),
    @content nvarchar(1000),
	@image_url VARCHAR(255)
AS
BEGIN
	INSERT INTO Post(post_id, username, content,image_url)
	VALUES
	(@post_id,@username, @content,@image_url)
END;


GO
CREATE OR ALTER PROCEDURE usp_EditPost
    @username VARCHAR(255),
	@post_id VARCHAR(255),
	@content NVARCHAR(255),
	@image_url VARCHAR(255)
AS
	BEGIN
	UPDATE Post SET 
	content = @content,
	image_url = @image_url,
	edited_at = GETDATE()
	WHERE post_id = @post_id and username = @username AND deleted=0
END;


GO
CREATE OR ALTER  PROCEDURE usp_DeletePost  
    @post_id VARCHAR(255),  
	@username VARCHAR(255)  
AS  
BEGIN  
    IF EXISTS (SELECT 1 FROM Post WHERE post_id = @post_id AND username = @username AND deleted = 0)  
    BEGIN  
        UPDATE Post  
        SET deleted = 1  
        WHERE post_id = @post_id AND username = @username;
		UPDATE Comment    
        SET deleted = 1    
        WHERE post_id = @post_id
        UPDATE Comment
        SET deleted = 1
        WHERE level_1_comment_id IN (SELECT comment_id FROM Comment WHERE post_id = @post_id);
        SELECT 'Post deleted' AS Message;  
    END  
    ELSE  
    BEGIN  
        SELECT 'Post not found' AS Message;  
    END  
END;  
  


GO
CREATE OR ALTER PROCEDURE usp_getAllPosts
    @username VARCHAR(255)
AS
BEGIN
    CREATE TABLE #TempPosts (
        post_id VARCHAR(255),
        username VARCHAR(255),
        created_at DATETIME,
        num_likes INT,
        num_comments INT,
        content NVARCHAR(1000),
        image_url_post VARCHAR(255), 
        image_url_user VARCHAR(255), 
        has_liked BIT
    );
    
    INSERT INTO #TempPosts (post_id, username, created_at, num_likes, num_comments, content, image_url_post, image_url_user, has_liked)
    SELECT
        P.post_id,
        U.username,
        P.created_at,
        (
            SELECT COUNT(*) FROM [Like] L1
            WHERE L1.post_id = P.post_id
        ) AS likes,
        (
            SELECT COUNT(*) FROM Comment C1
            WHERE C1.post_id = P.post_id
        ) AS comments,
        P.content,
        P.image_url AS image_url_post,
        U.profile_image AS image_url_user, 
        CASE WHEN EXISTS (
            SELECT 1 FROM [Like] L2
            WHERE L2.post_id = P.post_id AND L2.username = @username 
        ) THEN 1 ELSE 0 END AS has_liked
    FROM Post P 
    INNER JOIN [User] U ON P.username = U.username
    WHERE P.deleted = 0
     

    SELECT * FROM #TempPosts;

    DROP TABLE #TempPosts;
END;

GO
CREATE OR ALTER PROCEDURE usp_getAllUserPosts
    @username VARCHAR(255),
    @username2 VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    ;WITH PostDetails AS (
        SELECT
            P.post_id,
            P.username,
            P.created_at,
            P.content,
            P.image_url AS image_url_post,
            U.profile_image AS image_url_user,
            COALESCE(L.likes_count, 0) AS num_likes,
            COALESCE(C.comments_count, 0) AS num_comments,
            CASE WHEN L2.username IS NOT NULL THEN 1 ELSE 0 END AS has_liked
        FROM Post P
        INNER JOIN [User] U ON P.username = U.username
        LEFT JOIN (
            SELECT post_id, COUNT(*) AS likes_count
            FROM [Like]
            GROUP BY post_id
        ) L ON P.post_id = L.post_id
        LEFT JOIN (
            SELECT post_id, COUNT(*) AS comments_count
            FROM Comment
            GROUP BY post_id
        ) C ON P.post_id = C.post_id
        LEFT JOIN [Like] L2 ON P.post_id = L2.post_id AND L2.username = @username2
        WHERE P.deleted = 0
        AND P.username = @username
    )
    SELECT
        post_id,
        username,
        created_at,
        num_likes,
        num_comments,
        content,
        image_url_post,
        image_url_user,
        has_liked
    FROM PostDetails;
END;



GO
CREATE OR ALTER PROCEDURE usp_GetPostById
    @post_id VARCHAR(255),
    @username VARCHAR(255)
AS
BEGIN
    SELECT
        P.post_id,
        P.content,
        P.edited_at,
        P.image_url AS image_url_post,
        U.username,
        U.profile_image AS image_url_user,
        P.created_at,
        (
            SELECT COUNT(*) 
            FROM [Like] L 
            WHERE L.post_id = P.post_id
        ) AS num_likes,
        (
            SELECT COUNT(*) 
            FROM Comment C 
            WHERE C.post_id = P.post_id AND C.deleted = 0
        ) AS num_comments,
        CASE WHEN L.like_id IS NOT NULL THEN 1 ELSE 0 END AS has_liked
    FROM Post P
    INNER JOIN [User] U ON P.username = U.username
    LEFT JOIN [Like] L ON P.post_id = L.post_id AND L.username = @username
    WHERE P.post_id = @post_id AND P.deleted = 0;
END
GO


GO
CREATE OR ALTER PROCEDURE usp_GetPostDetails
    @post_id VARCHAR(255),
    @username VARCHAR(255)
AS
BEGIN
    WITH CommentsAndSubs AS (
        SELECT
            C.comment_id,
            C.content ,
            C.created_at,
            C.edited_at,
            U.username,
            U.profile_image,
            CASE WHEN L.like_id IS NOT NULL THEN 1 ELSE 0 END AS has_liked,
            C.level_1_comment_id,
            (
                SELECT COUNT(*) 
                FROM [Like] L 
                WHERE L.comment_id = C.comment_id
            ) AS likes_count
        FROM Comment C
        INNER JOIN [User] U ON C.username = U.username
        LEFT JOIN [Like] L ON C.comment_id = L.comment_id AND L.username = @username
        WHERE (C.post_id = @post_id OR C.level_1_comment_id IS NOT NULL) AND C.deleted = 0
    )
    SELECT
        CS.comment_id,
        CS.content,
        CS.created_at,
        CS.edited_at,
        CS.username,
        CS.has_liked,
        CS.profile_image,
        CS.level_1_comment_id,
        CS.likes_count
    FROM CommentsAndSubs CS
    ORDER BY COALESCE(CS.level_1_comment_id, CS.comment_id), CS.comment_id;
END
GO


CREATE OR ALTER PROCEDURE usp_GetFollowedUsersPosts
    @username VARCHAR(255)
AS
BEGIN
    SELECT 
        p.post_id,
        p.username,
        p.content,
        p.image_url,
        p.created_at,
        p.edited_at
    FROM 
        Post p
    INNER JOIN 
        [User] u_followed ON p.username = u_followed.username
    INNER JOIN 
        Follow f ON f.following_id = u_followed.user_id
    INNER JOIN 
        [User] u_follower ON f.follower_id = u_follower.user_id
    WHERE 
        u_follower.username = @username
        AND p.deleted = 0 
    ORDER BY 
        p.created_at DESC;
END;
GO