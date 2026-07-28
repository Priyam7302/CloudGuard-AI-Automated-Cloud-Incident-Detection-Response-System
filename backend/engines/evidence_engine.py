"""
CloudGuard AI
Evidence Engine

Builds evidence from MITRE and contextual analysis.
"""


def build_evidence(mitre, context):

    evidence = []

    # MITRE evidence
    if mitre:
        evidence.append({
            "type": "MITRE Technique",
            "value": f"{mitre['technique_id']} - {mitre['technique_name']}"
        })

    # Cross-user action
    if context.get("is_cross_user_action"):
        evidence.append({
            "type": "Cross User Action",
            "value": True
        })

    # MFA
    if context.get("mfa_used") is False:
        evidence.append({
            "type": "MFA Used",
            "value": False
        })

    # After-hours activity
    if context.get("is_after_hours"):
        evidence.append({
            "type": "After Hours Activity",
            "value": True
        })

    return evidence