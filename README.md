# PDF-management-and-collaboration-app

Link to the app:
```https://pdf-management-and-collaboration-app.vercel.app/```

## Description

This app serves as a platform for storing and viewing PDF files through a user-friendly dashboard. It provides the functionality to share links with others, enabling them to access and view the PDF files. Additionally, users can invite others to collaborate by granting them access to view and add comments to the PDF files.

## Platforms used for deployment

- Frontend: vercel
- backend: render

## Technologies Used

- Frontend: React.js
- Server: FastAPI
- Database: MongoDB

## Steps to Run the App

### Frontend

1. Browse to the `client` folder.

2. Run the following command in the command line:
```bash
npm start
```

This will start the frontend of the app.

### Backend

1. Browse to the `server` folder.

2. Add your MongoDB Atlas connection string in `auth/controllers/auth.py` and `app/controllers/app_controllers.py`.

3. Activate your Python virtual environment.

4. Run the following command in the command line:
```bash
python -m uvicorn main:app --reload
```

This will start the backend of the app.


## Details of the routes present

### auth routes

- /signup - When an user enters 'email' , 'password' and 're-enter password' , this routes checks if both the passwords are same or not. If they are same the password is hashed using hashlib and is stored in the mongo db database.

- /login - When an user enters 'email' and 'password' , this route fetches password from the record containing corresponding email, decodes the password and checks if the password entered and the password present in mongo db database are same or not. If they are same then the user logs in into home page else error will be shown.

- /reset_password - When an user enters 'email' , 'password' and 're-enter password' , this routes checks if both the passwords are same or not. If they are same , the record is searched for the corresponding email. Then it hashes the password and updates the password field. 

### app routes

- /upload - This route takes the pdf file from the frontend and uploads it to mongo db database using gridfs.

- /getfiles - This route sends all file details present in database to frontend so that it can be displayed in the frontend in a tabular format.

- /singleFileData - When a user search for a particular file present in the database, this route sends the file details to the frontend for a particular file

- /get_file_preview - This route returns the file data as Streamingresponse object so that it can be shown in the frontend

- /invitations - When a user invites someone by entering the person's email in invite section , this route will search for the record containing the corresponding email and update the invitaions field with inviteURL sender email and fileid

- /uniqueIdCheck - This route updates the invite id belonging to corresponding user in the database.

- /save_comment - This route saves comment entered by the invited user in the database. 


## Details of the frontend

- App.js - This file contains the routes used in the application

- Components folder - This folder contains the components used in the application
  - HomePage.js - This file is the landing page of the app
  - auth folder - This folder contains the authentication pages i.e, signup, login and forgot password and the corresponding css file
  - FileUpload.js - This file contains the code for uploading PDF files.
  - DisplayFiles folder - This folder contains files of the code for the search feature and dashboard and corresponding css file
  - sidebar - This folder contains files of the code for the sidebar showing invited requests for commenting
 
 

