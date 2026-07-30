import boto3

iam = boto3.client("iam")


def execute_response(event, threat_report):

    response = {
        "action": "None",
        "status": "Skipped",
        "message": "No remediation performed."
    }

    event_name = event["detail"]["eventName"]

    # ===========================
    # CreateAccessKey
    # ===========================

    if event_name == "CreateAccessKey":

        try:

            access_key = event["detail"]["responseElements"]["accessKey"]

            user_name = access_key["userName"]

            access_key_id = access_key["accessKeyId"]

            iam.update_access_key(
                UserName=user_name,
                AccessKeyId=access_key_id,
                Status="Inactive"
            )

            response = {
                "action": "DeactivateAccessKey",
                "status": "Success",
                "message": f"Access key {access_key_id} disabled successfully.",
                "user": user_name,
                "access_key": access_key_id
            }

        except Exception as e:

            response = {
                "action": "DeactivateAccessKey",
                "status": "Failed",
                "message": str(e)
            }

    return response