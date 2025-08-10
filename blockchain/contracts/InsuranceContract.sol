// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

contract InsuranceContract is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    enum PolicyStatus {
        Active,
        Claimed,
        Inactive,
        Expired
    }

    enum PaymentStatus {
        Pending,
        Completed,
        Failed,
        Refunded
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        uint256 amount;
        bool approved;
        uint256 timestamp;
        string description;
    }

    struct Policy {
        uint256 id;
        address policyholder;
        uint256 coverage;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        uint256 nextPaymentDate;
        PolicyStatus status;
        uint256[] claimIds;
        uint256 totalPaid;
        uint256 utilizationRate;
    }

    struct Payment {
        uint256 id;
        uint256 policyId;
        address payer;
        uint256 amount;
        PaymentStatus status;
        uint256 timestamp;
        string transactionHash;
    }

    uint256 private nextPolicyId;
    uint256 private nextClaimId;
    uint256 private nextPaymentId;

    mapping(uint256 => Policy) private policies;
    mapping(uint256 => Claim) private claims;
    mapping(uint256 => Payment) private payments;
    mapping(address => uint256[]) private userPolicies;
    mapping(uint256 => uint256[]) private policyPayments;

    // Events
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, uint256 coverage, uint256 premium);
    event PremiumPaid(uint256 indexed policyId, address indexed payer, uint256 amount, uint256 paymentId);
    event ClaimFiled(uint256 indexed claimId, uint256 indexed policyId, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, uint256 indexed policyId, uint256 amount);
    event PolicyStatusChanged(uint256 indexed policyId, PolicyStatus newStatus);
    event PaymentRefunded(uint256 indexed paymentId, address indexed recipient, uint256 amount);

    // Modifiers
    modifier onlyPolicyholder(uint256 policyId) {
        require(policies[policyId].policyholder == msg.sender, "Not policyholder");
        _;
    }

    modifier policyExists(uint256 policyId) {
        require(policies[policyId].policyholder != address(0), "Policy does not exist");
        _;
    }

    modifier policyActive(uint256 policyId) {
        require(policies[policyId].status == PolicyStatus.Active, "Policy not active");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new insurance policy with ETH payment
     * @param coverage The coverage amount in wei
     * @param premium The premium amount in wei
     * @param durationDays Duration of the policy in days
     */
    function createPolicyWithPayment(
        uint256 coverage,
        uint256 premium,
        uint256 durationDays
    ) external payable nonReentrant returns (uint256) {
        require(msg.value == premium, "Incorrect premium amount");
        require(coverage > 0, "Coverage must be greater than 0");
        require(premium > 0, "Premium must be greater than 0");
        require(durationDays > 0, "Duration must be greater than 0");
        require(userPolicies[msg.sender].length == 0, "Policy already purchased");

        uint256 policyId = nextPolicyId;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate.add(durationDays.mul(1 days));
        uint256 nextPaymentDate = startDate.add(30 days); // Monthly payments

        policies[policyId] = Policy({
            id: policyId,
            policyholder: msg.sender,
            coverage: coverage,
            premium: premium,
            startDate: startDate,
            endDate: endDate,
            nextPaymentDate: nextPaymentDate,
            status: PolicyStatus.Active,
            claimIds: new uint256[](0),
            totalPaid: premium,
            utilizationRate: 0
        });

        // Create payment record
        uint256 paymentId = nextPaymentId;
        payments[paymentId] = Payment({
            id: paymentId,
            policyId: policyId,
            payer: msg.sender,
            amount: premium,
            status: PaymentStatus.Completed,
            timestamp: block.timestamp,
            transactionHash: ""
        });

        // Update mappings
        userPolicies[msg.sender].push(policyId);
        policyPayments[policyId].push(paymentId);

        // Update counters
        nextPolicyId = nextPolicyId.add(1);
        nextPaymentId = nextPaymentId.add(1);

        emit PolicyCreated(policyId, msg.sender, coverage, premium);
        emit PremiumPaid(policyId, msg.sender, premium, paymentId);

        return policyId;
    }

    /**
     * @dev Pay premium for an existing policy
     * @param policyId The ID of the policy
     */
    function payPremium(uint256 policyId) external payable nonReentrant policyExists(policyId) policyActive(policyId) {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not policyholder");
        require(msg.value == policy.premium, "Incorrect premium amount");
        require(block.timestamp >= policy.nextPaymentDate, "Payment not due yet");

        // Update policy
        policy.totalPaid = policy.totalPaid.add(msg.value);
        policy.nextPaymentDate = policy.nextPaymentDate.add(30 days);

        // Create payment record
        uint256 paymentId = nextPaymentId;
        payments[paymentId] = Payment({
            id: paymentId,
            policyId: policyId,
            payer: msg.sender,
            amount: msg.value,
            status: PaymentStatus.Completed,
            timestamp: block.timestamp,
            transactionHash: ""
        });

        policyPayments[policyId].push(paymentId);
        nextPaymentId = nextPaymentId.add(1);

        emit PremiumPaid(policyId, msg.sender, msg.value, paymentId);
    }

    /**
     * @dev File a claim for a policy
     * @param policyId The ID of the policy
     * @param amount The claim amount in wei
     * @param description Description of the claim
     */
    function fileClaim(
        uint256 policyId,
        uint256 amount,
        string memory description
    ) external onlyPolicyholder(policyId) policyActive(policyId) returns (uint256) {
        Policy storage policy = policies[policyId];
        require(amount <= policy.coverage, "Claim amount exceeds coverage");
        require(amount > 0, "Claim amount must be greater than 0");

        uint256 claimId = nextClaimId;
        claims[claimId] = Claim({
            id: claimId,
            policyId: policyId,
            amount: amount,
            approved: false,
            timestamp: block.timestamp,
            description: description
        });

        policy.claimIds.push(claimId);
        nextClaimId = nextClaimId.add(1);

        emit ClaimFiled(claimId, policyId, amount);
        return claimId;
    }

    /**
     * @dev Approve a claim and transfer funds to policyholder
     * @param claimId The ID of the claim
     */
    function approveClaim(uint256 claimId) external onlyOwner nonReentrant {
        Claim storage claim = claims[claimId];
        require(!claim.approved, "Already approved");
        require(claim.id == claimId, "Claim does not exist");

        Policy storage policy = policies[claim.policyId];
        require(policy.status == PolicyStatus.Active, "Policy not active");

        claim.approved = true;

        // Transfer claim amount to policyholder
        (bool success, ) = policy.policyholder.call{value: claim.amount}("");
        require(success, "Transfer failed");

        // Update policy utilization rate
        policy.utilizationRate = policy.utilizationRate.add(claim.amount);

        emit ClaimApproved(claimId, claim.policyId, claim.amount);
    }

    /**
     * @dev Update policy status
     * @param policyId The ID of the policy
     * @param newStatus The new status
     */
    function updatePolicyStatus(uint256 policyId, PolicyStatus newStatus) external onlyOwner policyExists(policyId) {
        policies[policyId].status = newStatus;
        emit PolicyStatusChanged(policyId, newStatus);
    }

    /**
     * @dev Get policy details
     * @param policyId The ID of the policy
     */
    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }

    /**
     * @dev Get claim details
     * @param claimId The ID of the claim
     */
    function getClaim(uint256 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }

    /**
     * @dev Get payment details
     * @param paymentId The ID of the payment
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    /**
     * @dev Get all policies for a user
     * @param user The user address
     */
    function getUserPolicies(address user) external view returns (uint256[] memory) {
        return userPolicies[user];
    }

    /**
     * @dev Get all payments for a policy
     * @param policyId The ID of the policy
     */
    function getPolicyPayments(uint256 policyId) external view returns (uint256[] memory) {
        return policyPayments[policyId];
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Emergency refund function (owner only)
     * @param paymentId The ID of the payment to refund
     */
    function emergencyRefund(uint256 paymentId) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.status == PaymentStatus.Completed, "Payment not completed");
        
        payment.status = PaymentStatus.Refunded;
        
        (bool success, ) = payment.payer.call{value: payment.amount}("");
        require(success, "Refund failed");
        
        emit PaymentRefunded(paymentId, payment.payer, payment.amount);
    }

    // Fallback function to receive ETH
    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }
}

