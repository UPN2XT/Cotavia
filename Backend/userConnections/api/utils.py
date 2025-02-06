from ..models import Profile

def createProfileData(profile: Profile):
    return {
        "Displayname": profile.displayName,
        "pfp": profile.pfp.url,
        "username": profile.user.username
    }