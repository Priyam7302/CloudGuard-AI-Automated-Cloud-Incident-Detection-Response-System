"""
CloudGuard AI

EC2 Rule

Detect EC2 instance termination.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class TerminateInstancesRule(DetectionRule):

    name = "TerminateInstances"

    category = "EC2"

    mitre = "T1485"

    severity = "High"

    score = 40

    recommendation = (
        "Investigate immediately. Confirm that instance termination was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "TerminateInstances":

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="EC2 instance terminated.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()