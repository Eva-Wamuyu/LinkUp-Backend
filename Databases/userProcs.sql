CREATE OR ALTER PROCEDURE usp_CheckUserExists
    @username NVARCHAR(255),
    @email NVARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM [User] WHERE username = @username)
    BEGIN
        SELECT 'Username already exists.' AS Message
        RETURN;
    END
    IF EXISTS (SELECT 1 FROM [User] WHERE email = @email)
    BEGIN
        SELECT 'Email already exists.' AS Message
        RETURN;
    END

    SELECT 'User can be registered.' AS Message;
END

GO
CREATE OR ALTER PROCEDURE usp_AddUser
    @user_id VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    INSERT INTO [User] (user_id,username, email, password)
    VALUES (@user_id, @username,@email, @password);
    SELECT user_id,username FROM [User] WHERE user_id=@user_id
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
        CASE WHEN EXISTS (SELECT 1 FROM Follow WHERE follower_id = @user_id AND following_id = u.user_id) THEN 1 ELSE 0 END AS follows,
        CASE WHEN EXISTS (SELECT 1 FROM Follow WHERE follower_id = u.user_id AND following_id = @user_id) THEN 1 ELSE 0 END AS followed,
        (SELECT COUNT(*) FROM Follow WHERE following_id = u.user_id) AS followers,
        (SELECT COUNT(*) FROM Follow WHERE follower_id = u.user_id) AS following,
        (SELECT COUNT(*) FROM Post WHERE username = u.username AND deleted=0) AS posts,
        u.profile_image,
        u.bio AS bio,
        u.joined_at,
        u.username,
        u.user_id
    FROM [User] u
    WHERE u.username = @username;
END




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
END

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