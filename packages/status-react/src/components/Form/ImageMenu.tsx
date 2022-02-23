import React, { useRef } from "react";
import styled from "styled-components";

import { useClickOutside } from "../../hooks/useClickOutside";
import { useContextMenu } from "../../hooks/useContextMenu";
import { copyImg } from "../../utils/copyImg";
import { downloadImg } from "../../utils/downloadImg";
import { CopyIcon } from "../Icons/CopyIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ImageMenuProps {
  imageId: string;
}

export const ImageMenu = ({ imageId }: ImageMenuProps) => {
  const { showMenu, setShowMenu } = useContextMenu(imageId);

  const ref = useRef(null);
  useClickOutside(ref, () => setShowMenu(false));

  return showMenu ? (
    <ImageDropdown menuRef={ref}>
      <MenuItem onClick={() => copyImg(imageId)}>
        <CopyIcon height={16} width={16} /> <MenuText>Copy image</MenuText>
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
