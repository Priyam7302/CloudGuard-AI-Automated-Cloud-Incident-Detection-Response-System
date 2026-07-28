"""
CloudGuard AI
Storage Engine
"""

import json
import os
import boto3

s3 = boto3.client("s3")

BUCKET = os.environ["S3_BUCKET"]


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