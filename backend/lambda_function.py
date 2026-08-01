import json
import boto3
import os

from engines.context_engine import analyze_context
from engines.risk_engine import analyze_risk
from engines.threat_engine import generate_threat_report
from engines.response_engine import execute_response

from engines.notification_engine import send_notification

from engines.storage_engine import (
    save_incident,
    get_all_incidents,
    get_incident
)

from reports.incident_report import generate_incident_report

sns = boto3.client("sns")
s3 = boto3.client("s3")

SNS_TOPIC_ARN = os.environ["SNS_TOPIC_ARN"]
S3_BUCKET = os.environ["S3_BUCKET"]


def lambda_handler(event, context):

    print(json.dumps(event, indent=2))

    # ==========================================
    # API Gateway
    # ==========================================

    if event.get("requestContext"):

        route = event["requestContext"]["routeKey"]

        if route == "GET /incidents":

            incidents = get_all_incidents()

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps(incidents)
            }

        elif route == "GET /incidents/{id}":

            incident_id = event["pathParameters"]["id"]

            incident = get_incident(incident_id)

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps(incident)
            }

    # ==========================================
    # CloudTrail Event Processing
    # ==========================================

    context_report = analyze_context(event)

    risk_report = analyze_risk(
        event,
        context_report
    )

    threat_report = generate_threat_report(
        risk_report
    )

    response_report = execute_response(
        event,
        threat_report
    )

    incident_report = generate_incident_report(

        context=context_report,

        risk=risk_report,

        threat=threat_report,

        response=response_report

    )

    incident_key = save_incident(
        incident_report
    )

    send_notification(
        incident_report,
        incident_key
    )

    print("========== CONTEXT ==========")
    print(json.dumps(context_report, indent=2))

    print("========== RISK ==========")
    print(json.dumps(risk_report, indent=2))

    print("========== THREAT ==========")
    print(json.dumps(threat_report, indent=2))

    print("========== RESPONSE ==========")
    print(json.dumps(response_report, indent=2))

    print("========== INCIDENT ==========")
    print(json.dumps(incident_report, indent=2))

    print("========== STORED ==========")
    print(incident_key)

    return {

        "statusCode": 200,

        "body": json.dumps({

            "incident": incident_report,

            "s3_key": incident_key

        })

    }