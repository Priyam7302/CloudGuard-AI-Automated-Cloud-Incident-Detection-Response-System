"""
CloudGuard AI
Response Engine

Executes automated remediation actions
based on triggered detections.
"""

import boto3

iam = boto3.client("iam")


def execute_response(event, threat_report):

    responses = []

    detail = event.get("detail", {})

    response_elements = detail.get("responseElements") or {}

    access_key = response_elements.get("accessKey", {})

    for detection in threat_report.get("detections", []):

        rule = detection.get("rule")

        # ==================================
        # CreateAccessKey
        # ==================================

        if rule == "CreateAccessKey":

            try:

                user_name = access_key.get("userName")

                access_key_id = access_key.get("accessKeyId")

                if user_name and access_key_id:

                    iam.update_access_key(

                        UserName=user_name,

                        AccessKeyId=access_key_id,

                        Status="Inactive"

                    )

                    responses.append({

                        "rule": rule,

                        "action": "DeactivateAccessKey",

                        "status": "Success",

                        "message": f"Access Key {access_key_id} disabled."

                    })

                else:

                    responses.append({

                        "rule": rule,

                        "action": "DeactivateAccessKey",

                        "status": "Skipped",

                        "message": "Access key information missing."

                    })

            except Exception as e:

                responses.append({

                    "rule": rule,

                    "action": "DeactivateAccessKey",

                    "status": "Failed",

                    "message": str(e)

                })

        # ==================================
        # IAM Notify Only
        # ==================================

        elif rule == "DeleteTrail":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "CloudTrail deletion detected."

            })

        elif rule == "StopLogging":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "CloudTrail logging stopped."

            })

        elif rule == "CreateUser":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "IAM user created."

            })

        elif rule == "AttachUserPolicy":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "User policy attached."

            })

        elif rule == "AttachGroupPolicy":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "Group policy attached."

            })

        elif rule == "PutUserPolicy":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "Inline policy added."

            })

        elif rule == "UpdateAssumeRolePolicy":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "Role trust policy modified."

            })

        elif rule == "CreateLoginProfile":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "Console login profile created."

            })

        # ==================================
        # EC2
        # ==================================

        elif rule == "RunInstances":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "New EC2 instance launched."

            })

        elif rule == "StartInstances":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "EC2 instance started."

            })

        elif rule == "StopInstances":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "EC2 instance stopped."

            })

        elif rule == "TerminateInstances":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "EC2 instance terminated."

            })

        elif rule == "ModifySecurityGroup":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "Security Group modified."

            })

        elif rule == "CreateSnapshot":

            responses.append({

                "rule": rule,

                "action": "Notify",

                "status": "Success",

                "message": "EBS Snapshot created."

            })

    if not responses:

        responses.append({

            "rule": "None",

            "action": "None",

            "status": "Skipped",

            "message": "No automated response executed."

        })

    return responses