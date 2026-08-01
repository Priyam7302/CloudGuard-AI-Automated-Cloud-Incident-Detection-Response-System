"""
CloudGuard AI

IAM Rule

Detect StopLogging events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class StopLoggingRule(DetectionRule):

    name = "StopLogging"

    category = "IAM"

    severity = "Critical"

    score = 60

    recommendation = (
        "Immediately investigate. Stopping CloudTrail logging may indicate "
        "an attempt to evade detection."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "StopLogging":

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
            "StopLogging"
        )

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"CloudTrail logging stopped for trail '{trail_name}'."
            ),

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()