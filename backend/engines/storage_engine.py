"""
CloudGuard AI
Storage Engine

Stores and retrieves incident reports
from Amazon S3.
"""

import json
import uuid
import boto3
import os

s3 = boto3.client("s3")

BUCKET_NAME = os.environ["S3_BUCKET"]


# ==========================================
# Save Incident
# ==========================================

def save_incident(incident):

    incident_id = incident.get(
        "incident_id",
        str(uuid.uuid4())
    )

    key = f"incidents/{incident_id}.json"

    s3.put_object(

        Bucket=BUCKET_NAME,

        Key=key,

        Body=json.dumps(
            incident,
            indent=4
        ),

        ContentType="application/json"

    )

    return key


# ==========================================
# Get One Incident
# ==========================================

def get_incident(incident_id):

    key = f"incidents/{incident_id}.json"

    response = s3.get_object(

        Bucket=BUCKET_NAME,

        Key=key

    )

    return json.loads(

        response["Body"].read()

    )


# ==========================================
# Get All Incidents
# ==========================================

def get_all_incidents():

    response = s3.list_objects_v2(

        Bucket=BUCKET_NAME,

        Prefix="incidents/"
    )

    incidents = []

    if "Contents" not in response:

        return incidents

    for obj in response["Contents"]:

        data = s3.get_object(

            Bucket=BUCKET_NAME,

            Key=obj["Key"]

        )

        incidents.append(

            json.loads(

                data["Body"].read()

            )

        )

    return incidents