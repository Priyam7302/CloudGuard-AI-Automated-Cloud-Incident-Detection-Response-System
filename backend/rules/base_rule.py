"""
CloudGuard AI

Base Detection Rule
"""


class DetectionRule:
    """
    Base class for all detection rules.
    """

    name = "Base Rule"
    category = "Generic"
    severity = "Low"
    score = 0
    recommendation = ""
    mitre = "UNKNOWN"

    def evaluate(self, event, context):
        """
        Every detection rule must override this method.
        """
        raise NotImplementedError(
            f"{self.__class__.__name__} must implement evaluate()"
        )