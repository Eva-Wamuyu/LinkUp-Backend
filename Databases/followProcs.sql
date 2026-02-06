GO
CREATE OR ALTER PROCEDURE usp_FollowOrUnfollowUser
    @follower_id VARCHAR(255),
    @following_id VARCHAR(255)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [User] WHERE user_id = @follower_id)
    BEGIN
        SELECT 'Follower user with that Id not Found' AS Message;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM [User] WHERE user_id = @following_id)
    BEGIN
        SELECT 'Following user with that Id not Found' AS Message;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Follow WHERE follower_id = @follower_id AND following_id = @following_id)
    BEGIN
        DELETE FROM Follow WHERE follower_id = @follower_id AND following_id = @following_id;
        SELECT 'User Unfollowed' AS Message;
    END
    ELSE
    BEGIN
        INSERT INTO Follow (follower_id, following_id)
        VALUES (@follower_id, @following_id);
        SELECT 'User Followed' AS Message;
    END
END;


GO
CREATE OR ALTER PROCEDURE usp_GetFollowing
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT
        U.user_id AS user_id,
        U.username AS username,
		U.profile_image,
        CASE
            WHEN F2.follower_id IS NOT NULL THEN 1 
            ELSE 0
        END AS follows_back
    FROM
        [User] U
    LEFT JOIN
        Follow F1 ON U.user_id = F1.following_id
    LEFT JOIN
        Follow F2 ON U.user_id = F2.follower_id AND F2.following_id = @user_id
    WHERE
        F1.follower_id = @user_id;
END;



GO
CREATE OR ALTER PROCEDURE usp_GetFollowers
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT
        U.user_id AS user_id,
        U.username AS username,
		U.profile_image,
        CASE
            WHEN F2.follower_id IS NOT NULL THEN 1
            ELSE 0 
        END AS follows_back
    FROM
        [User] U
    LEFT JOIN
        Follow F1 ON U.user_id = F1.follower_id
    LEFT JOIN
        Follow F2 ON U.user_id = F2.following_id AND F2.follower_id = @user_id
    WHERE
        F1.following_id = @user_id;
END;
GO