import React from "react";
import {SxProps} from "@mui/material";

type NoDragZoneProps = React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<Element>;
    sx?: SxProps;
    component?: React.ElementType;
    level?: string
}>;

export const NoDragZone = (
    {
        children,
        onClick,
        sx,
        component = "div",
        level,
        ...rest
    }: NoDragZoneProps
) => {
    const Component = component;

    return (
        <Component
            level={level}
            onMouseDown={(e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onTouchStart={(e: React.TouchEvent) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            onPointerDown={(e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            {...rest}
            sx={sx}
        >
            {children}
        </Component>
    );
};
