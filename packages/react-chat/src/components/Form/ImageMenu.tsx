import React from "react";
import styled from "styled-components";

import { useContextMenu } from "../../hooks/useContextMenu";
import { copyImg } from "../../utils/copyImg";
import { downloadImg } from "../../utils/downloadImg";
import { CopyIcon } from "../Icons/CopyIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";
import { textSmallStyles } from "../Text";

interface ImageMenuProps {
  imageId: string;
}

export const ImageMenu = ({ imageId }: ImageMenuProps) => {
  const { showMenu } = useContextMenu(imageId);

  return showMenu ? (
    <MenuBlock>
      <MenuList>
        <MenuItem onClick={() => copyImg(imageId)}>
          <CopyIcon /> <MenuText>Copy image</MenuText>
        </MenuItem>
        <MenuItem onClick={() => downloadImg(imageId)}>
          <DownloadIcon />
          <MenuText> Download image</MenuText>
        </MenuItem>
      </MenuList>
    </MenuBlock>
  ) : (
    <></>
  );
};

const MenuBlock = styled.div`
  width: 176px;
  height: 84px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  padding: 8px 0;
  position: absolute;
  left: 120px;
  top: 46px;
  z-index: 2;
`;

const MenuList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
`;

const MenuText = styled.span`
  margin-left: 6px;
  color: ${({ theme }) => theme.primary};

  ${textSmallStyles}
`;
