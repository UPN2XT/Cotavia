def createCopyName(name, i):
    x = name.split(".")
    x[0] += f"({i})"
    return ".".join(x)

def createNames(target, querySet):
    name = target.name
    neo = name
    i = 1
    c = 1
    while querySet.filter(name=neo).count() > c:
        neo = createCopyName(name, i)
        i+=1
        c = 0
    target.name = neo
    target.save()
    return neo

def name_conflict_file(target):
    querySet = target.parentFolder.childrenfiles.all()
    name = createNames(target, querySet)
    return name

def name_conflict_folder(target):
    querySet = target.parentFolder.childrenfolders.all()
    name = createNames(target, querySet)
    return name
    
    
    