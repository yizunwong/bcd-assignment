// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev SafeMath library from OpenZeppelin Contracts v4.9.0
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }
}

contract InsuranceContract is Ownable {
    using SafeMath for uint256;

    enum PolicyStatus {
        Active,
        Claimed,
        Inactive
    }

    struct Claim {
        uint256 id;
        uint256 amount;
        bool approved;
    }

    struct Policy {
        address policyholder;
        uint256 coverage;
        uint256 premium;
        PolicyStatus status;
        uint256[] claimIds;
    }

    uint256 private nextPolicyId;
    uint256 private nextClaimId;

    mapping(uint256 => Policy) private policies;
    mapping(uint256 => Claim) private claims;

    constructor() Ownable(msg.sender) {}

    function createPolicy(address policyholder, uint256 coverage, uint256 premium)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 policyId = nextPolicyId;
        policies[policyId] = Policy({
            policyholder: policyholder,
            coverage: coverage,
            premium: premium,
            status: PolicyStatus.Active,
            claimIds: new uint256[](0)
        });
        nextPolicyId = nextPolicyId.add(1);
        return policyId;
    }

    function payPremium(uint256 policyId) external payable {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not policyholder");
        require(policy.status == PolicyStatus.Active, "Policy inactive");
        require(msg.value == policy.premium, "Incorrect premium amount");
    }

    function fileClaim(uint256 policyId, uint256 amount) external returns (uint256) {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not policyholder");
        require(policy.status == PolicyStatus.Active, "Policy inactive");

        uint256 claimId = nextClaimId;
        claims[claimId] = Claim({id: claimId, amount: amount, approved: false});
        policy.claimIds.push(claimId);
        nextClaimId = nextClaimId.add(1);
        return claimId;
    }

    function approveClaim(uint256 claimId) external onlyOwner {
        Claim storage claim = claims[claimId];
        require(!claim.approved, "Already approved");
        claim.approved = true;
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }
}

