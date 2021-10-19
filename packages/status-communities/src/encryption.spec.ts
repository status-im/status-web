import { expect } from "chai";

import { createSymKeyFromPassword } from "./encryption";

describe("Encryption", () => {
  it("Generate symmetric key from password", async function () {
    const str = "arbitrary data here";
    const symKey = await createSymKeyFromPassword(str);

    expect(Buffer.from(symKey).toString("hex")).to.eq(
      "c49ad65ebf2a7b7253bf400e3d27719362a91b2c9b9f54d50a69117021666c33"
    );
  });
});
