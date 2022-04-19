
const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {

    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        // Load Contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DEcentralBank (1million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mock tethers to customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        w
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'DecentralBank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

        })
        describe('Yield Farming', async () => {
            it('rewards tokens for staking', async () => {
                let result

                // Check Investor Balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance')

                // Check Staking for Customer of 100 tokens
                await tether.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), {from: customer})

                // Check Updated Balance Of Customer
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')     
                
    
                // Check Updated Balance of Central Bank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('100'), 'Decentral Bank mock wallet balance after staking from customer')

                // Is Staking Update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'true', 'customer is staking status after staking')

                // Issue Tokens
                await decentralBank.issueTokens({from: owner})

                // Ensure Only the owner can issue tokens
                await decentralBank.issueTokens({from: customer}).should.be.rejected;

                // Unstake Tokens
                await decentralBank.unstakeTokens({from: customer})

                // Check Unstaking Balances
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking 100 tokens')     
                
    
                // Check Updated Balance of Decentral Bank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'Decentral Bank mock wallet balance after staking from customer')

                // Is Staking Update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'customer is no longer staking after unstaking')


            })
    })
})
