"""
CloudGuard AI

EC2 Rule

Detect EBS snapshot creation.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class CreateSnapshotRule(DetectionRule):

    name = "CreateSnapshot"

    category = "EC2"

    mitre = "T1005"

    severity = "Medium"

    score = 30

    recommendation = (
        "Verify that snapshot creation is authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "CreateSnapshot":

            return Detection().to_dict()

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason="EBS snapshot created.",

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()