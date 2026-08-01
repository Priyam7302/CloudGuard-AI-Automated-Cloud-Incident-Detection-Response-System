"""
CloudGuard AI

IAM Rule

Detect CreateUser events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class CreateUserRule(DetectionRule):

    name = "CreateUser"

    category = "IAM"

    severity = "Medium"

    score = 25

    recommendation = (
        "Verify that the IAM user creation was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "CreateUser":

            return Detection().to_dict()

        mitre = get_mitre_mapping("CreateUser")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"IAM user '{context.get('target_user')}' was created."
            ),

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()