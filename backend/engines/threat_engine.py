"""
CloudGuard AI
Threat Engine

Builds the final threat assessment using
the Risk Engine output.
"""


def generate_threat_report(risk_report):

    score = risk_report.get("risk_score", 0)

    detections = risk_report.get("detections", [])

    if score >= 100:
        severity = "Critical"

    elif score >= 70:
        severity = "High"

    elif score >= 40:
        severity = "Medium"

    else:
        severity = "Low"

    return {

        "threat_score": score,

        "severity": severity,

        "detections": detections,

        "total_detections": len(detections)

    }