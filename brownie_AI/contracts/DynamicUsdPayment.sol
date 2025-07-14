// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DynamicUsdPayment {
    AggregatorV3Interface internal priceFeed;

    struct Request {
        address recipient;
        uint usdAmount; // in cents
        bool paid;
    }

    uint public requestCount;
    mapping(uint => Request) public requests;

    event Requested(uint id, address recipient, uint usdAmount);
    event Paid(uint id, address payer, uint ethAmount);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function createRequest(uint usdAmountInCents) external returns (uint) {
        requests[requestCount] = Request(msg.sender, usdAmountInCents, false);
        emit Requested(requestCount, msg.sender, usdAmountInCents);
        requestCount++;
        return requestCount - 1;
    }

    function payRequest(uint requestId) external payable {
        Request storage r = requests[requestId];
        require(!r.paid, "Already paid");

        uint requiredEth = getEthAmount(r.usdAmount);
        require(msg.value >= requiredEth, "Not enough ETH sent");

        r.paid = true;

        // SAFER: use .call instead of .transfer
        (bool success, ) = payable(r.recipient).call{value: requiredEth}("");
        require(success, "Transfer to recipient failed");

        emit Paid(requestId, msg.sender, requiredEth);
    }

    function getEthAmount(uint usdAmountInCents) public view returns (uint) {
        (, int price,,,) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed");

        uint ethPrice = uint(price); // ETH/USD with 8 decimals
        return (usdAmountInCents * 1e18 * 1e2) / ethPrice; // USD cents → ETH (in wei)
    }

    function getLatestPrice() external view returns (int) {
        (, int price,,,) = priceFeed.latestRoundData();
        return price;
    }
}
