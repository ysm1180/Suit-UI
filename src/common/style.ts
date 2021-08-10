import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize';
import { CSSProperties } from 'react';
import {
    Breakpoints,
    CssBorderStyleProperty,
    cssBreakpoints,
    CssFontStyleProperty,
    CssFontWeightProperty,
    cssLength,
    CssLineWidthProperty,
    CssOverflowProperty,
    CssTextAlignProperty,
    GlobalCssValue,
    Length,
} from './css';

export type CssStyleFn<T> = (props: T) => Array<CSSInterpolation> | CSSInterpolation;

export type VariantArgs = { [key in string | number | symbol]?: CSSInterpolation };
export type VariantStyle<T> = (props?: T) => { style: CSSInterpolation; variants: VariantArgs };
type Variant<TProps> = (props: TProps) => CSSInterpolation;

export const variant: <TProps extends unknown = unknown>(props: {
    prop?: keyof TProps;
    variants: VariantArgs | VariantStyle<TProps>;
}) => Variant<TProps> = <TProps extends unknown = unknown>(props: {
    prop?: keyof TProps;
    variants: VariantArgs | VariantStyle<TProps>;
}) => {
    const propName = props.prop ?? 'variant';

    return typeof props.variants === 'function'
        ? (prop: TProps) => {
              const values = (props.variants as VariantStyle<TProps>)(prop);
              const propValue = prop[propName as keyof TProps];

              return [
                  values.style,
                  values.variants[
                      typeof propValue === 'string' || typeof propValue === 'number' || typeof propValue === 'symbol'
                          ? propValue
                          : 'variant'
                  ],
              ];
          }
        : (prop: TProps) => {
              const propValue = prop[propName as keyof TProps];
              return (props.variants as VariantArgs)[
                  typeof propValue === 'string' || typeof propValue === 'number' || typeof propValue === 'symbol'
                      ? propValue
                      : 'variant'
              ];
          };
};

export interface StyleProps {
    style?: CSSProperties;
}

export interface DisplayProps {
    display?: Breakpoints<string>;
}

export const display: CssStyleFn<DisplayProps> = ({ display }: DisplayProps) => {
    return cssBreakpoints('display', display, (value) => value);
};

export interface TextAlignProps {
    textAlign?: Breakpoints<CssTextAlignProperty>;
}

export const textAlign: CssStyleFn<TextAlignProps> = ({ textAlign }: TextAlignProps) => {
    return cssBreakpoints('text-align', textAlign, (value) => value);
};

export interface LeftProps {
    left?: Breakpoints<Length>;
}

export const left: CssStyleFn<LeftProps> = ({ left }: LeftProps) => {
    return cssBreakpoints('left', left, (value) => cssLength(value));
};

export interface RightProps {
    right?: Breakpoints<Length>;
}

export const right: CssStyleFn<RightProps> = ({ right }: RightProps) => {
    return cssBreakpoints('right', right, (value) => cssLength(value));
};

export interface TopProps {
    top?: Breakpoints<Length>;
}

export const top: CssStyleFn<TopProps> = ({ top }: TopProps) => {
    return cssBreakpoints('top', top, (value) => cssLength(value));
};

export interface BottomProps {
    bottom?: Breakpoints<Length>;
}

export const bottom: CssStyleFn<BottomProps> = ({ bottom }: BottomProps) => {
    return cssBreakpoints('bottom', bottom, (value) => cssLength(value));
};

export interface PositionProps extends TopProps, RightProps, BottomProps, LeftProps {
    position?: Breakpoints<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>;
}

export const position: CssStyleFn<PositionProps> = ({ position, left, right, top, bottom }: PositionProps) => {
    if (!position && !left && !right && !top && !bottom) {
        return undefined;
    }
    return css`
        ${cssBreakpoints('position', position, (value) => value)}
        ${cssBreakpoints('left', left, (value) => cssLength(value))}
        ${cssBreakpoints('top', top, (value) => cssLength(value))}
        ${cssBreakpoints('right', right, (value) => cssLength(value))}
        ${cssBreakpoints('bottom', bottom, (value) => cssLength(value))}
    `;
};

