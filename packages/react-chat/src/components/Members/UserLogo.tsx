import React, { useMemo } from 'react';
import styled from 'styled-components'

type UserLogoProps = {
    radius: number;
    colorWheel: [string, number][]
    icon?: string;
    text?: string;
}

export function UserLogo({ icon, text, radius, colorWheel }: UserLogoProps) {
    const conicGradient = useMemo(
        () => {
            const colors = colorWheel.map((color, idx) => {
                const prevDeg = idx === 0 ? '0deg' : `${colorWheel[idx - 1][1]}deg`
                return `${color[0]} ${prevDeg} ${color[1]}deg`
            }).join(',')
            return `conic-gradient(${colors})`
        }
        , [colorWheel])
    return (
        <Wrapper radius={radius} conicGradient={conicGradient}>
            <Logo icon={icon} radius={radius}>
                {!icon && text &&
                    <TextWrapper>
                        {text}
                    </TextWrapper>
                }
            </Logo>
        </Wrapper>
    )
}

const TextWrapper = styled.div`
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 38px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.4px;
    color: rgba(255, 255, 255, 0.7);
`

const Logo = styled.div<{ radius: number, icon?: string }>`
    width: calc(${({ radius }) => radius}px - 6px);
    height: calc(${({ radius }) => radius}px - 6px);
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    background-color: ${({ theme }) => theme.logoColor};
    background-size: cover;
    background-repeat: no-repeat;
    background-image: ${({ icon }) => icon && `url(${icon}`};
    color: ${({ theme }) => theme.iconTextColor};
    margin: auto;
    display: flex;
`

const Wrapper = styled.div<{ radius: number, conicGradient: string }>`
    width: ${({ radius }) => radius}px;
    height: ${({ radius }) => radius}px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    background: ${({ conicGradient }) => conicGradient};
`