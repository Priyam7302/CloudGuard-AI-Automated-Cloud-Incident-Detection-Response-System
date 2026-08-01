"""
CloudGuard AI
Detection Object
"""


class Detection:

    def __init__(
        self,
        matched=False,
        rule="",
        category="",
        severity="Low",
        score=0,
        reason="",
        recommendation="",
        mitre="UNKNOWN"
    ):

        self.matched = matched
        self.rule = rule
        self.category = category
        self.severity = severity
        self.score = score
        self.reason = reason
        self.recommendation = recommendation
        self.mitre = mitre

    def to_dict(self):

        return {

            "matched": self.matched,

            "rule": self.rule,

            "category": self.category,

            "severity": self.severity,

            "score": self.score,

            "reason": self.reason,

            "recommendation": self.recommendation,

            "mitre": self.mitre

        }