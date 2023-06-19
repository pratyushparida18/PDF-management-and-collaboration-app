# PDF-management-and-collaboration-app

Link to the app:
```https://pdf-management-and-collaboration-app.vercel.app/```

##Platforms used for deployment

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


##Details of the routes present