export interface MarginTopProps {
    mt?: Breakpoints<Length>;
    marginTop?: Breakpoints<Length>;
}

export const marginTop: CssStyleFn<MarginTopProps> = ({ mt, marginTop }: MarginTopProps) => {
    return cssBreakpoints('margin-top', mt ?? marginTop, (value) => cssLength(value));
};

export interface MarginRightProps {
    mr?: Breakpoints<Length>;
    marginRight?: Breakpoints<Length>;
}

export const marginRight: CssStyleFn<MarginRightProps> = ({ mr, marginRight }: MarginRightProps) => {
    return cssBreakpoints('margin-right', mr ?? marginRight, (value) => cssLength(value));
};

export interface MarginBottomProps {
    mb?: Breakpoints<Length>;
    marginBottom?: Breakpoints<Length>;
}

export const marginBottom: CssStyleFn<MarginBottomProps> = ({ mb, marginBottom }: MarginBottomProps) => {
    return cssBreakpoints('margin-bottom', mb ?? marginBottom, (value) => cssLength(value));
};

export interface MarginLeftProps {
    ml?: Breakpoints<Length>;
    marginLeft?: Breakpoints<Length>;
}

export const marginLeft: CssStyleFn<MarginLeftProps> = ({ ml, marginLeft }: MarginLeftProps) => {
    return cssBreakpoints('margin-left', ml ?? marginLeft, (value) => cssLength(value));
};

export interface MarginProps extends MarginLeftProps, MarginRightProps, MarginBottomProps, MarginTopProps {
    m?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    margin?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    mx?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    my?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
}

export const margin: CssStyleFn<MarginProps> = ({
    m,
    margin,
    ml,
    marginLeft,
    mb,
    marginBottom,
    mt,
    marginTop,
    mr,
    marginRight,
    mx,
    my,
}: MarginProps) => {
    if (
        !m &&
        !margin &&
        !mx &&
        !my &&
        !ml &&
        !marginLeft &&
        !mt &&
        !marginTop &&
        !mr &&
        !marginRight &&
        !mb &&
        !marginBottom
    ) {
        return undefined;
    }
    return css`
        ${cssBreakpoints('margin', m ?? margin, (value) => cssLength(value))}
        ${cssBreakpoints('margin-left', mx ?? ml ?? marginLeft, (value) => cssLength(value))}
        ${cssBreakpoints('margin-top', my ?? mt ?? marginTop, (value) => cssLength(value))}
        ${cssBreakpoints('margin-right', mx ?? mr ?? marginRight, (value) => cssLength(value))}
        ${cssBreakpoints('margin-bottom', my ?? mb ?? marginBottom, (value) => cssLength(value))}
    `;
};

export interface PaddingTopProps {
    pt?: Breakpoints<Length>;
    paddingTop?: Breakpoints<Length>;
}

export const paddingTop: CssStyleFn<PaddingTopProps> = ({ pt, paddingTop }: PaddingTopProps) => {
    return cssBreakpoints('padding-top', pt ?? paddingTop, (value) => cssLength(value));
};

export interface PaddingRightProps {
    pr?: Breakpoints<Length>;
    paddingRight?: Breakpoints<Length>;
}

export const paddingRight: CssStyleFn<PaddingRightProps> = ({ pr, paddingRight }: PaddingRightProps) => {
    return cssBreakpoints('padding-right', pr ?? paddingRight, (value) => cssLength(value));
};

export interface PaddingBottomProps {
    pb?: Breakpoints<Length>;
    paddingBottom?: Breakpoints<Length>;
}

export const paddingBottom: CssStyleFn<PaddingBottomProps> = ({ pb, paddingBottom }: PaddingBottomProps) => {
    return cssBreakpoints('padding-bottom', pb ?? paddingBottom, (value) => cssLength(value));
};

export interface PaddingLeftProps {
    pl?: Breakpoints<Length>;
    paddingLeft?: Breakpoints<Length>;
}

export const paddingLeft: CssStyleFn<PaddingLeftProps> = ({ pl, paddingLeft }: PaddingLeftProps) => {
    return cssBreakpoints('padding-left', pl ?? paddingLeft, (value) => cssLength(value));
};

