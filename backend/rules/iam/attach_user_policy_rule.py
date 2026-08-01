"""
CloudGuard AI

IAM Rule

Detect AttachUserPolicy events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class AttachUserPolicyRule(DetectionRule):

    name = "AttachUserPolicy"

    category = "IAM"

    severity = "High"

    score = 35

    recommendation = (
        "Verify that the managed policy attachment was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "AttachUserPolicy":

            return Detection().to_dict()

        request = event.get("detail", {}).get(
            "requestParameters",
            {}
        )

        policy_arn = request.get(
            "policyArn",
            ""
        )

        target_user = (
            request.get("userName")
            or context.get("target_user")
        )

        is_admin_policy = (
            "AdministratorAccess" in policy_arn
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
            f"Managed policy attached to IAM user '{target_user}'."
        )

        if is_admin_policy:

            reason = (
                f"AdministratorAccess policy attached to "
                f"IAM user '{target_user}'."
            )

        mitre = get_mitre_mapping(
            "AttachUserPolicy"
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