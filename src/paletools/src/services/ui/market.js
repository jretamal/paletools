import { addMarketSearchPreRender } from "../../core-overrides/UTMarketSearchResultsViewControllerOverrides";
import localize from "../../localization";
import delay from "../../utils/delay";
import { select } from "../../utils/dom";
import { notifySuccess } from "../../utils/notifications";
import { tryBuyItem } from "../market";
import { navigateBack } from "./navigation";

let scrollToBuyNow = false;

const UTMarketSearchFiltersViewController_viewDidAppear = UTMarketSearchFiltersViewController.prototype.viewDidAppear;
UTMarketSearchFiltersViewController.prototype.viewDidAppear = async function viewDidAppear() {
    UTMarketSearchFiltersViewController_viewDidAppear.call(this);

    await delay(10);
    const inputs = selectAll(".ut-numeric-input-spinner-control");
    if(inputs.length > 3){
        inputs[0].scrollIntoView();
    }

    scrollToBuyNow = true;
}

export function enableMarketSnipe(shouldSnipeFunc, onBack = null, onSnipeSuccess = null, onSnipeFailure = null) {


    addMarketSearchPreRender((items, controller) => {
        if (!shouldSnipeFunc()) return true;

        function goBack() {
            if (onBack) {
                onBack();
            }
            navigateBack(controller);
            scrollToBuyNow = true;
        }

        setTimeout(() => {
            if (items.length === 0) {
                goBack();
            }
            else {
                let orderedItems = items.slice().sort((a, b) => {
                    const auctionA = a._auction.buyNowPrice;
                    const auctionB = b._auction.buyNowPrice;
                    return auctionA - auctionB;
                });

                tryBuyItem(orderedItems).then(response => {
                    if (response.success) {
                        if (onSnipeSuccess) {
                            onSnipeSuccess(response.item);
                        }
                        notifySuccess(localize("market.itemBuy.success").replace("{COINS}", response.item._auction.buyNowPrice.toLocaleString()));
                    }
                    else {
                        if (onSnipeFailure) {
                            onSnipeFailure(response.item);
                        }
                    }
                }).catch(() => {
                    onSnipeFailure(response.item);
                }).finally(() => {
                    goBack();
                });
            }
        }, 0);

        return false;
    });
}