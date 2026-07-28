"""
CloudGuard AI
Notification Engine
"""

import json
import os
import boto3

sns = boto3.client("sns")

SNS_TOPIC_ARN = os.environ["SNS_TOPIC_ARN"]


def send_notification(incident_report, s3_key):

    subject = (
        f"🚨 CloudGuard AI Alert - "
        f"{incident_report['severity']}"
    )

    message = f"""
CloudGuard AI Security Alert

Severity:
{incident_report['severity']}

Threat Score:
{incident_report['threat_score']}

Event:
{incident_report['event_name']}

Summary:
{incident_report['summary']}

MITRE Technique:
{incident_report['mitre']['technique_id']} - {incident_report['mitre']['technique_name']}

Evidence:
{json.dumps(incident_report['evidence'], indent=2)}

Recommendations:
"""

    for rec in incident_report["recommendations"]:
        message += f"\n• {rec}"

    message += f"""

S3 Incident Report

{s3_key}

Generated At

{incident_report['generated_at']}
"""

    sns.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject=subject,
        Message=message
    )