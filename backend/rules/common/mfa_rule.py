"""
CloudGuard AI
Common Rule

Rule:
Detect API activity performed without MFA.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class MFARule(DetectionRule):

    name = "No MFA"

    category = "Common"

    mitre = "T1078"

    severity = "Medium"

    score = 20

    recommendation = (
        "Enable MFA for privileged IAM users."
    )

    def evaluate(self, event, context):

        if context.get("mfa_used") is True:

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="API request executed without MFA.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()