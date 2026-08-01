"""
CloudGuard AI

IAM Rule

Detect AttachGroupPolicy events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class AttachGroupPolicyRule(DetectionRule):

    name = "AttachGroupPolicy"

    category = "IAM"

    severity = "High"

    score = 35

    recommendation = (
        "Verify that the managed policy attachment to the IAM group was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "AttachGroupPolicy":

            return Detection().to_dict()

        request = event.get("detail", {}).get(
            "requestParameters",
            {}
        )

        group_name = request.get(
            "groupName",
            "Unknown"
        )

        policy_arn = request.get(
            "policyArn",
            ""
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
            f"Managed policy attached to IAM group '{group_name}'."
        )

        if is_admin_policy:

            reason = (
                f"AdministratorAccess policy attached to "
                f"IAM group '{group_name}'."
            )

        mitre = get_mitre_mapping(
            "AttachGroupPolicy"
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