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

    enum CoverageStatus {
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
        uint256 coverageId;
        uint256 amount;
        bool approved;
        uint256 timestamp;
        string description;
    }

    struct Coverage {
        uint256 id;
        address policyholder;
        string name;
        string category;
        string provider;
        uint256 coverage;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        uint256 nextPaymentDate;
        CoverageStatus status;
        uint256[] claimIds;
        uint256 totalPaid;
        uint256 utilizationRate;
        string agreementCid;
    }

    struct Payment {
        uint256 id;
        uint256 coverageId;
        address payer;
        uint256 amount;
        PaymentStatus status;
        uint256 timestamp;
    }

    uint256 private nextCoverageId;
    uint256 private nextClaimId;
    uint256 private nextPaymentId;

    mapping(uint256 => Coverage) private coverages;
    mapping(uint256 => Claim) private claims;
    mapping(uint256 => Payment) private payments;
    mapping(address => uint256[]) private userCoverages;
    mapping(uint256 => uint256[]) private coveragePayments;

    // Events
    event CoverageCreated(
        uint256 indexed coverageId,
        address indexed policyholder,
        uint256 coverage,
        uint256 premium
    );
    event PremiumPaid(
        uint256 indexed coverageId,
        address indexed payer,
        uint256 amount,
        uint256 paymentId
    );
    event ClaimFiled(
        uint256 indexed claimId,
        uint256 indexed coverageId,
        uint256 amount
    );
    event ClaimApproved(
        uint256 indexed claimId,
        uint256 indexed coverageId,
        uint256 amount
    );
    event CoverageStatusChanged(
        uint256 indexed coverageId,
        CoverageStatus newStatus
    );
    event CoverageLapsed(uint256 indexed coverageId, uint256 timestamp);
    event PaymentRefunded(
        uint256 indexed paymentId,
        address indexed recipient,
        uint256 amount
    );

    // Modifiers
    modifier onlyCoverageholder(uint256 coverageId) {
        require(
            coverages[coverageId].policyholder == msg.sender,
            "Not policyholder"
        );
        _;
    }

    modifier coverageExists(uint256 coverageId) {
        require(
            coverages[coverageId].policyholder != address(0),
            "Coverage does not exist"
        );
        _;
    }

    modifier coverageActive(uint256 coverageId) {
        require(
            coverages[coverageId].status == CoverageStatus.Active,
            "Coverage not active"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        nextCoverageId = 1;
        nextClaimId = 1;
        nextPaymentId = 1;
    }
    /**
     * @dev Create a new insurance coverage with ETH payment
     * @param coverage The coverage amount in wei
     * @param premium The premium amount in wei
     * @param durationDays Duration of the coverage in days
     */
    function createCoverageWithPayment(
        uint256 coverage,
        uint256 premium,
        uint256 durationDays,
        string memory agreementCid,
        string memory name,
        string memory category,
        string memory provider
    ) external payable nonReentrant returns (uint256) {
        require(msg.value == premium, "Incorrect premium amount");
        require(coverage > 0, "Coverage must be greater than 0");
        require(premium > 0, "Premium must be greater than 0");
        require(durationDays > 0, "Duration must be greater than 0");
        require(bytes(agreementCid).length > 0, "Agreement CID not set");

        uint256 coverageId = nextCoverageId;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate.add(durationDays.mul(1 days));
        uint256 nextPaymentDate = startDate.add(30 days); // Monthly payments

        coverages[coverageId] = Coverage({
            id: coverageId,
            policyholder: msg.sender,
            name: name,
            category: category,
            provider: provider,
            coverage: coverage,
            premium: premium,
            startDate: startDate,
            endDate: endDate,
            nextPaymentDate: nextPaymentDate,
            status: CoverageStatus.Active,
            claimIds: new uint256[](0),
            totalPaid: premium,
            utilizationRate: 0,
            agreementCid: agreementCid
        });

        // Create payment record
        uint256 paymentId = nextPaymentId;
        payments[paymentId] = Payment({
            id: paymentId,
            coverageId: coverageId,
            payer: msg.sender,
            amount: premium,
            status: PaymentStatus.Completed,
            timestamp: block.timestamp
        });

        // Update mappings
        userCoverages[msg.sender].push(coverageId);
        coveragePayments[coverageId].push(paymentId);

        // Update counters
        nextCoverageId = nextCoverageId.add(1);
        nextPaymentId = nextPaymentId.add(1);

        emit CoverageCreated(coverageId, msg.sender, coverage, premium);
        emit PremiumPaid(coverageId, msg.sender, premium, paymentId);

        return coverageId;
    }

    /**
     * @dev Pay premium for an existing coverage
     * @param coverageId The ID of the coverage
     */
    function payPremium(
        uint256 coverageId
    )
        external
        payable
        nonReentrant
        coverageExists(coverageId)
        coverageActive(coverageId)
    {
        Coverage storage coverage = coverages[coverageId];
        require(coverage.policyholder == msg.sender, "Not policyholder");
        require(msg.value == coverage.premium, "Incorrect premium amount");

        uint256 gracePeriod = 7 days; // Can make this configurable per coverage type

        // Check if payment is within allowed window
        require(
            block.timestamp <= coverage.nextPaymentDate + gracePeriod,
            "Payment overdue"
        );

        // Update coverage payment info
        coverage.totalPaid = coverage.totalPaid.add(msg.value);

        // If paying early, just push nextPaymentDate forward from current cycle
        if (block.timestamp < coverage.nextPaymentDate) {
            coverage.nextPaymentDate = coverage.nextPaymentDate.add(30 days);
        }
        // If paying late but still within grace period, set new cycle from now
        else {
            coverage.nextPaymentDate = block.timestamp.add(30 days);
        }

        // Record payment
        uint256 paymentId = nextPaymentId;
        payments[paymentId] = Payment({
            id: paymentId,
            coverageId: coverageId,
            payer: msg.sender,
            amount: msg.value,
            status: PaymentStatus.Completed,
            timestamp: block.timestamp
        });

        coveragePayments[coverageId].push(paymentId);
        nextPaymentId = nextPaymentId.add(1);

        emit PremiumPaid(coverageId, msg.sender, msg.value, paymentId);
    }

    /**
     * @dev File a claim for a coverage
     * @param coverageId The ID of the coverage
     * @param amount The claim amount in wei
     * @param description Description of the claim
     */
    function fileClaim(
        uint256 coverageId,
        uint256 amount,
        string memory description
    )
        external
        onlyCoverageholder(coverageId)
        coverageActive(coverageId)
        returns (uint256)
    {
        Coverage storage coverage = coverages[coverageId];
        require(amount <= coverage.coverage, "Claim amount exceeds coverage");
        require(amount > 0, "Claim amount must be greater than 0");

        uint256 claimId = nextClaimId;
        claims[claimId] = Claim({
            id: claimId,
            coverageId: coverageId,
            amount: amount,
            approved: false,
            timestamp: block.timestamp,
            description: description
        });

        coverage.claimIds.push(claimId);
        nextClaimId = nextClaimId.add(1);

        emit ClaimFiled(claimId, coverageId, amount);
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

        Coverage storage coverage = coverages[claim.coverageId];
        require(
            coverage.status == CoverageStatus.Active,
            "Coverage not active"
        );

        claim.approved = true;

        // Transfer claim amount to policyholder
        (bool success, ) = coverage.policyholder.call{value: claim.amount}("");
        require(success, "Transfer failed");

        // Update coverage utilization rate
        coverage.utilizationRate = coverage.utilizationRate.add(claim.amount);

        emit ClaimApproved(claimId, claim.coverageId, claim.amount);
    }

    function checkAndLapseCoverage(uint256 coverageId) public {
        Coverage storage coverage = coverages[coverageId];
        uint256 gracePeriod = 7 days;
        if (block.timestamp > coverage.nextPaymentDate + gracePeriod) {
            coverage.status = CoverageStatus.Inactive;
            emit CoverageLapsed(coverageId, block.timestamp);
        }
    }

    /**
     * @dev Update coverage status
     * @param coverageId The ID of the coverage
     * @param newStatus The new status
     */
    function updateCoverageStatus(
        uint256 coverageId,
        CoverageStatus newStatus
    ) external onlyOwner coverageExists(coverageId) {
        coverages[coverageId].status = newStatus;
        emit CoverageStatusChanged(coverageId, newStatus);
    }

    /**
     * @dev Get coverage details
     * @param coverageId The ID of the coverage
     */
    function getCoverage(
        uint256 coverageId
    ) external view returns (Coverage memory) {
        return coverages[coverageId];
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
    function getPayment(
        uint256 paymentId
    ) external view returns (Payment memory) {
        return payments[paymentId];
    }

    /**
     * @dev Get all coverages for the caller
     */
    function getMyCoverages() external view returns (uint256[] memory) {
        return userCoverages[msg.sender];
    }

    /**
     * @dev Get all payments for a coverage
     * @param coverageId The ID of the coverage
     */
    function getCoveragePayments(
        uint256 coverageId
    ) external view returns (uint256[] memory) {
        return coveragePayments[coverageId];
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
    function emergencyRefund(
        uint256 paymentId
    ) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(
            payment.status == PaymentStatus.Completed,
            "Payment not completed"
        );

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
