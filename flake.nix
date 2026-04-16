{
  description = "Flake file for Status Web repo ";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-25.11";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSystem = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = forEachSystem (system: import nixpkgs { inherit system; });
    in
      {
      formatter = forEachSystem (system: pkgsFor.${system}.nixpkgs-fmt);

      devShells = forEachSystem (system: {
        default = pkgsFor.${system}.mkShellNoCC {
          packages = with pkgsFor.${system}.buildPackages; [
            ghp-import # 2.1.0
            git        # 2.51.2
            nodejs_22  # 22.22.2
            openssh    # 10.2p1
            pnpm       # 10.28.0
            foundry    # 1.4.4
          ];
        };
      });
    };
}
