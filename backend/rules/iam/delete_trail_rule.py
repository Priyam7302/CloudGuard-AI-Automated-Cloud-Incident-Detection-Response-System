"""
CloudGuard AI

IAM Rule

Detect DeleteTrail events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class DeleteTrailRule(DetectionRule):

    name = "DeleteTrail"

    category = "IAM"

    severity = "Critical"

    score = 60

    recommendation = (
        "Immediately investigate. CloudTrail deletion may indicate an "
        "attempt to disable audit logging and hide malicious activity."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "DeleteTrail":

            return Detection().to_dict()

        request = event.get("detail", {}).get(
            "requestParameters",
            {}
        )

        trail_name = request.get(
            "name",
            "Unknown"
        )

        mitre = get_mitre_mapping(
            "DeleteTrail"
        )

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"CloudTrail trail '{trail_name}' was deleted."
            ),

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()