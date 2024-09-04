GO
CREATE OR ALTER PROCEDURE usp_CheckToken
@username VARCHAR(255),
@token VARCHAR(255)
AS
BEGIN
SELECT * FROM ResetToken WHERE username = @username AND token = @token AND used = 0;
END

GO
CREATE OR ALTER  PROCEDURE usp_AddToken  
@username VARCHAR(255),  
@token VARCHAR(15)  
AS BEGIN  
IF EXISTS (SELECT 1 FROM ResetToken WHERE username = @username)  
BEGIN  
    DELETE FROM ResetToken WHERE username = @username;  
END  
INSERT INTO ResetToken (username, token)  
VALUES (@username, @token);  
END;

GO
CREATE OR ALTER PROCEDURE usp_UpdatePassword
@username VARCHAR(255),
@password VARCHAR(255)
AS
BEGIN
UPDATE [User] SET password = @password WHERE username = @username
EXEC usp_MarkTokenAsUsed @username;
END


GO
CREATE OR ALTER PROCEDURE usp_MarkTokenAsUsed
@username VARCHAR(255)
AS
BEGIN
    UPDATE ResetToken SET used = 1 WHERE username = @username;
END;
