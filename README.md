# AnchorEncrypt_site
I made site where you can encrypt and decrypt files from your profile. For an API I used NestJS (Node.js framework). For frontend I used Next.js (React framework).

# At first
You should add .env files to Frontend and Backend folders to set environment variables. <br>
(If you want to change running port for Frontend you should write in console SET PORT=*your_port* from where you will run Frontend)


.env file for Frontend should look like:
```
CIPHER_KEY=key

API_ADDRESS=http://127.0.0.1:8080
```

.env file for Backend should look like:
```
PORT=8080
CIPHER_KEY=key

SIGNM15=AG2EF1-NCJN1-115DD
SIGND15=H2F1E-5VQ9L-BYTVP

DB_USER=postgres
DB_HOST=127.0.0.1
DB_NAME=AnchorEncrypt
DB_PASSWORD=root
DB_PORT=5432

POST_HOST=smtp.ethereal.email
POST_USER=anchot-encrypt@ethereal.email
POST_PASSWORD=jn7jnAPss4f63QBp6D
POST_PORT=587
```

# Frontend 
Frontend is written on Next.js, that's why you should install Next.js before running Frontend's part of site.<br>
(To install it look: https://nextjs.org/docs/getting-started/installation)

After installation, to run Frontend you should write in console from folder with Frontend:
```
npm run build
npm run dev
```
That will build project to it's optimized version in a first line and then run Frontend part by second line.

All pages're located in `./Frontend/src/app`: <br>
`/app` has main page with site info. <br>
`/app/agent` has page with log in/sign in functional. <br>
`/app/crytion` has page with encryption/decryption functional. <br>
`/app/department` has page with password reset functional (to send email for reset). <br>
`/app/profile` has page with logged user info and it's change functional. <br>
`/app/recovery` has page with password reset functional (to reset password by token from email). <br>
<br>
<br>
PS <br>
In my opinion, my code isn't optimized, that's why there are many copypaste parts. <br>
If you want to run site for real production, I would definitely recommed make code review and move all repeating part into separate files.

# Backend
Backend is written on NestJS, that's why you should install Node.js and NestJS before running Backend's part of site.<br>
(To install it look: https://docs.nestjs.com/first-steps)

After installation, to run Backend's API you should write in console from folder with Backend:
```
npm run start
```
That will run Backend part.

All code files located in `./Backend/src`: <br>
`DTOs.ts` contains all data transfer objects. <br>
`app.controller.ts` contains default Nest contoller with all endpoints. <br>
`app.module.ts` contains Nest backend module definition. <br>
`app.service.ts` contains all services for endpoints. <br>
`db.ts` contains db class (Pool). <br>
`main.ts` contains Nest's bootstrap. <br>
<br>
<br>
PS <br>
In my opinion, my backend code isn't optimized too. <br>
For production I would recommend separate monolith backend module into many modules to make the application architecture more accurate.

# Last words
Yes, that's my first Next+Nest site, that's why I was writing monolith code with out great optimization. <br>
Despite having the little experience, I think, that site looks great and can be used for production deployment. <br>
There are many css styles there, all html parts are responsive. 

# Screenshots
<div align="center">
  <img src="https://github.com/user-attachments/assets/e54a721a-846c-4190-ace7-a7b03ef5a6ce" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/fe353398-f62b-44cc-bffa-4bd16d877e5f" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/4dd1b926-4d93-4067-946c-2bfbde6ab450" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/ab5ef2e9-172d-4fc9-a09c-d85377bd6b74" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/c158cb6c-dcfa-40f8-8d79-2223048513e3" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/87f3820b-d7ea-4f1e-b128-8f3d23ba992b" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/4ff735af-fb87-4633-b583-0fc0c7a25673" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/0bb5055b-0048-48be-96e1-122eeb44dda9" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/0ba753c0-7e91-4c38-99ba-ffa053a71f52" width="405vw" height="250vw">
  <img src="https://github.com/user-attachments/assets/5d350f95-338c-4567-9cdc-7a0e44f5b40a" width="405vw" height="250vw">
</div>



