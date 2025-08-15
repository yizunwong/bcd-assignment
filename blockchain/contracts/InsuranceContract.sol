// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract InsuranceContract is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant INSURANCE_ADMIN_ROLE = keccak256("INSURANCE_ADMIN_ROLE");

    IERC20 public paymentToken;

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

    // Role management
    function addAdmin(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(INSURANCE_ADMIN_ROLE, account);
    }

    function removeAdmin(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(INSURANCE_ADMIN_ROLE, account);
    }

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Invalid token address");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(INSURANCE_ADMIN_ROLE, msg.sender);
        paymentToken = IERC20(tokenAddress);
        nextCoverageId = 1;
        nextClaimId = 1;
        nextPaymentId = 1;
    }

    /**
     * @dev Create a new insurance coverage with token payment
     * @param coverage The coverage amount in token smallest units
     * @param premium The premium amount in token smallest units
     * @param durationDays Duration of the coverage in days
     */
    function createCoverageWithTokenPayment(
        uint256 coverage,
        uint256 premium,
        uint256 durationDays,
        string memory agreementCid,
        string memory name,
        string memory category,
        string memory provider
    ) external nonReentrant returns (uint256) {
        require(coverage > 0, "Coverage must be greater than 0");
        require(premium > 0, "Premium must be greater than 0");
        require(durationDays > 0, "Duration must be greater than 0");
        require(bytes(agreementCid).length > 0, "Agreement CID not set");

        // Transfer premium tokens from user to contract
        paymentToken.safeTransferFrom(msg.sender, address(this), premium);

        uint256 coverageId = nextCoverageId;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + (durationDays * 1 days);
        uint256 nextPaymentDate = startDate + 30 days; // Monthly payments

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
        nextCoverageId = nextCoverageId + 1;
        nextPaymentId = nextPaymentId + 1;

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
        nonReentrant
        coverageExists(coverageId)
        coverageActive(coverageId)
    {
        Coverage storage coverage = coverages[coverageId];
        require(coverage.policyholder == msg.sender, "Not policyholder");

        // Transfer premium tokens from policyholder
        paymentToken.safeTransferFrom(msg.sender, address(this), coverage.premium);

        uint256 gracePeriod = 7 days; // Can make this configurable per coverage type

        // Check if payment is within allowed window
        require(
            block.timestamp <= coverage.nextPaymentDate + gracePeriod,
            "Payment overdue"
        );

        // Update coverage payment info
        coverage.totalPaid = coverage.totalPaid + coverage.premium;

        // If paying early, just push nextPaymentDate forward from current cycle
        if (block.timestamp < coverage.nextPaymentDate) {
            coverage.nextPaymentDate = coverage.nextPaymentDate + 30 days;
        }
        // If paying late but still within grace period, set new cycle from now
        else {
            coverage.nextPaymentDate = block.timestamp + 30 days;
        }

        // Record payment
        uint256 paymentId = nextPaymentId;
        payments[paymentId] = Payment({
            id: paymentId,
            coverageId: coverageId,
            payer: msg.sender,
            amount: coverage.premium,
            status: PaymentStatus.Completed,
            timestamp: block.timestamp
        });

        coveragePayments[coverageId].push(paymentId);
        nextPaymentId++;

        emit PremiumPaid(coverageId, msg.sender, coverage.premium, paymentId);
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
        nextClaimId++;

        emit ClaimFiled(claimId, coverageId, amount);
        return claimId;
    }

    /**
     * @dev Approve a claim and transfer funds to policyholder
     * @param claimId The ID of the claim
     */
    function approveClaim(
        uint256 claimId
    ) external onlyRole(INSURANCE_ADMIN_ROLE) nonReentrant {
        Claim storage claim = claims[claimId];
        require(!claim.approved, "Already approved");
        require(claim.id == claimId, "Claim does not exist");

        Coverage storage coverage = coverages[claim.coverageId];
        require(
            coverage.status == CoverageStatus.Active,
            "Coverage not active"
        );

        uint256 totalApprovedAmount = (coverage.utilizationRate *
            coverage.coverage) / 100;
        require(
            totalApprovedAmount + claim.amount <= coverage.coverage,
            "Exceeds coverage cap"
        );

        claim.approved = true;
        totalApprovedAmount += claim.amount;
        coverage.utilizationRate = (coverage.coverage > 0)
            ? (totalApprovedAmount * 100) / coverage.coverage
            : 0;

        // Transfer claim amount to policyholder in tokens
        paymentToken.safeTransfer(coverage.policyholder, claim.amount);

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
    ) external onlyRole(DEFAULT_ADMIN_ROLE) coverageExists(coverageId) {
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
     * @dev Withdraw contract token balance (admin only)
     */
    function withdrawTokenBalance() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        paymentToken.safeTransfer(msg.sender, balance);
    }

    /**
     * @dev Get contract token balance
     */
    function getContractTokenBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }

    /**
     * @dev Emergency refund function (admin only)
     * @param paymentId The ID of the payment to refund
     */
    function emergencyRefund(
        uint256 paymentId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        Payment storage payment = payments[paymentId];
        require(
            payment.status == PaymentStatus.Completed,
            "Payment not completed"
        );

        payment.status = PaymentStatus.Refunded;

        paymentToken.safeTransfer(payment.payer, payment.amount);

        emit PaymentRefunded(paymentId, payment.payer, payment.amount);
    }

    // Fallback function to reject ETH
    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }
}
