"""
CloudGuard AI

IAM Rule

Detect CreateLoginProfile events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class CreateLoginProfileRule(DetectionRule):

    name = "CreateLoginProfile"

    category = "IAM"

    severity = "High"

    score = 30

    recommendation = (
        "Verify that the console login profile creation was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "CreateLoginProfile":

            return Detection().to_dict()

        mitre = get_mitre_mapping("CreateLoginProfile")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"Console login profile created for IAM user "
                f"'{context.get('target_user')}'."
            ),

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()