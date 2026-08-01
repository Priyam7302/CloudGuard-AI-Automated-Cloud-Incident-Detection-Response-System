"""
CloudGuard AI
Incident Report Generator

Creates the final incident report
stored in S3 and displayed on the dashboard.
"""

import uuid
from datetime import datetime, timezone


def generate_incident_report(

    context,

    risk,

    threat,

    response

):

    incident = {

        # ====================================
        # Incident Information
        # ====================================

        "incident_id": str(uuid.uuid4()),

        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),

        # ====================================
        # Event
        # ====================================

        "event": {

            "event_name": context.get(
                "event_name"
            ),

            "event_source": context.get(
                "event_source"
            ),

            "event_time": context.get(
                "event_time"
            )

        },

        # ====================================
        # Actor
        # ====================================

        "actor": {

            "user": context.get(
                "actor"
            ),

            "target_user": context.get(
                "target_user"
            ),

            "user_type": context.get(
                "user_type"
            ),

            "account_id": context.get(
                "account_id"
            )

        },

        # ====================================
        # Network
        # ====================================

        "network": {

            "source_ip": context.get(
                "source_ip"
            ),

            "aws_region": context.get(
                "aws_region"
            ),

            "user_agent": context.get(
                "user_agent"
            )

        },

        # ====================================
        # Context
        # ====================================

        "context": {

            "mfa_used": context.get(
                "mfa_used"
            ),

            "after_hours": context.get(
                "is_after_hours"
            ),

            "cross_user_action": context.get(
                "is_cross_user_action"
            )

        },

        # ====================================
        # Risk
        # ====================================

        "risk": risk,

        # ====================================
        # Threat
        # ====================================

        "threat": threat,

        # ====================================
        # Automated Response
        # ====================================

        "response": response

    }

    return incident