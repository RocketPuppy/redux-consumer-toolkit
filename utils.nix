{ nixpkgs }:
{
  # A simple derivation that just creates a file with the names of all of its
  # inputs.  If built, it will have a runtime dependency on all of the given
  # build inputs.
  pinBuildInputs = drvName: buildInputs: otherDeps: nixpkgs.runCommand drvName {
    buildCommand = ''
      mkdir "$out"
      echo "$propagatedBuildInputs $buildInputs $nativeBuildInputs $propagatedNativeBuildInputs $otherDeps" > "$out/deps"
    '';
    inherit buildInputs otherDeps;
  } "";

  # The systems that we want to build for on the current system
  cacheTargetSystems = [
    "x86_64-linux"
    # "i686-linux"
    # "x86_64-darwin"
  ];
}
