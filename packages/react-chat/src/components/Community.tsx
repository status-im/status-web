import React, { useState } from "react";

import { CommunityData } from "../helpers/communityMock";
import { Theme } from "../styles/themes";

import { CommunityIdentity } from "./CommunityIdentity";
import { CommunityModal } from "./Modals/CommunityModal";

interface CommunityProps {
  theme: Theme;
  community: CommunityData;
  className?: string;
}

export function Community({ theme, community, className }: CommunityProps) {
  const { name, icon, members, description } = community;

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <button className={className} onClick={() => setIsModalVisible(true)}>
        <CommunityIdentity
          name={name}
          icon={icon}
          subtitle={`${members} members`}
          theme={theme}
        />
      </button>
      <CommunityModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        icon={icon}
        name={name}
        theme={theme}
        subtitle="Public Community"
        description={description}
        publicKey="0xD95DBdaB08A9FED2D71ac9C3028AAc40905d8CF3"
      />
    </>
  );
}
