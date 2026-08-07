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
            "RevokeSecurityGroupEgress",
            "ModifySecurityGroupRules"

        ]:
            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=f"Security Group modified via {context.get('event_name')}.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()