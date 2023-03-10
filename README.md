# BuffAutoSell

This is an extremely rudimentary chrome extension that I spent about 4 hours on.
This extension auto-adjust item sell prices to stay competitive down to a price limit on buff.
Currency should be set to RMB for correct price granularity.

____________________________________________________________________________________________________________________________________________________________________
Whilst rudimentary, the strategy is quite optimal for selling cases.
The strategy will match the lowest price, but it will not move in front of the lowest price. Moving in front causes price competition between bots and the sad scenario of prices going lower and lower.
The strategy will also allow smaller orders to go in front of us. Less that 15 items are allowed to go in front (at each price level) as we do not want small orders causing us to lower our price - small orders are sold quickly, so we don't need to match them. There might be more than 15 in front in total if they span multiple price levels.
This setting could potentially be abused by other participants to make us lower our prices. If this is a concern, we can raise this from 15 to a higher number e.g. 50 or 100.
It will auto-refresh and run the logic every 5 minutes to keep the orders competitively priced.
The strategy only sells 50 items at a time (the number that are available on the for sale page). Aside from not wanting to be a spammy bot, waiting 5 minutes means that human users will not have the patience to outcompete our price adjustments, they will lose focus and eventually do other things. 
In addition, the 5 minute wait gives time for big buyers to trade against other sell orders (other people selling aside from us) and push the price up, which means next time we adjust our prices, the market can be higher and we might sell at a better price.
____________________________________________________________________________________________________________________________________________________________________

The items for sale to be auto-adjusted in price should be configured in 'settingsForGoodsForSale' which is at top of onsaleContentScript.js.

The extension needs to be loaded in developer mode in chrome/brave etc.

If you change 'settingsForGoodsForSale' then refresh the extension (switch off/on).

Note that this will run automatically when the browser is set to https://buff.163.com/market/sell_order/on_sale

Only open 1 instance of https://buff.163.com/market/sell_order/on_sale in your browser or buff will likely get upset because of spam and might ban your account.

To use:

Click on green code button above and select download zip. Extract it to a folder.
Then from chrome extensions page, enable developer mode and then load the folder.
Update 'onsaleContentScript' with items & prices for sale - you need to first put the items up for sale, this script will only adjust the prices on active sales in order to try to get them sold quicker and stop people jumping in front of your sell orders.
This does of course mean that you may sell at a lower price than if you were more patient.
