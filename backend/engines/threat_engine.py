"""
CloudGuard AI
Threat Engine

Generates a threat assessment based on evidence.
"""


def generate_threat_report(evidence):

    score = 0

    reasons = []

    for item in evidence:

        if item["type"] == "MITRE Technique":
            score += 40
            reasons.append("Mapped to MITRE ATT&CK")

        elif item["type"] == "Cross User Action":
            score += 30
            reasons.append("Cross-user IAM operation")

        elif item["type"] == "MFA Used" and item["value"] is False:
            score += 20
            reasons.append("Operation performed without MFA")

        elif item["type"] == "After Hours Activity":
            score += 10
            reasons.append("Activity outside business hours")

    # Determine severity
    if score >= 80:
        severity = "Critical"
    elif score >= 60:
        severity = "High"
    elif score >= 30:
        severity = "Medium"
    else:
        severity = "Low"

    return {
        "threat_score": score,
        "severity": severity,
        "reasons": reasons
    }