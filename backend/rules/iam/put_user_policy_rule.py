"""
CloudGuard AI

IAM Rule

Detect PutUserPolicy events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class PutUserPolicyRule(DetectionRule):

    name = "PutUserPolicy"

    category = "IAM"

    severity = "High"

    score = 35

    recommendation = (
        "Verify that the inline IAM policy creation or modification was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "PutUserPolicy":

            return Detection().to_dict()

        request = event.get("detail", {}).get(
            "requestParameters",
            {}
        )

        user_name = request.get(
            "userName",
            context.get("target_user")
        )

        policy_name = request.get(
            "policyName",
            "Unknown"
        )

        policy_document = str(
            request.get("policyDocument", "")
        )

        is_admin_policy = (
            "*" in policy_document
            or "AdministratorAccess" in policy_document
        )

        severity = (
            "Critical"
            if is_admin_policy
            else self.severity
        )

        score = (
            50
            if is_admin_policy
            else self.score
        )

        reason = (
            f"Inline policy '{policy_name}' added to IAM user '{user_name}'."
        )

        if is_admin_policy:

            reason = (
                f"Potential administrator inline policy '{policy_name}' "
                f"added to IAM user '{user_name}'."
            )

        mitre = get_mitre_mapping(
            "PutUserPolicy"
        )

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=severity,

            score=score,

            reason=reason,

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()