"""
CloudGuard AI

EC2 Rule

Detect Security Group modifications.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class ModifySecurityGroupRule(DetectionRule):

    name = "ModifySecurityGroup"

    category = "EC2"

    mitre = "T1562"

    severity = "High"

    score = 35

    recommendation = (
        "Review Security Group changes for unauthorized access."
    )

    def evaluate(self, event, context):

        if context.get("event_name") not in [

            "AuthorizeSecurityGroupIngress",

            "AuthorizeSecurityGroupEgress",

            "RevokeSecurityGroupIngress",

            "RevokeSecurityGroupEgress"

        ]:

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="Security Group rules modified.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()