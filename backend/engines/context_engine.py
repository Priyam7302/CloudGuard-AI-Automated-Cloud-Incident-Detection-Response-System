"""
CloudGuard AI
Context Analysis Engine

Analyzes CloudTrail events and extracts contextual
information useful for threat assessment.
"""

from datetime import datetime


def analyze_context(event):

    detail = event.get("detail", {})
    user = detail.get("userIdentity", {})
    request = detail.get("requestParameters", {})

    context = {

        "actor": user.get("userName", "Unknown"),

        "target_user": request.get("userName", "Unknown"),

        "aws_region": detail.get("awsRegion", "Unknown"),

        "source_ip": detail.get("sourceIPAddress", "Unknown"),

        "event_name": detail.get("eventName", "Unknown"),

        "mfa_used": (
            user.get("sessionContext", {})
                .get("attributes", {})
                .get("mfaAuthenticated", "false")
        ),

        "event_time": detail.get("eventTime", "Unknown")

    }

    # Cross-user action
    context["is_cross_user_action"] = (
        context["actor"] != context["target_user"]
    )

    # Convert MFA string to boolean
    context["mfa_used"] = (
        str(context["mfa_used"]).lower() == "true"
    )

    # Extract event hour (UTC)
    try:
        event_dt = datetime.strptime(
            context["event_time"],
            "%Y-%m-%dT%H:%M:%SZ"
        )

        context["event_hour"] = event_dt.hour

    except Exception:

        context["event_hour"] = None

    # Basic after-hours detection (UTC)
    if context["event_hour"] is not None:

        context["is_after_hours"] = (
            context["event_hour"] < 8
            or context["event_hour"] >= 18
        )

    else:

        context["is_after_hours"] = None

    return context