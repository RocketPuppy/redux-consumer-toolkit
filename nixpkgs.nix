let source = ''
      {
        "owner": "NixOS",
        "repo": "nixpkgs-channels",
        "rev": "a7c8f5e419ba07711c132bf81baaab0e74862cce",
        "sha256": "1y8j32a2ni8ji94bhlmpakikq3f62z040b71966y23jy7nvf8656"
      }
      '';
in
import ((import <nixpkgs> {}).fetchFromGitHub (builtins.fromJSON (source)))
