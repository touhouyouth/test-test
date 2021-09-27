const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {

  let Token;
  let addrs;
  let addr1;
  let addr2;
  let owner;
  let token;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ERC20_token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    token = await Token.deploy("TokenA", "TA");
    await token.connect(addr1).approve(owner.address, 300);
    });

  describe("Mint", function () {
    it("Should send all of the tokens to deployer", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(1000);
    });
  });

  describe("Transfer", function () {
    it("Should send 500 wei to the given address", async function () {
      await token.transfer(addr1.address, 500);
      expect(await token.balanceOf(addr1.address)).to.equal(500);
    });
  });

  describe("Transfer from", function () {
    it("Should send 200 wei from addr1 to addr2", async function () {
      await token.transfer(addr1.address, 500);
      await token.transferFrom(addr1.address, addr2.address, 200);
      expect(await token.balanceOf(addr2.address)).to.equal(200);
    });
  });

  describe("Balance of", function () {
    it ("Should return propper balance of the given adress", async function () {
      await token.transfer(addr1.address, 0);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });
  });

});

