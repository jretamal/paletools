import { on } from "../../events";
import localize from "../../localization";
import getWindow from "../../services/window";
import settings from "../../settings";
import { append } from "../../utils/dom";

const cfg = settings.plugins.playerActions;

const futBinSearchAction = {
    canRun: (instance) => {
        return instance === UTDefaultActionPanelView || instance === UTAuctionActionPanelView;
    },

    generate: (instance, buttonsContainerFunc) => {
        if (cfg.futbinSearch) {
            instance._futbinSearchButton = new UTGroupButtonControl();
            instance._futbinSearchButton.init();
            instance._futbinSearchButton.setText(localize("plugins.playerActions.futbinSearch"));
            instance._futbinSearchButton.addTarget(instance, () => instance.onFutbinSearch.notify(), EventType.TAP);
            instance._futbinSearchButton.getRootElement().classList.add("paletools-element");
            instance.onFutbinSearch = new EAObservable();
            append(buttonsContainerFunc(instance), instance._futbinSearchButton.getRootElement());
            on("appEnabled", () => show(instance._futbinSearchButton.getRootElement()));
            on("appDisabled", () => hide(instance._futbinSearchButton.getRootElement()));
        }
    },
    destroyGeneratedElements: (instance) => {
        if (instance._futbinSearchButton) {
            instance._futbinSearchButton.destroy();
        }
    },
    dealloc: (instance) => {
        if (instance.onFutbinSearch) {
            instance.onFutbinSearch.dealloc();
        }
    },
    attachEvent: (instance) => {
        if (instance._panel.onFutbinSearch) {
            instance._panel.onFutbinSearch.observe(instance, instance._onFutbinSearch);
        }
    },
    
    createEvent: (proto) => {
        proto._onFutbinSearch = function () {
            getWindow().open(`https://www.futbin.com/players?page=1&search=${this._viewmodel.current()._staticData.firstName}%20${this._viewmodel.current()._staticData.lastName}`);
        }
    }
}

export default futBinSearchAction;