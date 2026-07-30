import json
import boto3
import os

from mitre.mitre_mapping import get_mitre_mapping

from engines.context_engine import analyze_context
from engines.evidence_engine import build_evidence
from engines.threat_engine import generate_threat_report
from engines.notification_engine import send_notification
from engines.storage_engine import (
    save_incident,
    get_all_incidents,
    get_incident
)
from engines.response_engine import execute_response
from reports.incident_report import generate_incident_report

sns = boto3.client("sns")
s3 = boto3.client("s3")
iam = boto3.client("iam")

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
    # EventBridge Logic
    # ==========================================

    event_name = event["detail"]["eventName"]

    # MITRE Lookup
    mitre = get_mitre_mapping(event_name)

    # Context Analysis
    context_report = analyze_context(event)

    # Evidence
    evidence = build_evidence(mitre, context_report)

    # Threat Report
    threat_report = generate_threat_report(evidence)
    response = execute_response(event,threat_report)

    # Incident Report
    incident_report = generate_incident_report(
        mitre,
        context_report,
        evidence,
        threat_report
    )
    
    incident_report["response"] = response
    
    # Save to S3
    incident_key = save_incident(incident_report)

    # Send SNS Notification
    send_notification(
        incident_report,
        incident_key
    )

    print("========== MITRE ==========")
    print(json.dumps(mitre, indent=2))

    print("========== CONTEXT ==========")
    print(json.dumps(context_report, indent=2))

    print("========== EVIDENCE ==========")
    print(json.dumps(evidence, indent=2))

    print("========== THREAT REPORT ==========")
    print(json.dumps(threat_report, indent=2))
    
    print("========== RESPONSE ==========")
    print(json.dumps(response, indent=2))

    print("========== INCIDENT REPORT ==========")
    print(json.dumps(incident_report, indent=2))

    print("========== STORED IN S3 ==========")
    print(incident_key)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "incident_report": incident_report,
            "s3_key": incident_key
        })
    }