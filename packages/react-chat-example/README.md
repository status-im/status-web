#React chat example

##How to run example

 1. First you need to `yarn && yarn build` in main repo folder
 2. set two environment libraries
    ENV and COMMUNITY_KEY

    `export ENV=test` to use waku test fleet
    `export ENV=prod` to use waku prod fleet
    `export COMMUNITY_KEY=0x038ff8c6539ff268e024d07534a362ef69f7b13b056fcf19177fb6282b4d547bc8` to set a key to community

  3. run `yarn start` in `packages/react-chat-example` folder.