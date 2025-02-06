from ....models import Project, User

def allowed(f, user) -> bool:
    if f.limitedVisibility:
        return f.allowedRoles.filter(users=user).exists()
    return f.parentRoles.filter(users=user).exists()

def modifyAllowed(user: User, project: Project):
    return project.projectroles.filter(users=user, isAdmin=True).exists()