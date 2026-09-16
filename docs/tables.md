-- create TABLE users(
    -- id int UNIQUE,
    -- name VARCHAR(250) NOT NULL,
    -- email VARCHAR(250),
    -- age int NOT NULL,
  --  status BOOLEAN DEFAULT TRUE
-- )

## 'describe users' 

'id','int','YES','UNI',NULL,''
'name','varchar(250)','NO','',NULL,''
'email','varchar(250)','YES','',NULL,''
'age','int','NO','',NULL,''
'status','tinyint(1)','YES','','1',''

## NOT NULL error

'''

INSERT INTO users(email,age)
VALUES ('michael@gmail.com',20)

'''

OUTPUT:MySQL Error (1364): Field 'name' doesn't have a default value 

