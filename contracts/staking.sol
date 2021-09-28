pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ERC20_test {
  function balanceOf(address who) external view returns (uint256 balance);

  function transfer(address to, uint256 value) external returns (bool trans1);

  function allowance(address owner, address spender) external view returns (uint256 remaining);

  function transferFrom(
    address from,
    address to,
    uint256 value
  ) external returns (bool trans);

  function approve(address spender, uint256 value) external returns (bool hello);

}

contract Staking {

    ERC20_test public TOKENA;
    ERC20_test public TOKENB;

    struct stake_stats {
        uint256 start;
        uint256 amounta;
        uint256 last_harvest;
    }

    uint256 public rate = 5;
    uint256 public stakePeriod = 1 hours;

    mapping(address => stake_stats) public stakes;


    function stake(uint256 amount) public {
        require(stakes[msg.sender].start == 0, "Already staking");
        require(TOKENA.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        stakes[msg.sender] = stake_stats({start: block.timestamp, amounta: amount, last_harvest: block.timestamp});
    }

    function harvest() public {
        require(stakes[msg.sender].start != 0, "You have not a stake running");
        uint256 amount;
        // console.log(block.timestamp - stakes[msg.sender].last_harvest, stakes[msg.sender].amounta, rate, ((block.timestamp - stakes[msg.sender].last_harvest) * stakes[msg.sender].amounta * rate) / 100);
        // console.log(block.timestamp - stakes[msg.sender].last_harvest);
        amount = ((block.timestamp - stakes[msg.sender].last_harvest) * stakes[msg.sender].amounta * rate) / 100;
        // console.log(amount, '++', block.timestamp - stakes[msg.sender].last_harvest);
        stakes[msg.sender].last_harvest = block.timestamp;
        TOKENB.transfer(msg.sender, amount);
    }

    function unstake() public {
        require(stakes[msg.sender].start != 0, "You have not a stake running");
        require(block.timestamp - stakes[msg.sender].start > 299, "You can unstake only after 5 minutes!");
        harvest();
        TOKENA.transfer(msg.sender, stakes[msg.sender].amounta);
        stakes[msg.sender].start = 0;
    }

    constructor(address TA, address TB) {
        TOKENA = ERC20_test(TA);
        TOKENB = ERC20_test(TB);

    }

}
