const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking contract", function () {

  let Staking;
  let Token;
  let addrs;
  let addr1;
  let addr2;
  let owner;
  let tokenA;
  let tokenB;

  beforeEach(async function () {
    Staking = await ethers.getContractFactory("Staking");
    Token = await ethers.getContractFactory("ERC20_token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    tokenA = await Token.deploy("TokenA", "TA");
    tokenB = await Token.deploy("TokenB", "TB");
    staking = await Staking.deploy(tokenA.address, tokenB.address);

    await tokenA.approve(staking.address, 500);
    await tokenB.transfer(staking.address, 1000);

  });
  
  describe("Stake", async function () {
    it("Check if stake working", async function () {
      await staking.stake(500);
      expect(await tokenA.balanceOf(owner.address)).to.equal(500);
    });
  });
  
  describe("Harvest", async function () {
    it("Check if harvest works properly", async function () {
      await tokenA.transfer(addr1.address, 10);
      await tokenA.connect(addr1).approve(staking.address, 10);
      await staking.connect(addr1).stake(10);
      timeAndMine.setTimeIncrease(200);
      await staking.connect(addr1).harvest();
      expect(await tokenB.balanceOf(addr1.address)).to.equal(100);
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
      await timeAndMine.setTimeIncrease(301);
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