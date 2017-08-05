{ nixpkgsFn ? import ./nixpkgs.nix }:
(import ./default.nix { inherit nixpkgsFn; })
