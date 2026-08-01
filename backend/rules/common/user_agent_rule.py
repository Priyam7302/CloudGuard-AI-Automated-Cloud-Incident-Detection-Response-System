"""
CloudGuard AI
Common Rule

Rule:
Detect suspicious or previously unseen
AWS User-Agent strings.

NOTE:
This rule expects context_engine to populate:

context["user_agent"]
context["is_suspicious_user_agent"]
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection


class UserAgentRule(DetectionRule):

    name = "Suspicious User Agent"

    category = "Common"

    mitre = "T1078"

    severity = "Medium"

    score = 20

    recommendation = (
        "Verify whether the API request originated from an approved client."
    )

    def evaluate(self, event, context):

        if not context.get("is_suspicious_user_agent", False):

            return Detection().to_dict()

        user_agent = context.get("user_agent", "Unknown")

        actor = context.get("actor", "Unknown")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"IAM user '{actor}' used an unusual client: "
                f"{user_agent}"
            ),

            recommendation=self.recommendation,

            mitre=self.mitre

        ).to_dict()