{ nixpkgs ? import ./nixpkgs.nix {} }:
with (import ./utils.nix) { inherit nixpkgs; };
let inputs = builtins.concatLists [
      (map (system: import ./default.nix { inherit system; }) cacheTargetSystems)
    ];
    otherDeps = [];
in pinBuildInputs "staticland-redux" inputs otherDeps
