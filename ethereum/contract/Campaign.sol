// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract CampaignFactory {
    address[] campaignAddresses;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(msg.sender, minimum);
        campaignAddresses.push(address(newCampaign));
    }

    function getCampaign() public view returns (address[] memory) {
        return campaignAddresses;
    }
}

contract Campaign {
    struct Request {
        string description;
        address payable recipient;
        uint256 value;
        bool complete;
        uint256 postiveVotes;
        mapping(address => bool) voted;
    }

    address public manager;
    mapping(address => bool) public approvers;
    uint256 public minContribution;
    mapping(uint256 => Request) public requests;
    uint256 reqSize;
    uint256 aprSize;

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can use this function");
        _;
    }

    constructor(address creator, uint256 minAmount) {
        manager = creator;
        minContribution = minAmount;
        reqSize = 0;
        aprSize = 0;
    }

    function contribute() public payable {
        require(
            msg.value >= minContribution,
            "contribution should be greater than minimum contribution"
        );
        require(
            !approvers[msg.sender],
            "contribution can only be made one time"
        );
        approvers[msg.sender] = true;
        aprSize++;
    }

    function createRequest(
        string memory description,
        address payable recipient,
        uint256 value
    ) public onlyManager {
        Request storage newRequest = requests[reqSize];
        newRequest.description = description;
        newRequest.recipient = recipient;
        newRequest.value = value;
        newRequest.complete = false;
        newRequest.postiveVotes = 0;
        reqSize++;
    }

    function approveRequest(uint256 reqIndex) public {
        Request storage r = requests[reqIndex];
        require(
            approvers[msg.sender],
            "Only contributers can use this function"
        );
        require(!r.voted[msg.sender], "You have already voted");
        r.postiveVotes++;
        r.voted[msg.sender] = true;
    }

    function finalizeRequest(uint256 reqIndex) public payable onlyManager {
        Request storage r = requests[reqIndex];
        require(!r.complete, "request already finalized");
        require(r.postiveVotes > aprSize / 2, "Not enough postive votes");
        r.complete = true;
        r.recipient.transfer(r.value);
    }

    function getSummary()
        public
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            manager,
            minContribution,
            reqSize,
            aprSize,
            address(this).balance
        );
    }
}
