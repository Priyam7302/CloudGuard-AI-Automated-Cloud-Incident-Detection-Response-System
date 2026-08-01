"""
CloudGuard AI
Risk Engine

Runs all registered detection rules and
calculates the cumulative risk score.
"""

from rules.registry import ALL_RULES


def analyze_risk(event, context):

    detections = []

    total_score = 0

    highest_severity = "Low"

    severity_rank = {

        "Low": 1,

        "Medium": 2,

        "High": 3,

        "Critical": 4

    }

    for rule in ALL_RULES:

        try:

            result = rule.evaluate(
                event,
                context
            )

            if result.get("matched"):

                detections.append(result)

                total_score += result.get(
                    "score",
                    0
                )

                if severity_rank[
                    result["severity"]
                ] > severity_rank[
                    highest_severity
                ]:

                    highest_severity = result[
                        "severity"
                    ]

        except Exception as e:

            print(
                f"[RiskEngine] Rule "
                f"{rule.__class__.__name__} "
                f"failed: {e}"
            )

    return {

        "risk_score": total_score,

        "severity": highest_severity,

        "detections": detections

    }