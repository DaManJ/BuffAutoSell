# BuffAutoSell

This is an extremely rudimentary chrome extension that I spent about 4 hours on.
This extension auto-adjust item sell prices to stay competitive down to a price limit on buff.
Currency should be set to RMB for correct price granularity.
Do not use for non-csgo items as 'game' is hard-coded to csgo (code modification would be required).
Do not use if buff changes commission from 2.5%, as commission is hard-coded (code modification would be required).
____________________________________________________________________________________________________________________________________________________________________
The problem this script tries to solve -

Buff is a site that has high volume throughput similar or exceeding steam community market on many items. It's not exactly clear what their volumes are as they don't publish them but they do the majority of high end skin trading, and even for cheap skins they can exceed SCM volumes.

If you try to sell high volume items (cases, capsules etc), you can find yourself in the frustrating position that someone beats your order price by 1 RMB, which is less than 0.2 cents US. And people will just keep jumping in front of you and so it can be hard to sell in bulk. Some of these 'people' might be bots as well.

This strategy tries to find the optimal solution to this problem to maximize sales volume whilst minimizing price impact - if we have a large number of items to sell, we do not want to drive the price down so we would rather sell more slowly and achieve a better price.
____________________________________________________________________________________________________________________________________________________________________
Whilst rudimentary, the strategy is quite optimal for selling cases.
The strategy will match the lowest price, but it will not move in front of the lowest price. Moving in front causes price competition between bots and the sad scenario of prices going lower and lower.

The strategy will also allow smaller orders to go in front of us. Less that 15 items are allowed to go in front (at each price level) as we do not want small orders causing us to lower our price - small orders are sold quickly, so we don't need to match them. There might be more than 15 in front in total if they span multiple price levels.

This setting could potentially be abused by other participants to make us lower our prices. If this is a concern, we can raise this from 15 to a higher number e.g. 50 or 100.

It will auto-refresh and run the logic every 5 minutes to keep the orders competitively priced.

The strategy only sells 50 items at a time (the number that are available on the for sale page). Aside from not wanting to be a spammy bot, waiting 5 minutes means that human users will not have the patience to outcompete our price adjustments, they will lose focus and eventually do other things.

50 items is also good from a psychological perspective. If someone sees 200 sell orders in front of them they will be tempted to move to the best price because they fear it will take too long for them to sell. But if we only sell 50 orders at a time, other sellers may be more patient and not try to beat our price as they know they will sell some soon. Also note that we never beat others prices - we simply match them, but after they sell and we are first in queue, they might be tempted to move in front of us at a lower price. 50 should minimize this occurence at the same time as allowing us to get good enough sales throughput.

In addition, the 5 minute wait gives time for big buyers to trade against other sell orders (other people selling aside from us) and push the price up, which means next time we adjust our prices, the market can be higher and we might sell at a better price.

The best way to use this strategy is to buy more shelf space if you have the credit, then list a large number of items at a very high price, then the strategy will take care of moving up to 50 items at a time to a good price for sale and you won't have to re-list items too often.
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
