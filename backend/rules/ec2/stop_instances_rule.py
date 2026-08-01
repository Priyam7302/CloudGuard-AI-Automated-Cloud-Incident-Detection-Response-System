"""
CloudGuard AI

EC2 Rule

Detect EC2 instance stop.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class StopInstancesRule(DetectionRule):

    name = "StopInstances"

    category = "EC2"

    mitre = "T1489"

    severity = "Medium"

    score = 25

    recommendation = (
        "Verify that the EC2 instance stop request is authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "StopInstances":

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="EC2 instance stopped.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()