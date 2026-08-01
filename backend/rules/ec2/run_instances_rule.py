"""
CloudGuard AI

EC2 Rule

Detect EC2 instance launch.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class RunInstancesRule(DetectionRule):

    name = "RunInstances"

    category = "EC2"

    mitre = "T1583.002"

    severity = "Medium"

    score = 25

    recommendation = (
        "Verify that the EC2 instance launch was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "RunInstances":

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="New EC2 instance launched.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()