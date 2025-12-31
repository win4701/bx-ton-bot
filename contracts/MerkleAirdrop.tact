contract MerkleAirdrop {
  address public admin;
  bytes32 public merkleRoot;
  map<address, bool> claimed;

  init(address _admin, bytes32 _root) {
    admin = _admin;
    merkleRoot = _root;
  }

  receive("claim") {
    let user = sender();
    require(!claimed[user], "ALREADY_CLAIMED");

    let proof = msg.body~loadBytes();
    let amount = msg.body~loadUint(64);

    let leaf = sha256(user, amount);
    require(verifyMerkle(proof, leaf, merkleRoot), "INVALID_PROOF");

    claimed[user] = true;
    send(user, amount);
  }
}
