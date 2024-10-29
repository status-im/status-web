{
  source ? builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/614b4613980a522ba49f0d194531beddbb7220d3.tar.gz";
    sha256 = "sha256:1kipdjdjcd1brm5a9lzlhffrgyid0byaqwfnpzlmw3q825z7nj6w";
  },
  pkgs ? import (source) {}
}:

pkgs.mkShell {
  name = "browser-extension-shell";

  buildInputs = with pkgs; [
    nodejs_20
    pnpm
  ];
}
