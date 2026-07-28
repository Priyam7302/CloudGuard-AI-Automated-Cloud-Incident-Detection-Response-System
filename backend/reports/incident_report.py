"""
CloudGuard AI
Incident Report Generator
"""

from datetime import datetime
import uuid


def generate_incident_report(mitre, context, evidence, threat_report):

    report = {
        "incident_id": str(uuid.uuid4()),

        "generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),

        "event_name": context["event_name"],

        "severity": threat_report["severity"],

        "threat_score": threat_report["threat_score"],

        "summary": (
            f"{context['event_name']} detected against IAM user "
            f"'{context['target_user']}' by "
            f"'{context['actor']}'."
        ),

        "mitre": {
            "technique_id": mitre["technique_id"],
            "technique_name": mitre["technique_name"],
            "tactics": mitre["tactics"]
        },

        "context": context,

        "evidence": evidence,

        "recommendations": [
            "Review CloudTrail logs.",
            "Verify IAM activity.",
            "Rotate credentials if unauthorized.",
            "Enable MFA if not already enabled."
        ]
    }

    return report