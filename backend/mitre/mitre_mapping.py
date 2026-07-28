"""
CloudGuard AI
MITRE ATT&CK Knowledge Base

This module maps AWS IAM events to the corresponding
MITRE ATT&CK techniques.
"""

MITRE_MAPPING = {

    "CreateUser": {
        "technique_id": "T1136",
        "technique_name": "Create Account",
        "tactics": [
            "Persistence"
        ],
        "description":
        "Creates a new IAM user which may be used to establish persistence."
    },

    "CreateAccessKey": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": [
            "Persistence"
        ],
        "description":
        "Creates new credentials for an existing IAM account."
    },

    "AttachUserPolicy": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": [
            "Persistence",
            "Privilege Escalation"
        ],
        "description":
        "Attaches permissions to an IAM user, potentially increasing privileges."
    }

}

def get_mitre_mapping(event_name):
    """
    Returns MITRE ATT&CK information for an AWS event.
    """

    return MITRE_MAPPING.get(
        event_name,
        {
            "technique_id": "UNKNOWN",
            "technique_name": "Unknown Technique",
            "tactics": [],
            "description": "No MITRE mapping found."
        }
    )