export interface PaddingProps extends PaddingLeftProps, PaddingTopProps, PaddingRightProps, PaddingBottomProps {
    p?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    padding?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    px?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
    py?: Breakpoints<
        Length | `${Length} ${Length}` | `${Length} ${Length} ${Length}` | `${Length} ${Length} ${Length} ${Length}`
    >;
}

export const padding: CssStyleFn<PaddingProps> = ({
    p,
    padding,
    pl,
    paddingLeft,
    pt,
    paddingTop,
    pr,
    paddingRight,
    pb,
    paddingBottom,
    px,
    py,
}: PaddingProps) => {
    if (
        !p &&
        !padding &&
        !px &&
        !py &&
        !pl &&
        !paddingLeft &&
        !pt &&
        !paddingTop &&
        !pr &&
        !paddingRight &&
        !pb &&
        !paddingBottom
    ) {
        return undefined;
    }
    return css`
        ${cssBreakpoints('padding', p ?? padding, (value) => cssLength(value))}
        ${cssBreakpoints('padding-left', px ?? pl ?? paddingLeft, (value) => cssLength(value))}
        ${cssBreakpoints('padding-top', py ?? pt ?? paddingTop, (value) => cssLength(value))}
        ${cssBreakpoints('padding-right', px ?? pr ?? paddingRight, (value) => cssLength(value))}
        ${cssBreakpoints('padding-bottom', py ?? pb ?? paddingBottom, (value) => cssLength(value))}
    `;
};

export type BackgroundColorProps<C extends string = 'backgroundColor' | 'bg'> = {
    [Key in C]?: Breakpoints<string>;
};

export const backgroundColor: CssStyleFn<BackgroundColorProps> = ({ bg, backgroundColor }: BackgroundColorProps) => {
    return cssBreakpoints('background-color', bg ?? backgroundColor, (value) => value);
};

export type TextColorProps<C extends string = 'textColor'> = {
    [Key in C]?: Breakpoints<string>;
};

export const textColor: CssStyleFn<TextColorProps> = ({ textColor }: TextColorProps) => {
    return cssBreakpoints('color', textColor, (value) => value);
};

export interface ColorProps extends TextColorProps, BackgroundColorProps {}

export const color: CssStyleFn<ColorProps> = ({ textColor, bg, backgroundColor }: ColorProps) => {
    if (!textColor && !bg && !backgroundColor) {
        return undefined;
    }

    return css`
        ${cssBreakpoints('background-color', bg ?? backgroundColor, (value) => value)}
        ${cssBreakpoints('color', textColor, (value) => value)}
    `;
};

export type BorderColorProps<C extends string = 'borderColor'> = {
    [Key in C]?: Breakpoints<string>;
};

export const borderColor: CssStyleFn<BorderColorProps> = ({ borderColor }: BorderColorProps) => {
    return cssBreakpoints('border-color', borderColor, (value) => value);
};

export type BorderStyleProps<C extends string = 'borderStyle'> = {
    [Key in C]?: Breakpoints<CssBorderStyleProperty>;
};

export const borderStyle: CssStyleFn<BorderStyleProps> = ({ borderStyle }: BorderStyleProps) => {
    return cssBreakpoints('border-style', borderStyle, (value) => value);
};

export type BorderWidthProps<C extends string = 'borderWidth'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const borderWidth: CssStyleFn<BorderWidthProps> = ({ borderWidth }: BorderWidthProps) => {
    return cssBreakpoints('border-width', borderWidth, (value) => cssLength(value));
};

export interface BorderProps extends BorderWidthProps, BorderStyleProps, BorderColorProps {
    border?: Breakpoints<
        | `${CssBorderStyleProperty}`
        | `${CssLineWidthProperty} ${CssBorderStyleProperty}`
        | `${CssBorderStyleProperty} ${string}`
        | `${CssLineWidthProperty} ${CssBorderStyleProperty} ${string}`
        | GlobalCssValue
    >;
}

export const border: CssStyleFn<BorderProps> = ({ border, borderWidth, borderColor, borderStyle }: BorderProps) => {
    if (!border && !borderWidth && !borderColor && !borderStyle) {
        return undefined;
    }
    return css`
        ${cssBreakpoints('border', border, (value) => value)}
        ${cssBreakpoints('border-width', borderWidth, (value) => cssLength(value))}
        ${cssBreakpoints('border-color', borderColor, (value) => value)}
        ${cssBreakpoints('border-style', borderStyle, (value) => value)}
    `;
};

