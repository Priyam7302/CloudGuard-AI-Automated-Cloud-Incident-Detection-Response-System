"""
CloudGuard AI
IAM Context Rule

Rule:
Detect AWS Root Account usage.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class RootUserRule(DetectionRule):

    name = "Root Account Usage"

    category = "IAM"

    mitre = "T1078"

    severity = "Critical"

    score = 40

    recommendation = (
        "Avoid using the AWS Root account. "
        "Use IAM roles or IAM users instead."
    )

    def evaluate(self, event, context):

        detail = event.get("detail", {})

        user_identity = detail.get("userIdentity", {})

        is_root = (
            user_identity.get("type") == "Root"
        )

        if not is_root:

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="AWS Root account performed an API operation.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()