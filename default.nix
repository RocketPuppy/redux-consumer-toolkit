{ nixpkgsFn ? import ./nixpkgs.nix
, system ? null }:
let nixpkgs = nixpkgsFn ({
      # extra config goes here
    } // ( if system == null then {} else { inherit system; } ));
in
nixpkgs.stdenv.mkDerivation {
  name = "staticland-redux";
  buildInputs = with nixpkgs; [ nodejs flow awscli ];
  src = "/home/dwilson/staticland-redux";

  builder = builtins.toFile "builder.sh" ''
    echo "Use this derivation with nix-shell only"

    exit 1
  '';

  shellHook = ''
    cd $src
  '';
}
