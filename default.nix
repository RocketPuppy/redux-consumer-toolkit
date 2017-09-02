{ nixpkgsFn ? import ./nixpkgs.nix
, system ? null }:
let nixpkgs = nixpkgsFn ({
      # extra config goes here
    } // ( if system == null then {} else { inherit system; } ));
in
nixpkgs.stdenv.mkDerivation {
  name = "redux-consumer-toolkit";
  buildInputs = with nixpkgs; [ nodejs flow (import <custom_pkgs> {}).Literate git ];
  src = "/home/dwilson/redux-consumer-toolkit";

  builder = builtins.toFile "builder.sh" ''
    echo "Use this derivation with nix-shell only"

    exit 1
  '';

  shellHook = ''
    export PATH=$src/node_modules/.bin:$PATH
    cd $src
  '';
}
