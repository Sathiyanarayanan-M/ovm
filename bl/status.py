def successStatus(message="Success", status=200, data=None):
    return {"error": False, "message": message, "status": status, "data": data}


def failureStatus(message="Internal Server Error", status=500, data=None):
    return {"error": True, "message": message, "status": status, "data": data}
