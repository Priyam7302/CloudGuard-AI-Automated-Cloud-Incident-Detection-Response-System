"""
CloudGuard AI

MITRE ATT&CK Mapping
"""

MITRE_MAPPING = {

    # ==========================
    # IAM
    # ==========================

    "CreateUser": {
        "technique_id": "T1136",
        "technique_name": "Create Account",
        "tactics": ["Persistence"]
    },

    "CreateAccessKey": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": ["Persistence"]
    },

    "CreateLoginProfile": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": ["Persistence"]
    },

    "AttachUserPolicy": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": [
            "Persistence",
            "Privilege Escalation"
        ]
    },

    "AttachGroupPolicy": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": [
            "Persistence",
            "Privilege Escalation"
        ]
    },

    "PutUserPolicy": {
        "technique_id": "T1098",
        "technique_name": "Account Manipulation",
        "tactics": [
            "Persistence",
            "Privilege Escalation"
        ]
    },

    "UpdateAssumeRolePolicy": {
        "technique_id": "T1484",
        "technique_name": "Domain or Trust Policy Modification",
        "tactics": [
            "Privilege Escalation"
        ]
    },

    "DeleteTrail": {
        "technique_id": "T1562",
        "technique_name": "Impair Defenses",
        "tactics": ["Defense Evasion"]
    },

    "StopLogging": {
        "technique_id": "T1562",
        "technique_name": "Impair Defenses",
        "tactics": ["Defense Evasion"]
    },

    # ==========================
    # EC2
    # ==========================

    "RunInstances": {
        "technique_id": "T1583.002",
        "technique_name": "Acquire Infrastructure: Virtual Private Server",
        "tactics": ["Resource Development"]
    },

    "StartInstances": {
        "technique_id": "T1583.002",
        "technique_name": "Acquire Infrastructure: Virtual Private Server",
        "tactics": ["Resource Development"]
    },

    "StopInstances": {
        "technique_id": "T1489",
        "technique_name": "Service Stop",
        "tactics": ["Impact"]
    },

    "TerminateInstances": {
        "technique_id": "T1485",
        "technique_name": "Data Destruction",
        "tactics": ["Impact"]
    },

    "CreateSnapshot": {
        "technique_id": "T1005",
        "technique_name": "Data from Local System",
        "tactics": ["Collection"]
    },

    "AuthorizeSecurityGroupIngress": {
        "technique_id": "T1562",
        "technique_name": "Modify Security Controls",
        "tactics": ["Defense Evasion"]
    },

    "AuthorizeSecurityGroupEgress": {
        "technique_id": "T1562",
        "technique_name": "Modify Security Controls",
        "tactics": ["Defense Evasion"]
    },

    "RevokeSecurityGroupIngress": {
        "technique_id": "T1562",
        "technique_name": "Modify Security Controls",
        "tactics": ["Defense Evasion"]
    },

    "RevokeSecurityGroupEgress": {
        "technique_id": "T1562",
        "technique_name": "Modify Security Controls",
        "tactics": ["Defense Evasion"]
    }

}


def get_mitre_mapping(event_name):

    return MITRE_MAPPING.get(

        event_name,

        {

            "technique_id": "UNKNOWN",

            "technique_name": "Unknown",

            "tactics": []

        }

    )