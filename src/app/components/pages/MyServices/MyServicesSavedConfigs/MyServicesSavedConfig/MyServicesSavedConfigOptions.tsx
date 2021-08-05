import { useState, memo } from "react";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiButton from "@material-ui/core/Button";
import type { ButtonProps as MuiButtonProps } from "@material-ui/core/Button";
import { makeStyles, Icon, Text } from "app/theme";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "app/i18n/useTranslations";

const actions = ["copy link", "delete"] as const;

export type SavedConfigurationAction = typeof actions[number];

export type Props = {
    callback(action: SavedConfigurationAction): void;
};

const useStyles = makeStyles()(theme => ({
    "menu": {
        "& .Mui-selected": {
            "backgroundColor": theme.colors.useCases.surfaces.surface1,
        },
        "& .MuiPaper-root": {
            "backgroundColor": theme.colors.useCases.surfaces.background,
        },
        "& a": {
            "color": theme.colors.useCases.typography.textPrimary,
        },
    },
    "menuTypo": {
        "display": "flex",
        "alignItems": "center",
    },
    "button": {
        "minWidth": "unset",
    },
}));

export const MyServicesSavedConfigOptions = memo((props: Props) => {
    const { callback } = props;

    const { classes } = useStyles();

    const [menuElement, setMenuElement] = useState<HTMLButtonElement | undefined>(
        undefined,
    );

    const onOpenMenuClick = useConstCallback<MuiButtonProps["onClick"]>(event =>
        setMenuElement(event.currentTarget),
    );

    const onMenuClose = useConstCallback(() => setMenuElement(undefined));

    const onMenuItemClickFactory = useCallbackFactory(
        ([action]: [SavedConfigurationAction]) => {
            callback(action);
            onMenuClose();
        },
    );

    const { t } = useTranslation("MyServicesSavedConfigOptions");

    return (
        <>
            <MuiButton
                className={classes.button}
                aria-owns={menuElement ? menuId : undefined}
                aria-haspopup="true"
                onClick={onOpenMenuClick}
                data-ga-event-category="header"
                data-ga-event-action="language"
            >
                <Icon iconId="moreVert" />
            </MuiButton>
            <Menu
                id={menuId}
                anchorEl={menuElement}
                open={menuElement !== undefined}
                className={classes.menu}
                onClose={onMenuClose}
            >
                {actions.map(action => (
                    <MenuItem
                        component="a"
                        data-no-link="true"
                        key={action}
                        selected={false}
                        onClick={onMenuItemClickFactory(action)}
                    >
                        <Text typo="body 1" className={classes.menuTypo}>
                            <Icon
                                iconId={(() => {
                                    switch (action) {
                                        case "copy link":
                                            return "link" as const;
                                        case "delete":
                                            return "delete" as const;
                                    }
                                })()}
                            />
                            &nbsp;
                            {t(
                                (() => {
                                    switch (action) {
                                        case "copy link":
                                            return "copy link" as const;
                                        case "delete":
                                            return "remove bookmark" as const;
                                    }
                                })(),
                            )}
                        </Text>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
});

export declare namespace MyServicesSavedConfigOptions {
    export type I18nScheme = {
        "remove bookmark": undefined;
        "copy link": undefined;
    };
}

const menuId = "saved-configurations";
