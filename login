theia@theia-larrysonbiya:/home/project$ curl -X POST http://localhost:5000/customer/login \
     -H "Content-Type: application/json" \
     -d '{"username": "john_doe", "password": "my_password"}'
{"message":"Invalid Login. Check username and password"}theia@theia-larrysonbiya:/home/project$ 
