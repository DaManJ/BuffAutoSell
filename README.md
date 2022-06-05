# BuffAutoSell

This is an extremely rudimentary chrome extension that I spent about 4 hours on.
This extension auto-adjust item sell prices to stay competitive down to a price limit on buff.


The items for sale to be auto-adjusted in price should be configured in 'settingsForGoodsForSale' which is at top of onsaleContentScript.js.

The extension needs to be loaded in developer mode in chrome/brave etc.

If you change 'settingsForGoodsForSale' then refresh the extension (switch off/on).

Note that this will run automatically when the browser is set to https://buff.163.com/market/sell_order/on_sale

It will auto-refresh and run the logic every 60 seconds to keep the orders competitively priced.

Only open 1 instance of https://buff.163.com/market/sell_order/on_sale in your browser or buff will likely get upset because of spam and might ban your account.

To use:

Click on green code button above and select download zip. Extract it to a folder.
Then from chrome extensions page, enable developer mode and then load the folder.
Update 'onsaleContentScript' with items & prices for sale - you need to first put the items up for sale, this script will only adjust the prices on active sales in order to try to get them sold quicker and stop people jumping in front of your sell orders.
This does of course mean that you may sell at a lower price than if you were more patient.
