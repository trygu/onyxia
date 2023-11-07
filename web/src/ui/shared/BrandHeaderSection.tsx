import { useMemo } from "react";
import { env } from "env-parsed";
import { Text } from "onyxia-ui/Text";
import type { Link } from "type-route";
import { tss } from "tss";
import { ImageFromConfigs } from "ui/shared/ImageFromConfigs";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";

export type Props = {
    className?: string;
    doShowOnyxia: boolean;
    link: Link;
};

export function BrandHeaderSection(props: Props) {
    const { className, doShowOnyxia, link } = props;

    const { windowInnerWidth } = useWindowInnerSize();

    const { logoContainerWidth } = useLogoContainerWidth();

    const { cx, classes } = useStyles({ logoContainerWidth, doShowOnyxia });

    return (
        <a className={cx(classes.root, className)} {...link}>
            <div className={classes.logoContainer}>
                <ImageFromConfigs className={classes.logo} url={env.LOGO} />
            </div>
            <div className={classes.textContainer}>
                {doShowOnyxia && (
                    <Text typo="section heading" className={classes.text_onyxia}>
                        Onyxia -
                    </Text>
                )}
                {env.HEADER_ORGANIZATION && (
                    <Text typo="section heading" className={classes.text_organization}>
                        {env.HEADER_ORGANIZATION}
                    </Text>
                )}
                {windowInnerWidth > 450 && env.HEADER_USECASE_DESCRIPTION && (
                    <Text
                        typo="section heading"
                        className={classes.text_usecase}
                        color="focus"
                    >
                        {env.HEADER_USECASE_DESCRIPTION}
                    </Text>
                )}
            </div>
        </a>
    );
}

const useStyles = tss
    .withName({ BrandHeaderSection })
    .withParams<{ logoContainerWidth: number; doShowOnyxia: boolean }>()
    .create(({ logoContainerWidth, doShowOnyxia, theme }) => ({
        "root": {
            "textDecoration": "none",
            "color": "unset",
            "display": "block"
        },
        "logoContainer": {
            "width": logoContainerWidth,
            "textAlign": "center",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center"
        },
        "logo": {
            "width": "70%"
        },
        "textContainer": {
            "& > *": {
                "display": "inline-block"
            }
        },
        "text_onyxia": {
            "fontWeight": 600
        },
        "text_organization": {
            ...theme.spacing.rightLeft("margin", 2),
            ...(doShowOnyxia ? { "marginLeft": 0 } : {})
        },
        "text_usecase": {
            "fontWeight": 500
        }
    }));

export function useLogoContainerWidth() {
    const { windowInnerWidth } = useWindowInnerSize();

    const logoContainerWidth = useMemo(
        () =>
            Math.max(
                Math.floor(
                    (Math.min(windowInnerWidth, 1920) *
                        4) /* logo container width in percent */ /
                        100
                ),
                45
            ),
        [windowInnerWidth]
    );

    return { logoContainerWidth };
}