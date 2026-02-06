GO
CREATE OR ALTER PROCEDURE usp_CheckUserExists
    @username NVARCHAR(255),
    @email NVARCHAR(255)
AS
BEGIN
    DECLARE @Message NVARCHAR(255);
    SELECT TOP 1 
        @Message = CASE 
                    WHEN username = @username THEN 'Username already exists.'
                    WHEN email = @email THEN 'Email already exists.'
                   END
    FROM [User]
    WHERE username = @username OR email = @email;

    IF @Message IS NOT NULL
    BEGIN
        SELECT @Message AS Message;
        RETURN;
    END

    SELECT 'User can be registered.' AS Message;
END;

GO
CREATE OR ALTER PROCEDURE usp_AddUser
    @user_id VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    INSERT INTO [User] (user_id,username, email, password)
    OUTPUT INSERTED.user_id, INSERTED.username
    VALUES (@user_id, @username,@email, @password);
END;

GO
CREATE OR ALTER PROCEDURE usp_GetUserByMailOrUsername
    @emailOrUsername VARCHAR(255)
AS
BEGIN
    SELECT * from [User] where email = @emailOrUsername or username =  @emailOrUsername
END;

GO
CREATE OR ALTER PROCEDURE usp_GetUserInfo
    @username VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT 
        CASE WHEN f1.follower_id IS NOT NULL THEN 1 ELSE 0 END AS follows,
        CASE WHEN f2.following_id IS NOT NULL THEN 1 ELSE 0 END AS followed,
        COUNT(DISTINCT f3.follower_id) AS followers,
        COUNT(DISTINCT f4.following_id) AS following,
        COUNT(DISTINCT p.post_id) AS posts,
        u.profile_image,
        u.bio,
        u.joined_at,
        u.username,
        u.user_id
    FROM [User] u
    LEFT JOIN Follow f1 ON f1.follower_id = @user_id AND f1.following_id = u.user_id
    LEFT JOIN Follow f2 ON f2.follower_id = u.user_id AND f2.following_id = @user_id
    LEFT JOIN Follow f3 ON f3.following_id = u.user_id
    LEFT JOIN Follow f4 ON f4.follower_id = u.user_id
    LEFT JOIN Post p ON p.username = u.username AND p.deleted = 0
    WHERE u.username = @username
    GROUP BY u.user_id, u.username, u.profile_image, u.bio, u.joined_at, f1.follower_id, f2.following_id;
END;

GO
CREATE OR ALTER PROCEDURE usp_UpdateUserProfile
    @user_id VARCHAR(255),
    @profile_image VARCHAR(255) = NULL,
    @bio VARCHAR(255)
AS
BEGIN
    UPDATE [User]
    SET
        profile_image = CASE WHEN (@profile_image IS NULL OR @profile_image = '') THEN profile_image  ELSE @profile_image END,
        bio = @bio
    WHERE
        user_id = @user_id;
END;

GO

CREATE OR ALTER PROCEDURE usp_GetUnfollowedUsers
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT TOP 30
        u.user_id,
        u.username,
        u.profile_image,
        u.joined_at,
        u.bio,
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM Follow f
                WHERE f.follower_id = @user_id
                AND f.following_id = u.user_id
            ) THEN 1 
            ELSE 0
        END AS follows_user 
    FROM [User] u
    WHERE u.user_id <> @user_id
    ORDER BY u.username ASC
END;

GO
CREATE OR ALTER PROCEDURE usp_GetUserByUsername
    @username VARCHAR(255)
AS
BEGIN
    SELECT username from [User] WHERE username =  @username
END;

GO
CREATE OR ALTER PROCEDURE usp_GetUserByMail
    @email VARCHAR(255)
AS
BEGIN
    SELECT user_id,username,email from [User] where email = @email
END;
GO