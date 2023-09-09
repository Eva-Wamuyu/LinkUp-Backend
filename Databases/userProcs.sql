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