export type BorderRadiusProps<C extends string = 'borderRadius'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const borderRadius: CssStyleFn<BorderRadiusProps> = ({ borderRadius }: BorderRadiusProps) => {
    return cssBreakpoints('border-radius', borderRadius, (value) => cssLength(value));
};

export type WidthProps<C extends string = 'width'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const width: CssStyleFn<WidthProps> = ({ width }: WidthProps) => {
    return cssBreakpoints('width', width, (value) => cssLength(value));
};

export type MinWidthProps<C extends string = 'minWidth'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const minWidth: CssStyleFn<MinWidthProps> = ({ minWidth }: MinWidthProps) => {
    return cssBreakpoints('min-width', minWidth, (value) => cssLength(value));
};

export type MaxWidthProps<C extends string = 'maxWidth'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const maxWidth: CssStyleFn<MaxWidthProps> = ({ maxWidth }: MaxWidthProps) => {
    return cssBreakpoints('max-width', maxWidth, (value) => cssLength(value));
};

export type HeightProps<C extends string = 'height'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const height: CssStyleFn<HeightProps> = ({ height }: HeightProps) => {
    return cssBreakpoints('height', height, (value) => cssLength(value));
};

export type MinHeightProps<C extends string = 'minHeight'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const minHeight: CssStyleFn<MinHeightProps> = ({ minHeight }: MinHeightProps) => {
    return cssBreakpoints('min-height', minHeight, (value) => cssLength(value));
};

export type MaxHeightProps<C extends string = 'maxHeight'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const maxHeight: CssStyleFn<MaxHeightProps> = ({ maxHeight }: MaxHeightProps) => {
    return cssBreakpoints('max-height', maxHeight, (value) => cssLength(value));
};

export type FontStyleProps<C extends string = 'fontStyle'> = {
    [Key in C]?: Breakpoints<CssFontStyleProperty>;
};

export const fontStyle: CssStyleFn<FontStyleProps> = ({ fontStyle }: FontStyleProps) => {
    return cssBreakpoints('font-style', fontStyle, (value) => value);
};

export type FontSizeProps<C extends string = 'fontSize'> = {
    [Key in C]?: Breakpoints<Length>;
};

export const fontSize: CssStyleFn<FontSizeProps> = ({ fontSize }: FontSizeProps) => {
    return cssBreakpoints('font-size', fontSize, (value) => cssLength(value));
};

export type FontWeightProps<C extends string = 'fontWeight'> = {
    [Key in C]?: Breakpoints<CssFontWeightProperty>;
};

export const fontWeight: CssStyleFn<FontWeightProps> = ({ fontWeight }: FontWeightProps) => {
    return cssBreakpoints('font-weight', fontWeight, (value) => `${value}`);
};

export interface FlexDirectionProps {
    flexDirection?: Breakpoints<'row' | 'row-reverse' | 'column' | 'column-reverse' | GlobalCssValue>;
}

export const flexDirection: CssStyleFn<FlexDirectionProps> = ({ flexDirection }: FlexDirectionProps) => {
    return cssBreakpoints('flex-direction', flexDirection, (value) => value);
};

export interface FlexWrapProps {
    flexWrap?: Breakpoints<'nowrap' | 'wrap' | 'wrap-reverse' | GlobalCssValue>;
}

export const flexWrap: CssStyleFn<FlexWrapProps> = ({ flexWrap }: FlexWrapProps) => {
    return cssBreakpoints('flex-wrap', flexWrap, (value) => value);
};

export interface FlexGrowProps {
    flexGrow?: Breakpoints<number>;
}

export const flexGrow: CssStyleFn<FlexGrowProps> = ({ flexGrow }: FlexGrowProps) => {
    return cssBreakpoints('flex-grow', flexGrow, (value) => `${value}`);
};

export interface FlexShrinkProps {
    flexShrink?: Breakpoints<number>;
}

