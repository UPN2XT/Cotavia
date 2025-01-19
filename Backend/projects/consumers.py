from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import DenyConnection
from asgiref.sync import async_to_sync
from Auth.models import User
import json
from .views.utils.filemanger import getFolder, getFile
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
            "event": event["event"],
            "path": event["path"],
            "name":  event["name"]
        }
        if event["event"] == "create/folder":
            folder = getFolder(event["path"], self.project.rootFolder, self.user)
            if folder == None:
                return
            
        if event["event"] == "update/file":
            file = getFile(f'{event["path"]}/{event["name"]}', self.project.rootFolder, self.user)
            if file == None:
                return
            metaData["data"] = event["data"]
        self.send(text_data=json.dumps(metaData))
        
        
