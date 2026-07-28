"""
CloudGuard AI
Storage Engine
"""

import json
import os
import boto3

s3 = boto3.client("s3")

BUCKET = os.environ["S3_BUCKET"]


# -------------------------------
# Save Incident
# -------------------------------
def save_incident(report):

    incident_id = report["incident_id"]

    key = f"incidents/{incident_id}.json"

    s3.put_object(
        Bucket=BUCKET,
        Key=key,
        Body=json.dumps(report, indent=4),
        ContentType="application/json"
    )

    return key


# -------------------------------
# Get All Incidents
# -------------------------------
def get_all_incidents():

    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix="incidents/"
    )

    incidents = []

    if "Contents" not in response:
        return incidents

    for obj in response["Contents"]:

        file = s3.get_object(
            Bucket=BUCKET,
            Key=obj["Key"]
        )

        incident = json.loads(
            file["Body"].read().decode("utf-8")
        )

        incidents.append(incident)

    return incidents


# -------------------------------
# Get Single Incident
# -------------------------------
def get_incident(incident_id):

    key = f"incidents/{incident_id}.json"

    response = s3.get_object(
        Bucket=BUCKET,
        Key=key
    )

    return json.loads(
        response["Body"].read().decode("utf-8")
    )