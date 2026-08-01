"""
CloudGuard AI
Context Engine

Extracts contextual information from CloudTrail
events for risk analysis.
"""

from datetime import datetime


def analyze_context(event):

    detail = event.get("detail", {})

    user_identity = detail.get("userIdentity", {})

    request = detail.get("requestParameters", {})

    session_context = user_identity.get(
        "sessionContext",
        {}
    )

    attributes = session_context.get(
        "attributes",
        {}
    )

    event_time = detail.get("eventTime")

    event_hour = None

    is_after_hours = False

    if event_time:

        try:

            dt = datetime.strptime(
                event_time,
                "%Y-%m-%dT%H:%M:%SZ"
            )

            event_hour = dt.hour

            is_after_hours = (
                event_hour < 8 or event_hour >= 18
            )

        except Exception:

            pass

    actor = user_identity.get(
        "userName",
        "Unknown"
    )

    target_user = request.get(
        "userName",
        actor
    )

    user_agent = detail.get(
        "userAgent",
        ""
    )

    context = {

        # =====================
        # Identity
        # =====================

        "actor": actor,

        "target_user": target_user,

        "user_type": user_identity.get(
            "type",
            "Unknown"
        ),

        "account_id": user_identity.get(
            "accountId"
        ),

        # =====================
        # Event
        # =====================

        "event_name": detail.get(
            "eventName"
        ),

        "event_source": detail.get(
            "eventSource"
        ),

        "event_time": event_time,

        "event_hour": event_hour,

        # =====================
        # Network
        # =====================

        "source_ip": detail.get(
            "sourceIPAddress"
        ),

        "aws_region": detail.get(
            "awsRegion"
        ),

        # =====================
        # Client
        # =====================

        "user_agent": user_agent,

        "is_suspicious_user_agent": any(

            keyword in user_agent.lower()

            for keyword in [

                "curl",

                "python",

                "powershell",

                "botocore",

                "aws-cli"

            ]

        ),

        # =====================
        # Authentication
        # =====================

        "mfa_used": (

            attributes.get(

                "mfaAuthenticated",

                "false"

            ).lower() == "true"

        ),

        # =====================
        # Behaviour
        # =====================

        "is_cross_user_action": (

            actor != target_user

        ),

        "is_after_hours": is_after_hours,

    }

    return context