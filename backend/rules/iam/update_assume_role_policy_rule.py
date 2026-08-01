"""
CloudGuard AI

IAM Rule

Detect UpdateAssumeRolePolicy events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class UpdateAssumeRolePolicyRule(DetectionRule):

    name = "UpdateAssumeRolePolicy"

    category = "IAM"

    severity = "Critical"

    score = 50

    recommendation = (
        "Immediately verify the IAM role trust policy. "
        "Unauthorized trust policy changes may allow privilege escalation."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "UpdateAssumeRolePolicy":

            return Detection().to_dict()

        request = event.get("detail", {}).get(
            "requestParameters",
            {}
        )

        role_name = request.get(
            "roleName",
            "Unknown"
        )

        policy_document = str(
            request.get(
                "policyDocument",
                ""
            )
        )

        is_cross_account = (
            ":root" in policy_document
            or "*" in policy_document
        )

        severity = (
            "Critical"
            if is_cross_account
            else self.severity
        )

        score = (
            60
            if is_cross_account
            else self.score
        )

        reason = (
            f"Trust policy updated for IAM role '{role_name}'."
        )

        if is_cross_account:

            reason = (
                f"IAM role '{role_name}' trust policy may allow "
                f"cross-account or overly permissive access."
            )

        mitre = get_mitre_mapping(
            "UpdateAssumeRolePolicy"
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