const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20_token", function () {
  it("Should send all of the tokens to deployer", async function () {
    const Token = await ethers.getContractFactory("ERC20_token");
    const token = await Token.deploy("TokenA", "TA");
    await token.deployed();
    
    const [owner] = await ethers.getSigners();
    expect(await token.balanceOf(owner.getAddress())).to.equal('1000');

  });
});