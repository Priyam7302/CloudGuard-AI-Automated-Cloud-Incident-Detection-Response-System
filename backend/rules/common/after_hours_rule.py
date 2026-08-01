"""
CloudGuard AI
Common Rule

Rule:
Detect API activity outside business hours.

Default business hours:
08:00 UTC - 18:00 UTC
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class AfterHoursRule(DetectionRule):

    name = "After Hours Activity"

    category = "Common"

    mitre = "T1078"

    severity = "Medium"

    score = 15

    recommendation = (
        "Verify whether this activity was expected outside business hours."
    )

    def evaluate(self, event, context):

        if not context.get("is_after_hours", False):

            return Detection().to_dict()

        hour = context.get("event_hour")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"API activity detected outside business hours "
                f"({hour}:00 UTC)."
            ),

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()