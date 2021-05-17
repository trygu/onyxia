
import { useState, useMemo, useEffect, memo } from "react";
import {
    CatalogLauncherAdvancedConfigurationHeader,
    Props as CatalogLauncherAdvancedConfigurationHeaderProps
} from "./CatalogLauncherAdvancedConfigurationHeader";
import { Tabs } from "app/components/shared/Tabs";
import {
    CatalogLauncherAdvancedConfigurationTab
} from "./CatalogLauncherAdvancedConfigurationTab";

import type {
    Props as CatalogLauncherAdvancedConfigurationTabProps
} from "./CatalogLauncherAdvancedConfigurationTab";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

export type Props = {
    className?: string;
    formFieldsByTab: Record<
        string,
        CatalogLauncherAdvancedConfigurationTabProps["formFields"]
    >;
    onFormValueChange: CatalogLauncherAdvancedConfigurationTabProps["onFormValueChange"];
    contract: undefined | Record<string, unknown>;
    previewContract(): void;
};

export const CatalogLauncherConfigurationCard = memo((props: Props) => {

    const { 
        className, formFieldsByTab, 
        onFormValueChange, contract,
        previewContract
    } = props;


    const [state, setState] = useState<CatalogLauncherAdvancedConfigurationHeaderProps["state"]>("collapsed");

    useEffect(
        ()=> {
            if( state === "contract"){
                previewContract();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state]
    );

    const tabs = useMemo(
        () => Object.keys(formFieldsByTab)
            .map(title => ({ "id": title, title })),
        [formFieldsByTab]
    );

    const [activeTabId, setActiveTabId] = useState(tabs[0].id);

    return (
        <div className={className}>
            <CatalogLauncherAdvancedConfigurationHeader
                state={state}
                onStateChange={setState}
            />
            <Tabs
                tabs={tabs}
                activeTabId={activeTabId}
                onRequestChangeActiveTab={setActiveTabId}
                size="small"
                maxTabCount={5}
            >
                {(() => {
                    switch (state) {
                        case "collapsed":
                            return null;
                        case "contract":
                            return <JsonEditor value={contract}/>;
                        case "form":
                            return (
                                <CatalogLauncherAdvancedConfigurationTab
                                    formFields={formFieldsByTab[activeTabId]}
                                    onFormValueChange={onFormValueChange}
                                />
                            );
                    }
                })()}
            </Tabs>
        </div>
    );

});


