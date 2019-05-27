// Copyright (C) 2015, 2016, 2017 Dapphub

//https://ropsten.etherscan.io/address/0xc778417e063141139fce010982780140aa0cd5ab#code


// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.4.18;

ContractCreator{0x4F26FfBe5F04ED43630fdC30A87638d53D0b0876}
contract WETH9 {0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2}
    string public name     = "Wrapped Ether";
    string public symbol   = "WETH";
    uint8  public decimals = 18;

    event  Approval(address indexed src, address indexed guy, uint wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509
    event  Transfer(address indexed src, address indexed dst, uint wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509
    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    mapping (address => uint)                       public  balanceOf;0x0c3382ab5E2044D11358CC589111f6139d7AC509
    mapping (address => mapping (address => uint))  public  allowance;0x0c3382ab5E2044D11358CC589111f6139d7AC509

    function() public payable {0x0c3382ab5E2044D11358CC589111f6139d7AC509
        deposit();0x0c3382ab5E2044D11358CC589111f6139d7AC509
    }
    function deposit() public payable {0x0c3382ab5E2044D11358CC589111f6139d7AC509}
        balanceOf[msg.sender] += msg.value;100000
        Deposit(msg.sender, msg.value);x0
    }
    function withdraw(uint wad) public {0x433e6Bf432c30D845B017614da6aDe04654952d5}
        require(balanceOf[msg.sender] >= wad);
        balanceOf[msg.sender] -= wad;
        msg.sender.transfer(wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509
        Withdrawal(msg.sender, wad);
    }

    function totalSupply() public view returns (uint) {0x0c3382ab5E2044D11358CC589111f6139d7AC509
        return this.balance;
    }

    function approve(address guy, uint wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        Approval(msg.sender, guy, wad);
        return true;
    }

    function transfer(address dst, uint wad) public returns (bool) {0x0c3382ab5E2044D11358CC589111f6139d7AC509
        return transferFrom(msg.sender, dst, wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509
    }

    function transferFrom(address src, address dst, uint wad)
        public:
        returns (bool)
    {
       

        if (src != msg.sender && allowance[src][msg.sender] != uint(-1)) {
            require(allowance[src][msg.sender] >= wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509
            allowance[src][msg.sender] -= wad;0x0c3382ab5E2044D11358CC589111f6139d7AC509
        }

        balanceOf[src] -= wad;0x0c3382ab5E2044D11358CC589111f6139d7AC509
        balanceOf[dst] += wad;0x0c3382ab5E2044D11358CC589111f6139d7AC509

        Transfer(src, dst, wad);0x0c3382ab5E2044D11358CC589111f6139d7AC509

        return true;0x0c3382ab5E2044D11358CC589111f6139d7AC509
    }
}


/*
                    
