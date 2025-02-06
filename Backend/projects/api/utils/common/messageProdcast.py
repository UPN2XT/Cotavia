from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send) # Channel sending method rappers

def sendMessage(project, message):
    message["type"] = "project.update"
    groupSend(f"project_{project.id}", message)