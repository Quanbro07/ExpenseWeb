# How To Run the Web App
0. Make sure ports **8080** and **3000** are not being used.

1. Download and install **Docker Desktop**, then start Docker Desktop.

2. Open **cmd** in the directory where you cloned the project.

3. Run the command:
```
docker compose up
```
and wait for Docker to build the web app.

4. Open your browser and go to:
http://localhost:3000
to test it
\

# How to Stop the App

To stop and remove all containers, networks, and volumes created by Docker Compose, run:
```
docker compose down -v
```