"""
CloudGuard AI

Rule Registry

Registers all detection rules.
"""

# ==========================
# Common Rules
# ==========================

from rules.common.mfa_rule import MFARule
from rules.common.cross_user_rule import CrossUserRule
from rules.common.after_hours_rule import AfterHoursRule
from rules.common.user_agent_rule import UserAgentRule

# ==========================
# IAM Rules
# ==========================

from rules.iam.root_user import RootUserRule
from rules.iam.create_user_rule import CreateUserRule
from rules.iam.create_access_key_rule import CreateAccessKeyRule
from rules.iam.create_login_profile_rule import CreateLoginProfileRule
from rules.iam.attach_user_policy_rule import AttachUserPolicyRule
from rules.iam.attach_group_policy_rule import AttachGroupPolicyRule
from rules.iam.put_user_policy_rule import PutUserPolicyRule
from rules.iam.update_assume_role_policy_rule import UpdateAssumeRolePolicyRule
from rules.iam.delete_trail_rule import DeleteTrailRule
from rules.iam.stop_logging_rule import StopLoggingRule

# ==========================
# EC2 Rules
# ==========================

from rules.ec2.run_instances_rule import RunInstancesRule
from rules.ec2.start_instances_rule import StartInstancesRule
from rules.ec2.stop_instances_rule import StopInstancesRule
from rules.ec2.terminate_instances_rule import TerminateInstancesRule
from rules.ec2.modify_security_group_rule import ModifySecurityGroupRule
from rules.ec2.create_snapshot_rule import CreateSnapshotRule


ALL_RULES = [

    # Common
    MFARule(),
    CrossUserRule(),
    AfterHoursRule(),
    UserAgentRule(),

    # IAM
    RootUserRule(),
    CreateUserRule(),
    CreateAccessKeyRule(),
    CreateLoginProfileRule(),
    AttachUserPolicyRule(),
    AttachGroupPolicyRule(),
    PutUserPolicyRule(),
    UpdateAssumeRolePolicyRule(),
    DeleteTrailRule(),
    StopLoggingRule(),

    # EC2
    RunInstancesRule(),
    StartInstancesRule(),
    StopInstancesRule(),
    TerminateInstancesRule(),
    ModifySecurityGroupRule(),
    CreateSnapshotRule()

]