export const flexShrink: CssStyleFn<FlexShrinkProps> = ({ flexShrink }: FlexShrinkProps) => {
    return cssBreakpoints('flex-shrink', flexShrink, (value) => `${value}`);
};

export interface FlexBasisProps {
    flexBasis?: Breakpoints<'content' | string | GlobalCssValue>;
}

export const flexBasis: CssStyleFn<FlexBasisProps> = ({ flexBasis }: FlexBasisProps) => {
    return cssBreakpoints('flex-basis', flexBasis, (value) => value);
};

export interface FlexProps extends FlexBasisProps, FlexDirectionProps, FlexGrowProps, FlexShrinkProps, FlexWrapProps {
    flex?: Breakpoints<
        | 'auto'
        | 'none'
        | number
        | string
        | `${number} ${string}`
        | `${number} ${number}`
        | `${number} ${number} ${string}`
        | GlobalCssValue
    >;
}

export const flex: CssStyleFn<FlexProps> = ({
    flex,
    flexBasis,
    flexDirection,
    flexGrow,
    flexShrink,
    flexWrap,
}: FlexProps) => {
    if (!flex && !flexBasis && !flexDirection && !flexGrow && !flexShrink && !flexWrap) {
        return undefined;
    }

    return css`
        ${cssBreakpoints('flex', flex, (value) => `${value}`)}
        ${cssBreakpoints('flex-Basis', flexBasis, (value) => value)}
        ${cssBreakpoints('flex-direction', flexDirection, (value) => value)}
        ${cssBreakpoints('flex-grow', flexGrow, (value) => `${value}`)}
        ${cssBreakpoints('flex-shrink', flexShrink, (value) => `${value}`)}
        ${cssBreakpoints('flex-wrap', flexWrap, (value) => value)}
    `;
};

export interface JustifyContentProps {
    justifyContent?: Breakpoints<
        | 'normal'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
        | 'left'
        | 'right'
        | 'center'
        | 'start'
        | 'end'
        | 'flex-start'
        | 'flex-end'
        | GlobalCssValue
    >;
}

export const justifyContent: CssStyleFn<JustifyContentProps> = ({ justifyContent }: JustifyContentProps) => {
    return cssBreakpoints('justify-content', justifyContent, (value) => value);
};

export interface AlignItemsProps {
    alignItems?: Breakpoints<
        | 'normal'
        | 'stretch'
        | 'center'
        | 'start'
        | 'end'
        | 'self-start'
        | 'self-end'
        | 'flex-start'
        | 'flex-end'
        | 'baseline'
        | GlobalCssValue
    >;
}

export const alignItems: CssStyleFn<AlignItemsProps> = ({ alignItems }: AlignItemsProps) => {
    return cssBreakpoints('align-items', alignItems, (value) => value);
};

export interface OverflowXProps {
    overflowX?: Breakpoints<CssOverflowProperty>;
}

export const overflowX: CssStyleFn<OverflowXProps> = ({ overflowX }: OverflowXProps) => {
    return cssBreakpoints('overflow-x', overflowX, (value) => value);
};

export interface OverflowYProps {
    overflowY?: Breakpoints<CssOverflowProperty>;
}

export const overflowY: CssStyleFn<OverflowYProps> = ({ overflowY }: OverflowYProps) => {
    return cssBreakpoints('overflow-y', overflowY, (value) => value);
};

export interface OverflowProps extends OverflowXProps, OverflowYProps {
    overflow?: Breakpoints<CssOverflowProperty | `${CssOverflowProperty} ${CssOverflowProperty}`>;
}

export const overflow: CssStyleFn<OverflowYProps> = ({ overflow, overflowX, overflowY }: OverflowProps) => {
    if (!overflow && !overflowX && !overflowY) {
        return undefined;
    }
    return css`
        ${cssBreakpoints('overflow', overflow, (value) => value)};
        ${cssBreakpoints('overflow-x', overflowX, (value) => value)};
        ${cssBreakpoints('overflow-y', overflowY, (value) => value)};
    `;
};

export interface ZIndexProps {
    zIndex?: number;
}

export const zIndex: CssStyleFn<ZIndexProps> = ({ zIndex }: ZIndexProps) => {
    return cssBreakpoints('z-index', zIndex, (value) => `${value}`);
};
