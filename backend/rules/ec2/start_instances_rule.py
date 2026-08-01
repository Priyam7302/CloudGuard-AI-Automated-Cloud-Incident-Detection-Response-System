"""
CloudGuard AI

EC2 Rule

Detect EC2 instance start.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class StartInstancesRule(DetectionRule):

    name = "StartInstances"

    category = "EC2"

    mitre = "T1583.002"

    severity = "Low"

    score = 15

    recommendation = (
        "Verify that the EC2 instance was intentionally started."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "StartInstances":

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="EC2 instance started.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()