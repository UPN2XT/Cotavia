import os, json

def startUp():
    if not os.path.isfile("settings.json"):
        print("Welcome to Link")
        print("before we start we need to setup the settings")
        username = input("Enter your username: ")
        directory = input("Enter the directory you want to use: ")
        basicData = {
            "username": username,
            "directory": directory,
            "projects": {}
        }
        with open("settings.json", "w") as f:
            json.dump(basicData, f)

    

    while True:
        port = input("Enter the port you want to use: ")
        try:
            port = int(port)
            break
        except:
            print("Please enter a valid port number")

    return port