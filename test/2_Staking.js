const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("Staking contract", function () {

  beforeEach(async function () {
    Staking = await ethers.getContractFactory("Staking");
    Token = await ethers.getContractFactory("ERC20_token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    tokenA = await Token.deploy("TokenA", "TA");
    tokenB = await Token.deploy("TokenB", "TB");
    staking = await Staking.deploy(tokenA.address, tokenB.address);

    max_amount = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

    amount_of_iteration = 22;

    time_after_stake = 300; 

    contract_rate = 5 

    await tokenA.approve(staking.address, max_amount);
    await tokenB.transfer(staking.address, max_amount);

    
  });
  
  describe("Harvest", async function () {
    it("Check if harvest works properly", async function () {

      amount_harvest_test = BigNumber.from(10);

      await tokenA.connect(addr1).approve(staking.address, max_amount);
      await tokenA.transfer(addr1.address, max_amount);

      for (let count = 1; count < (amount_of_iteration + 1); count+=1) {

        previous_balance = BigNumber.from((await tokenB.balanceOf(addr1.address)).toString())

        await staking.connect(addr1).stake(amount_harvest_test);
        await timeAndMine.setTimeIncrease(time_after_stake);
        await staking.connect(addr1).harvest();
        
        harvested = amount_harvest_test.mul(contract_rate).mul(time_after_stake).div(100);
        expected = BigNumber.from((await tokenB.balanceOf(addr1.address)).toString()).sub(previous_balance);
        
        expect(harvested).to.equal(expected);
        
        await staking.connect(addr1).unstake();

        amount_harvest_test = amount_harvest_test.mul(10);
      };

    });
  });

  describe("Unstake", async function () {
    it("Check unstake works properly", async function () {
      await tokenA.transfer(addr1.address, 10);
      await tokenA.connect(addr1).approve(staking.address, 10);
      await staking.connect(addr1).stake(10);
      await timeAndMine.setTimeIncrease(300);
      await staking.connect(addr1).unstake();
      expect(await tokenA.balanceOf(addr1.address)).to.equal(10);
    });
  });

  describe("Unstake", async function () {
    it("Check if it's not possible to unstake earlier than 5 min", async function () {
      await tokenA.transfer(addr1.address, 10);
      await tokenA.connect(addr1).approve(staking.address, 10);
      await staking.connect(addr1).stake(10);
      await timeAndMine.setTimeIncrease(299);
      await expect(staking.connect(addr1).unstake()).to.be.revertedWith('You can unstake only after 5 minutes!');
    });
  });

  describe("Unstake", async function () {
    it("Check if it's not possible to unstake multiple times", async function () {
      await tokenA.transfer(addr1.address, 10);
      await tokenA.transfer(staking.address, 50);
      await tokenA.connect(addr1).approve(staking.address, 10);
      await staking.connect(addr1).stake(10);
      await timeAndMine.setTimeIncrease(300);
      await staking.connect(addr1).unstake();
      await timeAndMine.setTimeIncrease(1);
      await expect(staking.connect(addr1).unstake()).to.be.revertedWith('You have not a stake running');
    });
  });

});