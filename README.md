# Gemx.js
What happens when you combine nextjs + hardhat + gemcutter + typechain + useDapp

## Gemcutter

Gemcutter is a simple way to work on EIP-2545 Diamonds
 
### diamond.json

The diamond.json is a temporary file that rappresents the state of the deployed diamond. The developer edits the diamond.json file and then uses gemcutter's tool to synchronize the changes to the deployed diamond. Gemcutter offers a series of functions to work with the diamond.json.

The diamond.json is not committed on github because its values depends on the local development environment. Instead the user will commit a DIAMONDFILE, a file containing all the operations used to generate the same diamond.json in every dev env.

### Gemcutter actions

```bash
npx hardhat diamond:init
```
Generates a diamond.json file starting from a DIAMONDFILE

```bash
npx hardhat diamond:deploy
```
Used to initialize a new diamond, deploying an empy diamond, and creating a diamond.json that rappresents that diamond

```bash
npx hardhat diamond:add --remote --save-metadata --address 0x3D004D6B32D5D6A5e7B7504c3dac672456ed95dB
```
Used to add a facet to the diamond.json file (not on the deployed contract).
* `--remote` to add a remote facet, `--address` is mandatory. With `--save-metadata` the metadata of the contracts are extracted from the bytecode and saved in the *./metadata/* folder.
* `--local` to add a local facet, `--name` is mandatory (the name of the facet in the *./contracts/* folder)

```bash
npx hardhat diamond:cut --init-facet MyToken --init-fn initMyToken --init-params "Habitat,HBT,8,0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
```
Used to synchronize the changes between the local diamond.json file and the deployed diaomond.
* `--init-facet` used to specify the facet from which to use the function to pass to the *_init* function in the cut.
* `--init-fn` the function to pass to the *_init* function in the cut
* `--init-params` the parameters to pass to the *_init* function in the cut

### DIAMONDFILE

The DIAMONDFILE contains the set of instructions to deploy a diamond and cut all the necessary facets. While developing the developer will call `diamond:add` and `diamond:cut` but efore committing the developer must update the DIAMONDFILE so it includes all the *adds* and *cuts* she made.

### Local node

Everything works only when the `hardhat node` is running. If the developer publishes new facets with the `--local` flag, each time it reruns the local node, it must recreate the diamond.json file redeploying the diamond on the local network.

### Network forking

Right now the basic facets (*DiamondCutFacet*, *DiamondInit*, *DiamondLoupeFacet*, *OwnershipFacet*) are deployed on rinkeby, in the future the system will use create2 to have always the same address so it will not be mandatory to fork rinkeby to work with Gemx.js.
Also in the future the `diamon:add` task will have a `--ens` parameter so the developer can add facets passing a meaningful name.

E.g.
```bash
npx hardhat diamond:add --remote --save-metadata --ens erc20.facets.eth
```

## Gemx

### Running the local node
```bash
yarn start:node
```

### Initialize a diamond.json from a DIAMONDFILE

```bash
yarn diamond:init
```

### Adding a facet

```bash
yarn diamond:add 0x3D004D6B32D5D6A5e7B7504c3dac672456ed95dB
```

### Generating typechains from metadata

```bash
yarn generate:typechain
```

## Next.js

When installing a facet the useDapp hooks are automatically available for the user, for example when add a ERC20 facet, this hooks will be available for the developer
```typescript
const { account, library, activateBrowserWallet } = useEthers()
const useDiamond = generateUseDiamond(diamond.address,account ? (library?.getSigner() as any) : undefined)
const balance = useDiamond.balanceOf('0xDEC3e07D46c46C089a323D62E60826D03716d7a2')
const { state: stateInit, send: sendInitMyToken } = useDiamond.initMyToken
const initToken = () => sendInitMyToken('SD','sd',8,'0xDEC3e07D46c46C089a323D62E60826D03716d7a2')
```

### Typechain

When you add a facet using the flag `--save-metadata` the metadata of the facet is saved, so it can be used by typechain to generate the factory for that facet. You can use the following command or the shortcut above.
```bash
typechain --target=ethers-v5  metadata/*.json 
```

### useDapp

Gemx offers `generateUseDiamond`, that automatically creates the `useCall` and `useContractFunction` for each function in the typechains factory specified.

In the util change the `factories` object, including the factories to include
```typescript
const factories: IFactories = {
    MyToken: MyToken__factory,
}
```

First import the `generateUseDiamond` util in the component.

```typescript
import generateUseDiamond from '../utils/generateUseDiamond'
```

Finally call `generateUseDiamond` passing 
* the address of the diamond (you can take it using `import diamond from '../diamond.json'`)
* the signer
```typescript
const { account, library, activateBrowserWallet } = useEthers()
const useDiamond = generateUseDiamond(diamond.address,account ? (library?.getSigner() as any) : undefined)
```
In the useDiamond object you have:
* the useCall hooks for the view functions
```typescript
const balance = useDiamond.balanceOf('0xDEC3e07D46c46C089a323D62E60826D03716d7a2')
```
* the useContractFunction hooks for the write functions
```typescript
const { state: stateInit, send: sendInitMyToken } = useDiamond.initMyToken
```

## Getting started

1. Install dependencies
```bash
yarn install
```

2. Run local node (each time)
```bash
yarn node:start
```

3. Deploy the diamond on the local environment (each time if working with new local facets)
```bash
yarn diamond:init
```

4. Run next.js
```bash
yarn dev
```