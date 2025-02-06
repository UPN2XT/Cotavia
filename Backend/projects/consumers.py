from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import DenyConnection
from asgiref.sync import async_to_sync
from Auth.models import User
import json
from .api.utils.filemanger.GetFunctions import get_file, get_folder
from .models import Project

class ProjectConsumer(WebsocketConsumer):
    def connect(self):
        self.user: User = self.scope["user"]
        if not self.user.is_authenticated:
            raise DenyConnection("Unauthorized access")
        id = self.scope["url_route"]["kwargs"]["project_id"]
        self.project: Project = self.user.projectsin.filter(id = id).first()
        if self.project == None:
            raise DenyConnection("Unauthorized access")
        self.project_id = id
        self.project_group_name = f"project_{id}"
        async_to_sync(self.channel_layer.group_add)(
            self.project_group_name, self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        self.send(text_data="not allowed")

    def disconnect(self, code=0):
        async_to_sync(self.channel_layer.group_discard)(
            self.project_group_name, self.channel_name
        )

    def project_update(self, event):
        metaData = {
            "event": event["event"]
        }

        if event["event"] == "delete/User":
            if event["username"] == self.user.username:
                self.send(text_data=json.dumps(metaData))
            return
        
        if event["event"] == "role/change/reload":
            self.send(text_data=json.dumps(metaData))
            return
        
        if event["event"] == "role/change":
            if event["Type"] == "folder":
                target = get_folder(event["UUID"], self.project, self.user)
            else:
                target =  get_file(event["UUID"], self.project, self.user)
            if target == None:
                event["event"] = "delete"+"/"+event["Type"]
                metaData["event"] = "delete"
            else:
                return
        if event["event"] == "create/folder":
            folder =  get_folder(event["UUID"], self.project, self.user)
            metaData["path"] = event["path"]
            if folder == None:
                return
            metaData["name"] = event["name"]
            metaData["UUID"] = event["UUID"]
            metaData["pUUID"] = event["pUUID"]
            
        if event["event"] == "update/file":
            file = get_file(event["data"]["UUID"], self.project, self.user)
            metaData["path"] = event["path"]
            if file == None:
                return
            metaData["data"] = event["data"]
            metaData["name"] =  event["name"]
            metaData["pUUID"] = event["pUUID"]

        
        if "copy" in event["event"] or "cut" in event["event"]:
            metaData["from"] = event["from"]
            metaData["to"] = event["to"]
            metaData["name"] = event["name"]
            metaData["pUUID"] =  event["pUUID"]
            metaData["pUUID2"] =  event["pUUID2"]

        if "copy" in event["event"]:
            metaData["UUIDData"] = event["UUIDData"]
        
        if "delete" in event["event"]:
            metaData["path"] = event["path"]
            metaData["pUUID"] = event["UUID"]

        self.send(text_data=json.dumps(metaData))

        
        
