// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract LoanContract {
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        bool repaid;
    }

    uint256 public nextId = 1;
    mapping(uint256 => Loan) public loans;

    function createLoan(uint256 amount) public returns (uint256) {
        loans[nextId] = Loan(nextId, msg.sender, amount, false);
        nextId++;
        return nextId - 1; // return the ID just created
    }

    function repayLoan(uint256 loanId) public {
        require(loans[loanId].borrower == msg.sender, "Not borrower");
        loans[loanId].repaid = true;
    }

    function getLoan(uint256 loanId) public view returns (Loan memory) {
        return loans[loanId];
    }
}
