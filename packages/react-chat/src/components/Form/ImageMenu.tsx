import React from "react";
import styled from "styled-components";

import { useContextMenu } from "../../hooks/useContextMenu";
import { copyImg } from "../../utils/copyImg";
import { downloadImg } from "../../utils/downloadImg";
import { CopySvg } from "../Icons/CopyIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ImageMenuProps {
  imageId: string;
}

export const ImageMenu = ({ imageId }: ImageMenuProps) => {
  const { showMenu, setShowMenu } = useContextMenu(imageId);

  return showMenu ? (
    <ImageDropdown closeMenu={setShowMenu}>
      <MenuItem onClick={() => copyImg(imageId)}>
        <CopySvg height={16} width={16} /> <MenuText>Copy image</MenuText>
      </MenuItem>
      <MenuItem onClick={() => downloadImg(imageId)}>
        <DownloadIcon height={16} width={16} />
        <MenuText> Download image</MenuText>
      </MenuItem>
    </ImageDropdown>
  ) : (
    <></>
  );
};

const ImageDropdown = styled(DropdownMenu)`
  width: 176px;
  left: 120px;
  top: 46px;
`;
