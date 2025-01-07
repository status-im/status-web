{
  source ? builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/df27247e6f3e636c119e2610bf12d38b5e98cc79.tar.gz";
    sha256 = "sha256:0bbvimk7xb7akrx106mmsiwf9nzxnssisqmqffla03zz51d0kz2n";
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
