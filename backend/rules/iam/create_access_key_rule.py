"""
CloudGuard AI

IAM Rule

Detect CreateAccessKey events.
"""

from rules.base_rule import DetectionRule
from rules.detection import Detection
from mitre.mitre_mapping import get_mitre_mapping


class CreateAccessKeyRule(DetectionRule):

    name = "CreateAccessKey"

    category = "IAM"

    severity = "High"

    score = 30

    recommendation = (
        "Verify that the access key creation was authorized."
    )

    def evaluate(self, event, context):

        if context.get("event_name") != "CreateAccessKey":

            return Detection().to_dict()

        mitre = get_mitre_mapping("CreateAccessKey")

        return Detection(

            matched=True,

            rule=self.name,

            category=self.category,

            severity=self.severity,

            score=self.score,

            reason=(
                f"New Access Key created for IAM user "
                f"'{context.get('target_user')}'."
            ),

            recommendation=self.recommendation,

            mitre=mitre

        ).to_dict()