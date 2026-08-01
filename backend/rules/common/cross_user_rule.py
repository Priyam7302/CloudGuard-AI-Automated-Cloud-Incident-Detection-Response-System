"""
CloudGuard AI
Common Rule

Rule:
Detect cross-user IAM operations.

Example:
Actor  : alice
Target : bob

This is often seen during privilege escalation
or unauthorized IAM modifications.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class CrossUserRule(DetectionRule):

    name = "Cross User Operation"

    category = "Common"

    mitre = "T1098"

    severity = "High"

    score = 30

    recommendation = (
        "Verify whether the actor is authorized to modify another IAM identity."
    )

    def evaluate(self, event, context):

        if not context.get("is_cross_user_action", False):

            return Detection().to_dict()

        actor = context.get("actor", "Unknown")

        target = context.get("target_user", "Unknown")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"IAM user '{actor}' performed an operation on "
                f"IAM user '{target}'."
            ),

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()